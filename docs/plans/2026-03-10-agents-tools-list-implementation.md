# Agents & Tools 列表页面实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task.

**Goal:** 将 Agents 和 Tools 页面的卡片布局从纵向改为横向列表式，采用统一的浅色背景和简洁的图标 + 标题 + 描述结构。

**Architecture:** 修改现有页面组件的卡片结构和样式，保持网格布局不变，将卡片内容从纵向改为横向排列，简化内容层次。

**Tech Stack:** Next.js 15.5 + React 19.1 + Tailwind CSS + Framer Motion + Lucide Icons

---

## Task 1: 修改 Agents 页面卡片布局

**Files:**
- 修改：`frontend/src/app/(public)/agents/page.tsx`

**步骤：**

1. 读取当前文件内容确认结构

2. 修改卡片样式（第 148-181 行）：
   - 移除渐变色背景，改为统一浅色背景
   - 调整卡片尺寸为横向布局（高约 100-120px）
   - 图标移至左侧（48x48px）
   - 内容区域改为横向排列
   - 移除状态指示器和角色标签
   - 添加右侧箭头悬停效果

3. 修改容器样式（第 130-135 行）：
   - 保持现有网格配置
   - 调整间距以适应新卡片高度

4. 简化配置对象（第 19-60 行）：
   - 移除 `role` 字段
   - 简化 `description` 字段

**预期代码结构：**

```tsx
<div
  className={`group relative backdrop-blur-md bg-white/5
    p-4 rounded-xl border border-white/10
    transition-all duration-300 hover:shadow-lg hover:border-indigo-500/40
    overflow-hidden flex items-center gap-4`}
>
  {/* 左侧图标 */}
  <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10
    flex items-center justify-center flex-shrink-0 ${config.iconColor} transition-colors`}>
    {config.icon}
  </div>

  {/* 内容区域 */}
  <div className="flex-1 min-w-0">
    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
      {agent.name}
    </h3>
    <p className="text-slate-400 text-sm leading-relaxed truncate">
      {config.description}
    </p>
  </div>

  {/* 箭头指示器 */}
  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
    <ArrowRight className="w-5 h-5 text-indigo-400" />
  </div>
</div>
```

---

## Task 2: 修改 Tools 页面卡片布局

**Files:**
- 修改：`frontend/src/app/(public)/tools/page.tsx`

**步骤：**

1. 读取当前文件内容确认结构

2. 修改卡片样式（第 127-152 行）：
   - 移除渐变色背景，改为统一浅色背景
   - 调整卡片尺寸为横向布局
   - 图标移至左侧（48x48px）
   - 内容区域改为横向排列
   - 添加右侧箭头悬停效果

3. 保持网格配置不变（第 119-123 行）

**预期代码结构：**

与 Task 1 类似，但使用 `tool` 对象的属性。

---

## Task 3: 验证与测试

**步骤：**

1. 启动前端开发服务器：
   ```bash
   cd frontend
   npm run dev
   ```

2. 访问页面验证：
   - `http://localhost:3001/agents` - 验证 Agents 页面
   - `http://localhost:3001/tools` - 验证 Tools 页面

3. 检查项：
   - [ ] 卡片为横向布局（图标在左）
   - [ ] 背景为统一浅色
   - [ ] 悬停效果正常（边框高亮 + 箭头出现）
   - [ ] 响应式布局正常
   - [ ] 无 TypeScript 错误

4. 提交代码：
   ```bash
   git add frontend/src/app/\(public\)/agents/page.tsx
   git add frontend/src/app/\(public\)/tools/page.tsx
   git commit -m "feat: 改造 Agents 和 Tools 页面为横向列表布局"
   ```

---

## 验收标准

- [ ] Agents 页面卡片为横向布局（图标在左，内容在右）
- [ ] Tools 页面卡片为横向布局
- [ ] 所有卡片使用统一浅色背景
- [ ] 悬停效果正常（边框高亮 + 箭头淡入）
- [ ] 响应式布局正常（5 列/3 列/2 列/1 列）
- [ ] 无 TypeScript 类型错误
- [ ] Loading/Error 状态正常显示

---

## 相关文件索引

| 文件 | 用途 |
|------|------|
| `frontend/src/app/(public)/agents/page.tsx` | Agents 页面组件 |
| `frontend/src/app/(public)/tools/page.tsx` | Tools 页面组件 |
| `docs/plans/2026-03-10-agents-tools-list-redesign.md` | 设计文档 |
