"""
Weather Client Module
Handles weather information from multiple providers
"""

import requests
import json
from datetime import datetime
from typing import Dict, Optional, Tuple
from core.config_loader import ConfigLoader
from integrations.llm.llm_client import LLMClient


class WeatherClient:
    """Weather information client supporting multiple providers"""

    def __init__(self):
        self.config = ConfigLoader()
        self.llm_client = LLMClient()
        self.provider = self.config.get('weather', 'provider', 'qweather')
        self.api_key = self.config.get('weather', 'api_key')
        self.city = self.config.get('weather', 'city', 'shanghai')
        self.timeout = self.config.getint('weather', 'timeout', 10)
        self.units = self.config.get('weather', 'units', 'metric')

    def get_weather(self) -> Dict:
        """
        Get current weather information

        Returns:
            Dict containing weather data with standardized format
        """
        if self.provider == 'qweather':
            return self._get_qweather()
        elif self.provider == 'seniverse':
            return self._get_seniverse()
        elif self.provider == 'openweathermap':
            return self._get_openweathermap()
        else:
            raise ValueError(f"Unsupported weather provider: {self.provider}")

    def _get_qweather(self) -> Dict:
        """Get weather from QWeather (和风天气)"""
        if not self.api_key:
            return self._get_mock_weather()

        try:
            # Get location ID for Shanghai
            location_url = f"https://geoapi.qweather.com/v2/city/lookup"
            location_params = {
                'location': self.city,
                'key': self.api_key
            }
            location_resp = requests.get(location_url, params=location_params, timeout=self.timeout)
            location_data = location_resp.json()

            if location_data.get('code') != '200':
                return self._get_mock_weather()

            location_id = location_data['location'][0]['id']

            # Get current weather
            weather_url = f"https://devapi.qweather.com/v7/weather/now"
            weather_params = {
                'location': location_id,
                'key': self.api_key
            }
            weather_resp = requests.get(weather_url, params=weather_params, timeout=self.timeout)
            weather_data = weather_resp.json()

            # Get daily forecast
            forecast_url = f"https://devapi.qweather.com/v7/weather/3d"
            forecast_resp = requests.get(forecast_url, params=weather_params, timeout=self.timeout)
            forecast_data = forecast_resp.json()

            if weather_data.get('code') != '200':
                return self._get_mock_weather()

            # Parse current weather
            now = weather_data['now']
            current = {
                'temp': int(now['temp']),
                'feels_like': int(now['feelsLike']),
                'condition': now['text'],
                'icon': now['icon'],
                'humidity': int(now['humidity']),
                'wind_speed': float(now['windSpeed']),
                'wind_dir': now['windDir'],
                'pressure': int(now['pressure']),
                'vis': int(now['vis']),
                'update_time': datetime.now().strftime('%H:%M')
            }

            # Parse forecast
            forecast_list = []
            if forecast_data.get('code') == '200' and forecast_data.get('daily'):
                for day in forecast_data['daily'][:3]:
                    forecast_list.append({
                        'date': day['fxDate'],
                        'temp_max': int(day['tempMax']),
                        'temp_min': int(day['tempMin']),
                        'condition': day['textDay'],
                        'icon_day': day['iconDay'],
                        'icon_night': day['iconNight'],
                        'humidity': int(day['humidity']),
                        'wind_speed': float(day['windSpeedDay']),
                        'wind_dir': day['windDirDay'],
                        'precip': float(day['precip'])
                    })

            return {
                'provider': 'qweather',
                'city': self.city,
                'current': current,
                'forecast': forecast_list,
                'success': True,
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            print(f"Weather API error: {e}")
            return self._get_mock_weather()

    def _get_seniverse(self) -> Dict:
        """Get weather from Seniverse (心知天气)"""
        if not self.api_key:
            return self._get_mock_weather()

        try:
            url = "https://api.seniverse.com/v3/weather/now.json"
            params = {
                'key': self.api_key,
                'location': self.city,
                'language': 'zh-Hans',
                'unit': self.units
            }

            resp = requests.get(url, params=params, timeout=self.timeout)
            data = resp.json()

            if 'results' not in data:
                return self._get_mock_weather()

            result = data['results'][0]
            now = result['now']
            location = result['location']

            # Parse current weather
            current = {
                'temp': int(now['temperature']),
                'feels_like': int(now.get('feels_like', now['temperature'])),
                'condition': now['text'],
                'icon': now['code'],
                'humidity': int(now.get('humidity', 0)),
                'wind_speed': float(now.get('wind_speed', 0)),
                'wind_dir': now.get('wind_direction', '未知'),
                'pressure': int(now.get('pressure', 0)),
                'vis': int(now.get('visibility', 0)),
                'update_time': now.get('last_update', '').split('T')[-1][:5]
            }

            return {
                'provider': 'seniverse',
                'city': location.get('name', self.city),
                'current': current,
                'forecast': [],
                'success': True,
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            print(f"Weather API error: {e}")
            return self._get_mock_weather()

    def _get_openweathermap(self) -> Dict:
        """Get weather from OpenWeatherMap"""
        if not self.api_key:
            return self._get_mock_weather()

        try:
            url = "https://api.openweathermap.org/data/2.5/weather"
            params = {
                'q': self.city,
                'appid': self.api_key,
                'units': self.units,
                'lang': 'zh_cn'
            }

            resp = requests.get(url, params=params, timeout=self.timeout)
            data = resp.json()

            if data.get('cod') != 200:
                return self._get_mock_weather()

            main = data['main']
            weather = data['weather'][0]
            wind = data.get('wind', {})

            # Parse current weather
            current = {
                'temp': int(main['temp']),
                'feels_like': int(main['feels_like']),
                'condition': weather['description'].title(),
                'icon': weather['icon'],
                'humidity': main['humidity'],
                'wind_speed': wind.get('speed', 0),
                'wind_dir': self._deg_to_dir(wind.get('deg', 0)),
                'pressure': main['pressure'],
                'vis': data.get('visibility', 0) // 1000,
                'update_time': datetime.now().strftime('%H:%M')
            }

            return {
                'provider': 'openweathermap',
                'city': data['name'],
                'current': current,
                'forecast': [],
                'success': True,
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            print(f"Weather API error: {e}")
            return self._get_mock_weather()

    def _get_mock_weather(self) -> Dict:
        """Get mock weather data for testing/development"""
        # Simulate seasonal weather for Shanghai
        month = datetime.now().month

        # Season-based mock data
        if 3 <= month <= 5:  # Spring
            temp_range = (12, 20)
            conditions = ['多云', '晴', '阴', '小雨']
            humidity_range = (60, 75)
        elif 6 <= month <= 8:  # Summer
            temp_range = (25, 35)
            conditions = ['晴', '多云', '雷阵雨']
            humidity_range = (70, 85)
        elif 9 <= month <= 11:  # Autumn
            temp_range = (15, 25)
            conditions = ['晴', '多云', '阴']
            humidity_range = (55, 70)
        else:  # Winter
            temp_range = (2, 12)
            conditions = ['晴', '多云', '阴', '小雨']
            humidity_range = (50, 65)

        import random

        current = {
            'temp': random.randint(*temp_range),
            'feels_like': random.randint(*temp_range),
            'condition': random.choice(conditions),
            'icon': 'mock',
            'humidity': random.randint(*humidity_range),
            'wind_speed': round(random.uniform(0, 15), 1),
            'wind_dir': random.choice(['东', '南', '西', '北', '东南', '东北', '西南', '西北']),
            'pressure': random.randint(1000, 1020),
            'vis': random.randint(5, 20),
            'update_time': datetime.now().strftime('%H:%M')
        }

        # Generate mock forecast
        forecast = []
        for i in range(3):
            date = datetime.now().strftime('%Y-%m-%d')
            if i > 0:
                from datetime import timedelta
                date = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d')

            forecast.append({
                'date': date,
                'temp_max': current['temp'] + random.randint(0, 5),
                'temp_min': current['temp'] - random.randint(0, 5),
                'condition': random.choice(conditions),
                'icon_day': 'mock',
                'icon_night': 'mock',
                'humidity': current['humidity'] + random.randint(-10, 10),
                'wind_speed': round(random.uniform(0, 15), 1),
                'wind_dir': current['wind_dir'],
                'precip': random.uniform(0, 10) if '雨' in random.choice(conditions) else 0
            })

        return {
            'provider': 'mock',
            'city': self.city,
            'current': current,
            'forecast': forecast,
            'success': True,
            'timestamp': datetime.now().isoformat()
        }

    def _deg_to_dir(self, degree: int) -> str:
        """Convert wind degree to direction"""
        directions = ['北', '北北东', '东北', '东北东', '东', '东南东',
                     '东南', '南南东', '南', '南南西', '西南', '西南西',
                     '西', '西北西', '西北', '北北西']
        index = round(degree / 22.5) % 16
        return directions[index]

    def get_weather_summary(self) -> str:
        """
        Get human-readable weather summary

        Returns:
            Formatted weather description
        """
        weather = self.get_weather()

        if not weather['success']:
            return "无法获取天气信息"

        current = weather['current']

        summary = f"""今日天气概况：
• 气温：{current['temp']}°C (体感 {current['feels_like']}°C)
• 天气：{current['condition']}
• 湿度：{current['humidity']}%
• 风速：{current['wind_speed']} {current['wind_dir']}风
• 更新时间：{current['update_time']}"""

        if weather['forecast']:
            today = weather['forecast'][0]
            summary += f"""
今日预报：
• 最高：{today['temp_max']}°C，最低：{today['temp_min']}°C
• 天气：{today['condition']}"""

        return summary

    def analyze_for_outfit(self, weather: Dict) -> str:
        """
        Analyze weather for outfit recommendation

        Args:
            weather: Weather data dictionary

        Returns:
            Outfit recommendation analysis
        """
        if not weather['success']:
            return "无法获取天气信息，请根据实际情况选择"

        current = weather['current']
        temp = current['temp']
        condition = current['condition']
        humidity = current['humidity']
        wind_speed = current['wind_speed']

        analysis = []

        # Temperature analysis
        if temp >= 30:
            analysis.append("高温天气，建议选择轻薄透气的衣物")
        elif temp >= 25:
            analysis.append("温暖舒适，适合春秋装")
        elif temp >= 20:
            analysis.append("温度适中，建议携带薄外套")
        elif temp >= 15:
            analysis.append("较凉爽，需要穿外套或毛衣")
        elif temp >= 10:
            analysis.append("较冷，建议穿厚外套")
        else:
            analysis.append("寒冷，需要穿羽绒服或厚大衣")

        # Condition analysis
        if '雨' in condition:
            analysis.append("有降雨，建议携带雨具")
        elif '雪' in condition:
            analysis.append("有降雪，建议穿防水鞋")
        elif '晴' in condition:
            analysis.append("阳光充足，可考虑防晒")
        elif '多云' in condition:
            analysis.append("多云天气，适合层次穿搭")

        # Wind analysis
        if wind_speed >= 20:
            analysis.append("风力较大，建议穿防风外套")
        elif wind_speed >= 10:
            analysis.append("有一定风力，注意保暖")

        # Humidity analysis
        if humidity >= 80:
            analysis.append("湿度较高，选择透气面料")
        elif humidity <= 30:
            analysis.append("干燥天气，注意保湿")

        return "\n".join(analysis)

    def get_outfit_prompt(self) -> str:
        """
        Generate prompt for LLM to create outfit recommendation

        Returns:
            Formatted prompt string
        """
        weather = self.get_weather()
        weather_summary = self.get_weather_summary()
        outfit_analysis = self.analyze_for_outfit(weather)

        # Load user preferences
        try:
            with open('aboutme.md', 'r', encoding='utf-8') as f:
                user_info = f.read()
        except:
            user_info = "用户是37岁男性技术专家，生活在中国上海。"

        prompt = f"""你是专业的穿搭顾问，请根据以下信息为大洪生成今日穿搭建议：

【用户信息】
{user_info}

【天气信息】
{weather_summary}

【穿搭分析】
{outfit_analysis}

请提供完整的穿搭建议，包括：
1. 今日主题/风格定位
2. 上装建议（内搭+外搭）
3. 下装建议
4. 鞋履建议
5. 配饰建议（围巾、包包等）
6. 穿搭小贴士

请用中文回复，语气要专业且友好，考虑用户的年龄和职业特点。"""

        return prompt