# 长对话准确性优化方案

## 📊 项目背景与问题分析

### 当前对话管理状态

**现有优势**：
- **ContextBus**：智能体间短期状态共享（单次管道运行）
- **MemoryManager**：规划中的向量存储（ChromaDB）
- **结构化数据库**：SQLite存储任务、健康、新闻等数据
- **按日期组织的Markdown日志文件**

**核心问题**：
1. **无对话历史摘要**：每次调用都是全新对话，缺乏历史上下文
2. **无智能上下文修剪**：所有历史信息同等重要，导致信息稀释
3. **无分层记忆**：短期/中期/长期记忆混合，模型难以区分优先级
4. **向量记忆未实现**：`MemoryManager`仅为占位符

## 🎯 优化目标

| 维度 | 目标 | 衡量指标 |
|------|------|----------|
| **准确性** | 提升模型对最新关键信息的关注度 | 最新任务识别准确率 >90% |
| **效率** | 减少冗余token使用，提高响应速度 | 上下文长度减少30-50% |
| **连续性** | 保持跨会话的个性化记忆 | 用户偏好记忆准确率 >85% |

## 🏗️ 四层对话管理架构

```
┌─────────────────────────────────────────────────┐
│                 Agent Processing                 │
│  (Current turn with full relevant context)      │
├─────────────────────────────────────────────────┤
│         Short-term Context (滑动窗口)            │
│  (Last 3-5 exchanges, high detail)              │
├─────────────────────────────────────────────────┤
│         Mid-term Summary (对话摘要)              │
│  (Last 24h key points, compressed)              │
├─────────────────────────────────────────────────┤
│         Long-term Memory (向量检索)              │
│  (Semantic search for relevant past experiences)│
└─────────────────────────────────────────────────┘
```

## 🔧 核心组件设计

### 1. 对话摘要引擎 (`conversation_summarizer.py`)

```python
class ConversationSummarizer:
    def __init__(self, llm_client):
        self.llm = llm_client
        self.summary_cache = {}  # date -> summary

    def generate_turn_summary(self, messages: List[Dict], max_tokens: int = 200) -> str:
        """生成单轮对话摘要，提取关键决策和行动"""
        prompt = f"""请从以下对话中提取关键信息：
        1. 用户的主要请求/问题
        2. 助理的关键建议/决策
        3. 达成的共识或待办事项
        4. 重要细节（时间、地点、数量等）

        对话内容：
        {json.dumps(messages[-5:], ensure_ascii=False)}

        请用中文总结，不超过{max_tokens}字："""

        return self.llm.generate(prompt)
```

### 2. 滑动窗口上下文管理器 (`context_window.py`)

```python
class ContextWindowManager:
    def __init__(self, max_tokens: int = 4000, max_exchanges: int = 10):
        self.max_tokens = max_tokens
        self.max_exchanges = max_exchanges
        self.message_buffer = []

    def add_message(self, role: str, content: str):
        """添加新消息，自动维护窗口大小"""
        self.message_buffer.append({"role": role, "content": content})

        # 检查是否需要修剪
        if len(self.message_buffer) > self.max_exchanges:
            self._prune_oldest()
```

### 3. 增强版MemoryManager (`enhanced_memory.py`)

```python
class EnhancedMemoryManager:
    def __init__(self, llm_client, vector_db_path="data/vector_memory"):
        self.llm = llm_client
        self.vector_store = ChromaDBStore(path=vector_db_path)

        # 记忆分类
        self.memory_categories = [
            "user_preferences",  # 用户偏好
            "important_decisions",  # 重要决策
            "task_history",  # 任务历史
            "health_patterns",  # 健康模式
            "work_habits"  # 工作习惯
        ]
```

### 4. 智能上下文组装器 (`context_orchestrator.py`)

```python
class ContextOrchestrator:
    def __init__(self, config):
        self.window_mgr = ContextWindowManager()
        self.memory_mgr = EnhancedMemoryManager(config.llm_client)
        self.summarizer = ConversationSummarizer(config.llm_client)

    def assemble_context(self, agent_type: str, user_query: str) -> str:
        """智能组装多层上下文"""
        context_parts = []
        context_parts.append(self._get_system_prompt(agent_type))
        context_parts.append(self.memory_mgr.get_relevant_context(user_query))
        context_parts.append(self.summarizer.get_daily_summary())
        context_parts.append(self.window_mgr.get_context())
        return "\n\n".join(context_parts)
```

## 📈 实施路线图

### 阶段1：基础摘要功能（1-2周）
1. ✅ 实现`ConversationSummarizer`类
2. ✅ 修改`BaseAgent`，在`run()`方法后自动生成摘要
3. ✅ 将摘要存储到新的`conversation_summaries`数据库表

### 阶段2：滑动窗口管理（1周）
1. ⬜ 集成`ContextWindowManager`到`ContextBus`
2. ⬜ 在coordinator中跟踪跨智能体的对话流
3. ⬜ 添加token计数和自动修剪

### 阶段3：向量记忆集成（2-3周）
1. ⬜ 安装并配置ChromaDB
2. ⬜ 完成`EnhancedMemoryManager`实现
3. ⬜ 添加记忆分类和检索功能

### 阶段4：智能上下文组装（1周）
1. ⬜ 实现`ContextOrchestrator`
2. ⬜ 集成到所有agent的`run()`方法
3. ⬜ 性能测试和优化

## 🔍 关键性能优化策略

### 1. 动态token分配

```python
def allocate_token_budget(total_limit: int = 8000) -> Dict[str, int]:
    """动态分配token预算"""
    return {
        "system_instructions": 500,      # 固定
        "long_term_memory": 1500,        # 根据相关性动态调整
        "mid_term_summary": 1000,        # 压缩摘要
        "short_term_context": 4000,      # 详细近期对话
        "current_query": 500,            # 当前输入
        "response_buffer": 500           # 预留响应空间
    }
```

