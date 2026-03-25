# backend/src/services/external/nutrition_api.py
"""
Nutrition API Service
Fetches nutritional information using Spoonacular API
"""

from typing import Any, Dict, List, Optional

import httpx


class NutritionAPIService:
    """Spoonacular Nutrition API Service"""

    DEFAULT_BASE_URL = "https://api.spoonacular.com"

    def __init__(self, api_key: str, base_url: Optional[str] = None):
        """
        Initialize Nutrition API Service

        Args:
            api_key: Spoonacular API key
            base_url: Optional custom base URL
        """
        self.api_key = api_key
        self.base_url = base_url or self.DEFAULT_BASE_URL
        self._client: Optional[httpx.AsyncClient] = None

    def _create_client(self) -> httpx.AsyncClient:
        """Create HTTP client"""
        return httpx.AsyncClient(
            base_url=self.base_url,
            params={"apiKey": self.api_key},
            timeout=30.0,
        )

    @property
    def client(self) -> httpx.AsyncClient:
        """Lazy-load client"""
        if self._client is None:
            self._client = self._create_client()
        return self._client

    async def analyze_recipe(
        self, ingredients: List[str]
    ) -> Dict[str, Any]:
        """
        Analyze nutritional content of ingredients

        Args:
            ingredients: List of ingredient descriptions

        Returns:
            Nutritional analysis
        """
        try:
            client = self.client
            response = await client.get(
                "/recipes/analyzeIngredients",
                params={"ingredientList": "\n".join(ingredients)},
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise RuntimeError(f"Nutrition API error: {e}")

    async def search_recipes(
        self,
        query: str,
        diet: Optional[str] = None,
        exclude: Optional[str] = None,
        max_calories: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Search for recipes matching criteria

        Args:
            query: Search query
            diet: Diet type (vegetarian, vegan, etc.)
            exclude: Ingredients to exclude
            max_calories: Maximum calories per serving

        Returns:
            List of matching recipes
        """
        params = {"query": query, "number": 10}

        if diet:
            params["diet"] = diet
        if exclude:
            params["excludeIngredients"] = exclude
        if max_calories:
            params["maxCalories"] = max_calories

        try:
            client = self.client
            response = await client.get(
                "/recipes/complexSearch", params=params
            )
            response.raise_for_status()
            result = response.json()
            return result.get("results", [])
        except httpx.HTTPError as e:
            raise RuntimeError(f"Nutrition API search error: {e}")

    async def get_recipe_nutrition(
        self, recipe_id: int
    ) -> Dict[str, Any]:
        """
        Get nutrition information for a recipe

        Args:
            recipe_id: Spoonacular recipe ID

        Returns:
            Nutrition information
        """
        try:
            client = self.client
            response = await client.get(
                f"/recipes/{recipe_id}/nutritionWidget.json"
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise RuntimeError(f"Nutrition API recipe error: {e}")
