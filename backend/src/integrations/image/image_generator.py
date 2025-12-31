"""
Image Generator Module
Handles image generation for outfit visualization using Jimeng AI
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, Optional, List
from utils.config_loader import ConfigLoader
from utils.llm_client import LLMClient


class ImageGenerator:
    """Image generation client for outfit visualization"""

    def __init__(self):
        self.config = ConfigLoader()
        self.llm_client = LLMClient()
        self.base_url = self.config.get('jimeng', 'base_url', 'https://api.jimeng.jianying.com')
        self.api_key = self.config.get('jimeng', 'api_key')
        self.output_dir = os.path.join('data', 'daily_logs', datetime.now().strftime('%Y-%m-%d'))

        # Ensure output directory exists
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_outfit_image(self, outfit_description: str, weather_info: Dict) -> Optional[str]:
        """
        Generate outfit visualization image

        Args:
            outfit_description: Text description of the outfit
            weather_info: Weather information

        Returns:
            Path to generated image or None if failed
        """
        if not self.api_key:
            print("⚠️  Jimeng AI API key not configured, skipping image generation")
            return None

        try:
            # Build prompt for image generation
            prompt = self._build_image_prompt(outfit_description, weather_info)

            print("🎨 生成穿搭可视化图像...")

            # Generate image using Jimeng AI
            image_url = self._call_jimeng_api(prompt)

            if image_url:
                # Download and save image
                image_path = self._download_image(image_url)
                if image_path:
                    print(f"✅ 图像已保存: {image_path}")
                    return image_path

        except Exception as e:
            print(f"❌ 图像生成失败: {e}")

        return None

    def _build_image_prompt(self, outfit_description: str, weather_info: Dict) -> str:
        """
        Build detailed prompt for outfit image generation

        Args:
            outfit_description: Text description of the outfit
            weather_info: Weather information

        Returns:
            Formatted prompt for image generation
        """
        # Extract key information from weather
        temp = weather_info.get('current', {}).get('temp', 20)
        condition = weather_info.get('current', {}).get('condition', '晴天')

        # Determine scene based on weather
        if temp < 10:
            scene = "winter street, chilly weather"
            background = "city street in winter, bare trees"
        elif temp < 20:
            scene = "autumn/spring street, mild weather"
            background = "city street with fallen leaves or blooming trees"
        elif temp < 30:
            scene = "pleasant day, clear weather"
            background = "modern city street or office building"
        else:
            scene = "hot summer day"
            background = "shaded area near modern buildings"

        # Build comprehensive prompt
        prompt = f"""Generate a realistic fashion illustration of a 37-year-old Asian male software engineer wearing:

{outfit_description}

Style requirements:
- Photorealistic fashion photography style
- Full body shot, standing pose
- Clean, professional appearance suitable for a tech professional
- Background: {background}
- Lighting: Natural, soft lighting appropriate for {condition.lower()}
- Composition: Centered subject with slight angle to show outfit details
- Color accuracy: Match the described colors exactly
- Quality: High resolution, detailed textures

Weather context:
- Temperature: {temp}°C
- Condition: {condition}
- Scene: {scene}

The person should have a confident, approachable demeanor, typical of a tech professional. Avoid exaggerated poses or expressions. Focus on showcasing the outfit clearly and professionally."""

        return prompt

    def _call_jimeng_api(self, prompt: str) -> Optional[str]:
        """
        Call Jimeng AI API to generate image

        Args:
            prompt: Image generation prompt

        Returns:
            Image URL or None if failed
        """
        try:
            # Jimeng AI API endpoint (example - adjust based on actual API)
            url = f"{self.base_url}/v1/image/generations"

            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }

            payload = {
                'prompt': prompt,
                'num_images': 1,
                'size': '1024x1024',
                'style': 'realistic',
                'quality': 'high'
            }

            response = requests.post(url, headers=headers, json=payload, timeout=60)

            if response.status_code == 200:
                data = response.json()
                # Extract image URL from response
                # Note: Adjust based on actual Jimeng AI API response format
                if 'images' in data and data['images']:
                    return data['images'][0]['url']
                elif 'image_url' in data:
                    return data['image_url']

            print(f"API Error: {response.status_code} - {response.text}")
            return None

        except Exception as e:
            print(f"Jimeng API call failed: {e}")
            return None

    def _download_image(self, image_url: str) -> Optional[str]:
        """
        Download generated image and save locally

        Args:
            image_url: URL of the generated image

        Returns:
            Local path to saved image or None if failed
        """
        try:
            # Generate filename with timestamp
            timestamp = datetime.now().strftime('%H%M%S')
            filename = f"outfit_visualization_{timestamp}.jpg"
            filepath = os.path.join(self.output_dir, filename)

            # Download image
            response = requests.get(image_url, stream=True, timeout=30)
            response.raise_for_status()

            # Save image
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            return filepath

        except Exception as e:
            print(f"Failed to download image: {e}")
            return None

    def generate_mock_outfit_image(self, outfit_description: str) -> str:
        """
        Generate a placeholder image description when API is not available

        Args:
            outfit_description: Text description of the outfit

        Returns:
            Path to placeholder info file
        """
        timestamp = datetime.now().strftime('%H%M%S')
        filename = f"outfit_placeholder_{timestamp}.md"
        filepath = os.path.join(self.output_dir, filename)

        content = f"""# 穿搭可视化说明

生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 穿搭描述
{outfit_description}

## 可视化效果
由于未配置图像生成API，此处为穿搭效果的文字描述。

建议想象场景：
- 一位37岁的亚洲男性技术专家
- 站在现代城市街道或办公楼前
- 专业而自信的姿态
- 清爽自然的灯光
- 展现服装的细节和搭配

## 配置图像生成
要启用实际的图像生成功能，请：
1. 注册 Jimeng AI 账号
2. 获取 API 密钥
3. 在 config/config.ini 中配置：
   ```ini
   [jimeng]
   api_key = YOUR_JIMENG_API_KEY
   ```
"""

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        return filepath

    def create_outfit_collage_info(self, items: List[Dict]) -> str:
        """
        Create information for outfit collage (multiple items)

        Args:
            items: List of outfit items with descriptions

        Returns:
            Formatted markdown with outfit breakdown
        """
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        filename = f"outfit_breakdown_{timestamp}.md"
        filepath = os.path.join(self.output_dir, filename)

        content = f"""# 今日穿搭细节分解

生成时间: {timestamp}

## 穿搭单品清单

"""

        for i, item in enumerate(items, 1):
            content += f"""### {i}. {item.get('category', '单品')}

**描述**: {item.get('description', 'N/A')}
**颜色**: {item.get('color', 'N/A')}
**材质**: {item.get('material', 'N/A')}
**品牌** (可选): {item.get('brand', 'N/A')}
**搭配建议**: {item.get('styling_tip', 'N/A')}

---

"""

        content += """## 搭配要点

- 整体风格：商务休闲，适合技术专业人士
- 色彩搭配：和谐统一，突出专业感
- 舒适度：考虑全天穿着的舒适性
- 场合适应性：通勤、办公、非正式会议

## 保养建议

- 定期检查衣物状态
- 及时清洗和熨烫
- 鞋履保养
- 季节性收纳
"""

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        return filepath