### 2. 重要性评分算法

```python
def calculate_message_importance(message: Dict, agent_type: str) -> float:
    """计算消息重要性得分（0-1）"""
    score = 0.5  # 基础分

    # 加分项
    if "重要" in message["content"] or "important" in message["content"].lower():
        score += 0.3
    if "决定" in message["content"] or "decision" in message["content"].lower():
        score += 0.2

    # 时间衰减（越新越重要）
    time_factor = 1.0 - (message["age_minutes"] / 1440)  # 24小时衰减
    score *= time_factor

    return min(1.0, score)
```

### 3. 上下文压缩策略

| 策略 | 适用场景 | 压缩比 | 信息损失 |
|------|----------|--------|----------|
| **提取式摘要** | 任务列表、关键决策 | 60-70% | 低 |
| **抽象式摘要** | 日常对话、闲聊 | 80-90% | 中 |
| **关键词提取** | 技术讨论、参数设置 | 50-60% | 低 |
| **时间线合并** | 重复性日常活动 | 70-80% | 低 |

## 🧪 测试与验证方案

### 准确性测试

```python
def test_context_accuracy():
    """测试上下文保持准确性"""
    # 模拟长对话序列
    conversation = generate_long_conversation(50_turns)

    # 使用不同策略处理
    strategies = ["full_context", "sliding_window", "summary_compression"]

    for strategy in strategies:
        accuracy = evaluate_response_relevance(
            original=conversation,
            processed=apply_strategy(conversation, strategy),
            key_info=["会议时间", "任务优先级", "健康建议"]
        )
        print(f"{strategy}: {accuracy:.2%}")
```

### 性能基准

```python
# 预期改进指标
expected_improvements = {
    "token_usage": "-40%",      # 从8000token减少到4800
    "response_time": "-25%",    # 减少LLM处理时间
    "accuracy_latest_info": "+30%",  # 对最新信息响应更准确
    "memory_recall": "+50%"     # 重要历史信息召回率
}
```

## 💡 与现有架构的集成

### 修改BaseAgent

```python
class EnhancedBaseAgent(BaseAgent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.context_orchestrator = ContextOrchestrator(self.config)

    def run(self, user_input: str, **kwargs) -> str:
        # 获取优化上下文
        context = self.context_orchestrator.assemble_context(
            agent_type=self.name,
            user_query=user_input
        )

        # 使用优化后的上下文调用LLM
        response = self.llm.generate_with_context(context)

        # 记录交互到记忆系统
        self.context_orchestrator.memory_mgr.add_interaction(
            agent_type=self.name,
            query=user_input,
            response=response
        )

        return response
```

### 增强Coordinator

```python
class EnhancedChiefOfStaff(ChiefOfStaff):
    def __init__(self, config_path):
        super().__init__(config_path)
        self.conversation_tracker = ConversationTracker()

    def run_daily_pipeline(self, target_date=None):
        # 在管道开始前加载相关历史
        historical_context = self._load_relevant_history(target_date)
        self.bus.set("historical_context", historical_context, source="orchestrator")

        # 运行原有管道...
        results = super().run_daily_pipeline(target_date)

        # 管道结束后生成综合摘要
        pipeline_summary = self._generate_pipeline_summary(results)
        self.conversation_tracker.save_daily_summary(target_date, pipeline_summary)

        return results
```

## 📊 监控与评估指标

建议添加以下监控指标：

```python
class ConversationMetrics:
    metrics = {
        "context_length_tokens": [],      # 上下文token数
        "summary_compression_ratio": [],  # 摘要压缩率
        "key_info_retention_rate": [],    # 关键信息保留率
        "response_relevance_score": [],   # 响应相关性得分
        "memory_recall_accuracy": []      # 记忆召回准确率
    }
```

## 🚀 快速开始建议

### 立即可实施的改进（1天内完成）
1. ⬜ 在`BaseAgent._save_log()`中添加简单的摘要生成
2. ⬜ 在`ContextBus`中添加消息计数和基本修剪
3. ⬜ 实现按重要性过滤的简单算法

### 中期优化（1-2周）
1. ⬜ 完成`ConversationSummarizer`并集成到所有agent
2. ⬜ 实现滑动窗口管理
3. ⬜ 添加基本的向量记忆（使用SentenceTransformers + SQLite）

### 长期架构（1个月）
1. ⬜ 完整的四层记忆系统
2. ⬜ ChromaDB集成和语义检索
3. ⬜ 智能上下文组装和动态token分配

## 📋 文件清单

需要新增的文件：
```
backend/src/core/conversation_summarizer.py
backend/src/core/context_window.py
backend/src/core/enhanced_memory.py
backend/src/core/context_orchestrator.py
backend/src/core/conversation_tracker.py
backend/src/api/models/conversation_summaries.py
```

需要修改的文件：
```
backend/src/agents/base.py
backend/src/core/coordinator.py
backend/src/core/memory_manager.py
backend/src/api/database.py
```

## 💎 总结

通过这套优化方案，AI生活助理将能够：

1. **显著减少**长对话导致的准确性下降（预计提升30-40%）
2. **智能保持**重要历史信息的可用性，同时过滤冗余信息
3. **动态优化**token使用效率，降低API成本
4. **提升跨会话**的个性化和连续性体验

**核心建议**：从阶段1的对话摘要功能开始，这是投入产出比最高的改进，预计可立即提升20-30%的长对话准确性。

---

*文档生成时间：2026年1月19日*
*关联项目：AI Life Assistant v2.0*
*文档版本：1.0*