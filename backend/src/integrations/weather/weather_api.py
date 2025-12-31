#!/usr/bin/env python3
"""
Weather API integration module for fetching weather data.
Supports multiple weather providers: QWeather, OpenWeatherMap, Seniverse.
"""

import requests
import json
from datetime import datetime
from typing import Dict, Optional, List
import logging

logger = logging.getLogger(__name__)

class WeatherAPI:
    """Unified weather API client supporting multiple providers."""

    def __init__(self, config: Dict):
        """
        Initialize weather API client.

        Args:
            config: Configuration dictionary containing API keys and settings
        """
        self.config = config
        self.provider = config.get('provider', 'qweather').lower()
        self.api_key = config.get('api_key', '')
        self.city = config.get('city', 'shanghai')
        self.timeout = config.get('timeout', 10)

        # Provider-specific endpoints
        self.endpoints = {
            'qweather': {
                'current': 'https://devapi.qweather.com/v7/weather/now',
                'forecast': 'https://devapi.qweather.com/v7/weather/3d',
                'air_quality': 'https://devapi.qweather.com/v7/air/now'
            },
            'openweathermap': {
                'current': 'https://api.openweathermap.org/data/2.5/weather',
                'forecast': 'https://api.openweathermap.org/data/2.5/forecast',
                'air_quality': 'https://api.openweathermap.org/data/2.5/air_pollution'
            },
            'seniverse': {
                'current': 'https://api.seniverse.com/v3/weather/now.json',
                'forecast': 'https://api.seniverse.com/v3/weather/daily.json',
                'air_quality': 'https://api.seniverse.com/v3/air/quality.json'
            }
        }

    def get_current_weather(self) -> Optional[Dict]:
        """
        Get current weather information.

        Returns:
            Dictionary containing weather data or None if failed
        """
        try:
            if self.provider == 'qweather':
                return self._get_qweather_current()
            elif self.provider == 'openweathermap':
                return self._get_openweathermap_current()
            elif self.provider == 'seniverse':
                return self._get_seniverse_current()
            else:
                logger.error(f"Unsupported weather provider: {self.provider}")
                return None
        except Exception as e:
            logger.error(f"Error getting current weather: {e}")
            return None

    def get_forecast(self, days: int = 3) -> Optional[List[Dict]]:
        """
        Get weather forecast for specified days.

        Args:
            days: Number of days to forecast (1-7)

        Returns:
            List of forecast data dictionaries or None if failed
        """
        try:
            if self.provider == 'qweather':
                return self._get_qweather_forecast(days)
            elif self.provider == 'openweathermap':
                return self._get_openweathermap_forecast(days)
            elif self.provider == 'seniverse':
                return self._get_seniverse_forecast(days)
            else:
                logger.error(f"Unsupported weather provider: {self.provider}")
                return None
        except Exception as e:
            logger.error(f"Error getting weather forecast: {e}")
            return None

    def get_air_quality(self) -> Optional[Dict]:
        """
        Get current air quality information.

        Returns:
            Dictionary containing air quality data or None if failed
        """
        try:
            if self.provider == 'qweather':
                return self._get_qweather_air_quality()
            elif self.provider == 'openweathermap':
                return self._get_openweathermap_air_quality()
            elif self.provider == 'seniverse':
                return self._get_seniverse_air_quality()
            else:
                logger.error(f"Unsupported weather provider: {self.provider}")
                return None
        except Exception as e:
            logger.error(f"Error getting air quality: {e}")
            return None

    def _get_qweather_current(self) -> Optional[Dict]:
        """Get current weather from QWeather API."""
        if not self.api_key:
            logger.warning("QWeather API key not provided")
            return None

        params = {
            'location': self.city,
            'key': self.api_key
        }

        response = requests.get(
            self.endpoints['qweather']['current'],
            params=params,
            timeout=self.timeout
        )

        if response.status_code == 200:
            data = response.json()
            if data.get('code') == '200':
                weather = data['now']
                return {
                    'temperature': float(weather['temp']),
                    'feels_like': float(weather.get('feelsLike', weather['temp'])),
                    'condition': weather['text'],
                    'condition_code': weather['icon'],
                    'humidity': int(weather['humidity']),
                    'wind_speed': float(weather['windSpeed']),
                    'wind_direction': weather['windDir'],
                    'visibility': float(weather.get('vis', '0')),
                    'pressure': float(weather.get('pressure', '0')),
                    'dew_point': float(weather.get('dew', '0')),
                    'provider': 'QWeather',
                    'update_time': weather['obsTime']
                }

        logger.error(f"QWeather API error: {response.text}")
        return None

    def _get_qweather_forecast(self, days: int) -> Optional[List[Dict]]:
        """Get weather forecast from QWeather API."""
        if not self.api_key:
            return None

        params = {
            'location': self.city,
            'key': self.api_key
        }

        response = requests.get(
            self.endpoints['qweather']['forecast'],
            params=params,
            timeout=self.timeout
        )

        if response.status_code == 200:
            data = response.json()
            if data.get('code') == '200':
                forecasts = []
                for day in data['daily'][:days]:
                    forecasts.append({
                        'date': day['fxDate'],
                        'max_temp': float(day['tempMax']),
                        'min_temp': float(day['tempMin']),
                        'condition': day['textDay'],
                        'condition_code': day['iconDay'],
                        'humidity': int(day.get('humidity', '0')),
                        'wind_speed': float(day.get('windSpeedDay', '0')),
                        'wind_direction': day['windDirDay'],
                        'precipitation': float(day.get('precip', '0')),
                        'provider': 'QWeather'
                    })
                return forecasts

        logger.error(f"QWeather forecast API error: {response.text}")
        return None

    def _get_qweather_air_quality(self) -> Optional[Dict]:
        """Get air quality from QWeather API."""
        if not self.api_key:
            return None

        params = {
            'location': self.city,
            'key': self.api_key
        }

        response = requests.get(
            self.endpoints['qweather']['air_quality'],
            params=params,
            timeout=self.timeout
        )

        if response.status_code == 200:
            data = response.json()
            if data.get('code') == '200':
                aqi = data['now']
                return {
                    'aqi': int(aqi['aqi']),
                    'level': aqi['level'],
                    'category': aqi['category'],
                    'primary_pollutant': aqi['primary'],
                    'pm25': float(aqi.get('pm2p5', 0)),
                    'pm10': float(aqi.get('pm10', 0)),
                    'so2': float(aqi.get('so2', 0)),
                    'no2': float(aqi.get('no2', 0)),
                    'co': float(aqi.get('co', 0)),
                    'o3': float(aqi.get('o3', 0)),
                    'provider': 'QWeather'
                }

        return None

    def _get_openweathermap_current(self) -> Optional[Dict]:
        """Get current weather from OpenWeatherMap API."""
        if not self.api_key:
            return None

        params = {
            'q': self.city,
            'appid': self.api_key,
            'units': 'metric'
        }

        response = requests.get(
            self.endpoints['openweathermap']['current'],
            params=params,
            timeout=self.timeout
        )

        if response.status_code == 200:
            data = response.json()
            return {
                'temperature': data['main']['temp'],
                'feels_like': data['main']['feels_like'],
                'condition': data['weather'][0]['description'],
                'condition_code': str(data['weather'][0]['id']),
                'humidity': data['main']['humidity'],
                'wind_speed': data.get('wind', {}).get('speed', 0),
                'wind_direction': self._get_wind_direction(data.get('wind', {}).get('deg', 0)),
                'visibility': data.get('visibility', 0) / 1000,  # Convert to km
                'pressure': data['main']['pressure'],
                'dew_point': data['main'].get('dew_point', 0),
                'provider': 'OpenWeatherMap',
                'update_time': data['dt']
            }

        logger.error(f"OpenWeatherMap API error: {response.text}")
        return None

    def _get_openweathermap_forecast(self, days: int) -> Optional[List[Dict]]:
        """Get weather forecast from OpenWeatherMap API."""
        if not self.api_key:
            return None

        params = {
            'q': self.city,
            'appid': self.api_key,
            'units': 'metric'
        }

        response = requests.get(
            self.endpoints['openweathermap']['forecast'],
            params=params,
            timeout=self.timeout
        )

        if response.status_code == 200:
            data = response.json()
            # Group by date
            daily_data = {}
            for item in data['list']:
                date = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
                if date not in daily_data:
                    daily_data[date] = {
                        'date': date,
                        'max_temp': -float('inf'),
                        'min_temp': float('inf'),
                        'conditions': [],
                        'humidity': 0,
                        'wind_speed': 0,
                        'wind_direction': '',
                        'precipitation': 0
                    }

                day_data = daily_data[date]
                day_data['max_temp'] = max(day_data['max_temp'], item['main']['temp'])
                day_data['min_temp'] = min(day_data['min_temp'], item['main']['temp'])
                day_data['conditions'].append(item['weather'][0]['description'])
                day_data['humidity'] += item['main']['humidity']
                day_data['wind_speed'] += item.get('wind', {}).get('speed', 0)
                day_data['precipitation'] += item.get('rain', {}).get('3h', 0)

            # Average out the values and get most common condition
            forecasts = []
            for date, day_data in list(daily_data.items())[:days]:
                avg_count = len(day_data['conditions'])
                forecasts.append({
                    'date': date,
                    'max_temp': day_data['max_temp'],
                    'min_temp': day_data['min_temp'],
                    'condition': max(set(day_data['conditions']), key=day_data['conditions'].count),
                    'condition_code': 'unknown',
                    'humidity': day_data['humidity'] // avg_count,
                    'wind_speed': day_data['wind_speed'] / avg_count,
                    'wind_direction': day_data['wind_direction'],
                    'precipitation': day_data['precipitation'],
                    'provider': 'OpenWeatherMap'
                })

            return forecasts

        logger.error(f"OpenWeatherMap forecast API error: {response.text}")
        return None

    def _get_openweathermap_air_quality(self) -> Optional[Dict]:
        """Get air quality from OpenWeatherMap API."""
        if not self.api_key:
            return None

        params = {
            'q': self.city,
            'appid': self.api_key
        }

        response = requests.get(
            self.endpoints['openweathermap']['air_quality'],
            params=params,
            timeout=self.timeout
        )

        if response.status_code == 200:
            data = response.json()
            if 'list' in data and len(data['list']) > 0:
                aqi = data['list'][0]
                main = aqi['main']
                components = aqi['components']

                return {
                    'aqi': aqi['main']['aqi'],
                    'level': self._get_aqi_level(aqi['main']['aqi']),
                    'category': self._get_aqi_category(aqi['main']['aqi']),
                    'primary_pollutant': max(components.keys(), key=lambda k: components[k]),
                    'pm25': components.get('pm2_5', 0),
                    'pm10': components.get('pm10', 0),
                    'so2': components.get('so2', 0),
                    'no2': components.get('no2', 0),
                    'co': components.get('co', 0),
                    'o3': components.get('o3', 0),
                    'provider': 'OpenWeatherMap'
                }

        return None

    def _get_seniverse_current(self) -> Optional[Dict]:
        """Get current weather from Seniverse API."""
        if not self.api_key:
            return None

        params = {
            'location': self.city,
            'key': self.api_key,
            'language': 'zh-Hans',
            'unit': 'c'
        }

        response = requests.get(
            self.endpoints['seniverse']['current'],
            params=params,
            timeout=self.timeout
        )

        if response.status_code == 200:
            data = response.json()
            if 'results' in data and len(data['results']) > 0:
                weather = data['results'][0]['now']
                return {
                    'temperature': float(weather['temperature']),
                    'feels_like': float(weather.get('feels_like', weather['temperature'])),
                    'condition': weather['text'],
                    'condition_code': weather['code'],
                    'humidity': int(weather['humidity']),
                    'wind_speed': float(weather.get('wind_speed', 0)),
                    'wind_direction': weather.get('wind_direction', ''),
                    'visibility': float(weather.get('visibility', 0)),
                    'pressure': float(weather.get('pressure', 0)),
                    'dew_point': float(weather.get('dew_point', 0)),
                    'provider': 'Seniverse',
                    'update_time': datetime.now().isoformat()
                }

        logger.error(f"Seniverse API error: {response.text}")
        return None

    def _get_seniverse_forecast(self, days: int) -> Optional[List[Dict]]:
        """Get weather forecast from Seniverse API."""
        if not self.api_key:
            return None

        params = {
            'location': self.city,
            'key': self.api_key,
            'language': 'zh-Hans',
            'unit': 'c',
            'start': 0,
            'days': days
        }

        response = requests.get(
            self.endpoints['seniverse']['forecast'],
            params=params,
            timeout=self.timeout
        )

        if response.status_code == 200:
            data = response.json()
            if 'results' in data and len(data['results']) > 0:
                forecasts = []
                for day in data['results'][0]['daily']:
                    forecasts.append({
                        'date': day['date'],
                        'max_temp': float(day['high']),
                        'min_temp': float(day['low']),
                        'condition': day['text_day'],
                        'condition_code': day['code_day'],
                        'humidity': int(day.get('humidity', 0)),
                        'wind_speed': float(day.get('wind_speed', 0)),
                        'wind_direction': day.get('wind_direction', ''),
                        'precipitation': float(day.get('precipitation', 0)),
                        'provider': 'Seniverse'
                    })
                return forecasts

        logger.error(f"Seniverse forecast API error: {response.text}")
        return None

    def _get_seniverse_air_quality(self) -> Optional[Dict]:
        """Get air quality from Seniverse API."""
        if not self.api_key:
            return None

        params = {
            'location': self.city,
            'key': self.api_key,
            'language': 'zh-Hans'
        }

        response = requests.get(
            self.endpoints['seniverse']['air_quality'],
            params=params,
            timeout=self.timeout
        )

        if response.status_code == 200:
            data = response.json()
            if 'results' in data and len(data['results']) > 0:
                aqi = data['results'][0]['air_quality']
                return {
                    'aqi': int(aqi['aqi']),
                    'level': aqi.get('level', ''),
                    'category': aqi.get('description', ''),
                    'primary_pollutant': aqi.get('primary_pollutant', ''),
                    'pm25': float(aqi.get('pm25', 0)),
                    'pm10': float(aqi.get('pm10', 0)),
                    'so2': float(aqi.get('so2', 0)),
                    'no2': float(aqi.get('no2', 0)),
                    'co': float(aqi.get('co', 0)),
                    'o3': float(aqi.get('o3', 0)),
                    'provider': 'Seniverse'
                }

        return None

    def _get_wind_direction(self, degrees: float) -> str:
        """Convert wind direction degrees to compass direction."""
        directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
        index = round(degrees / 22.5) % 16
        return directions[index]

    def _get_aqi_level(self, aqi: int) -> str:
        """Convert AQI number to level description."""
        if aqi <= 50:
            return 'Good'
        elif aqi <= 100:
            return 'Moderate'
        elif aqi <= 150:
            return 'Unhealthy for Sensitive'
        elif aqi <= 200:
            return 'Unhealthy'
        elif aqi <= 300:
            return 'Very Unhealthy'
        else:
            return 'Hazardous'

    def _get_aqi_category(self, aqi: int) -> str:
        """Convert AQI number to category description."""
        if aqi <= 50:
            return '优'
        elif aqi <= 100:
            return '良'
        elif aqi <= 150:
            return '轻度污染'
        elif aqi <= 200:
            return '中度污染'
        elif aqi <= 300:
            return '重度污染'
        else:
            return '严重污染'

    def get_weather_summary(self) -> Optional[Dict]:
        """
        Get comprehensive weather summary including current, forecast, and air quality.

        Returns:
            Dictionary with complete weather information or None if failed
        """
        try:
            current = self.get_current_weather()
            forecast = self.get_forecast(3)
            air_quality = self.get_air_quality()

            if not current:
                return None

            summary = {
                'current': current,
                'forecast': forecast or [],
                'air_quality': air_quality,
                'recommendations': self._generate_recommendations(current, forecast, air_quality)
            }

            return summary

        except Exception as e:
            logger.error(f"Error getting weather summary: {e}")
            return None

    def _generate_recommendations(self, current: Dict, forecast: Optional[List[Dict]], air_quality: Optional[Dict]) -> List[str]:
        """
        Generate weather-based recommendations.

        Args:
            current: Current weather data
            forecast: Weather forecast data
            air_quality: Air quality data

        Returns:
            List of recommendation strings
        """
        recommendations = []

        # Temperature-based recommendations
        temp = current.get('temperature', 20)
        if temp < 10:
            recommendations.append("天气寒冷，建议穿戴厚重外套")
        elif temp < 20:
            recommendations.append("天气凉爽，建议穿毛衣或轻薄外套")
        elif temp < 30:
            recommendations.append("温度适宜，穿着舒适即可")
        else:
            recommendations.append("天气炎热，建议穿轻薄透气的衣物")

        # Rain recommendations
        if forecast:
            for day in forecast[:2]:  # Check next 2 days
                if day.get('precipitation', 0) > 0:
                    recommendations.append(f"未来可能有降雨，建议准备雨具")
                    break

        # Air quality recommendations
        if air_quality:
            aqi = air_quality.get('aqi', 50)
            if aqi > 100:
                recommendations.append("空气质量不佳，建议减少户外活动或佩戴口罩")

        # Wind recommendations
        wind_speed = current.get('wind_speed', 0)
        if wind_speed > 10:
            recommendations.append("风力较大，注意防风保暖")

        return recommendations