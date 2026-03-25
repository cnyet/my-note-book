# backend/src/services/external/__init__.py
"""External API Services Module"""

from .exercise_db_api import ExerciseDBAPIService
from .nutrition_api import NutritionAPIService

__all__ = ["NutritionAPIService", "ExerciseDBAPIService"]
