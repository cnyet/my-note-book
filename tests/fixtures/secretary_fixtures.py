"""
Fixtures for secretary agent tests.
"""

import pytest
from unittest.mock import Mock


@pytest.fixture
def mock_llm_response():
    """Mock LLM response."""
    return {
        'content': 'Generated content',
        'usage': {'total_tokens': 100}
    }


@pytest.fixture
def sample_news_content():
    """Sample news content for testing."""
    return """## TechCrunch AI
**New AI Model Released**
https://example.com/article1
Major breakthrough in AI technology.

**AI Startup Raises Funding**
https://example.com/article2
Startup secures $50M for AI development.
"""


@pytest.fixture
def sample_work_content():
    """Sample work log content for testing."""
    return """# 今日工作规划

## 今日TODO

### 🚨 高优先级
- [x] **Complete project documentation** - Finished
  - Priority: High
  - Est. Time: 2 hours

- [ ] **Review pull requests** - Pending
  - Priority: High
  - Est. Time: 1 hour

### ⚡ 中优先级
- [x] **Team meeting** - Completed
  - Priority: Medium
  - Est. Time: 30 minutes

- [ ] **Update dependencies** - Pending
  - Priority: Medium
  - Est. Time: 1 hour

### 📝 低优先级/待办
- [ ] **Read technical articles** - Pending
  - Priority: Low
  - Est. Time: 30 minutes
"""


@pytest.fixture
def sample_life_content():
    """Sample life log content for testing."""
    return """# 今日生活管理

## 🥗 饮食计划

### 早餐 (07:30)
- 全麦面包2片 + 鸡蛋2个
- 牛奶250ml

### 午餐 (12:30)
- 糙米饭1小碗
- 清蒸鱼 100g

### 晚餐 (19:30)
- 杂粮饭1/2碗
- 蔬菜沙拉

## 🏃‍♂️ 运动安排
- 快走 30分钟
- 力量训练 20分钟

## 💡 健康小贴士
1. 饮水提醒：每小时饮水200ml，目标2000ml/天
2. 护眼建议：工作45分钟，远眺5分钟

饮水量：1800ml
"""


@pytest.fixture
def sample_outfit_content():
    """Sample outfit log content for testing."""
    return """# 今日穿搭建议

## 天气概况
- 温度：22°C
- 状况：Partly Cloudy
- 地点：上海

## 👔 主要穿搭

### 上装
- 深蓝色牛津纺衬衫

### 下装
- 卡其色休闲裤

### 鞋履
- 深棕色皮鞋

## 💡 穿搭小贴士
1. 地铁通勤建议选择透气面料
2. 办公室空调较冷，准备薄外套
"""


@pytest.fixture
def sample_review_content():
    """Sample review log content for testing."""
    return """# 今日复盘

## 🌟 今日亮点与成就
- 完成了重要项目文档
- 参加了团队会议并提出建设性意见
- 坚持了运动计划

## 📊 深度分析

### 工作表现
今天的工作效率很高，完成了计划中的主要任务。

### 个人成长
学习了新的技术知识，提升了技能。

### 生活状态
保持了健康的生活习惯，运动和饮食都很规律。

## 🎯 改进机会
- 时间管理还有提升空间
- 可以更专注于深度工作

## 💡 洞察与启发
坚持记录和反思是成长的关键。

## 🙏 感恩时刻
- 感恩团队的支持
- 感恩自己的坚持

## 🚀 明日行动计划
1. 继续完成待办任务
2. 保持运动习惯
3. 学习新技术
"""


@pytest.fixture
def mock_weather_data():
    """Mock weather data for testing."""
    return {
        'success': True,
        'current': {
            'temp': 22,
            'condition': 'Partly Cloudy',
            'humidity': 65,
            'wind_speed': 5
        },
        'forecast': [
            {
                'temp_max': 25,
                'temp_min': 18,
                'condition': 'Partly Cloudy'
            }
        ]
    }


@pytest.fixture
def mock_weather_client():
    """Mock weather client."""
    client = Mock()
    client.get_weather.return_value = {
        'success': True,
        'current': {
            'temp': 22,
            'condition': 'Partly Cloudy',
            'humidity': 65,
            'wind_speed': 5
        },
        'forecast': [
            {
                'temp_max': 25,
                'temp_min': 18,
                'condition': 'Partly Cloudy'
            }
        ]
    }
    return client
