# backend/src/services/external/exercise_db_api.py
"""
Exercise DB API Service
Fetches exercise information and tutorials
"""

from typing import Any, Dict, List, Optional

import httpx


class ExerciseDBAPIService:
    """Exercise DB API Service"""

    DEFAULT_BASE_URL = "https://exercisedb.p.rapidapi.com"

    def __init__(self, api_key: str, base_url: Optional[str] = None):
        """
        Initialize Exercise DB API Service

        Args:
            api_key: RapidAPI key for Exercise DB
            base_url: Optional custom base URL
        """
        self.api_key = api_key
        self.base_url = base_url or self.DEFAULT_BASE_URL
        self._client: Optional[httpx.AsyncClient] = None

    def _create_client(self) -> httpx.AsyncClient:
        """Create HTTP client with proper headers"""
        return httpx.AsyncClient(
            base_url=self.base_url,
            headers={
                "X-RapidAPI-Key": self.api_key,
                "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
            timeout=30.0,
        )

    @property
    def client(self) -> httpx.AsyncClient:
        """Lazy-load client"""
        if self._client is None:
            self._client = self._create_client()
        return self._client

    async def search_exercises(
        self,
        query: str,
        body_part: Optional[str] = None,
        target: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Search for exercises

        Args:
            query: Search term
            body_part: Target body part (optional)
            target: Target muscle (optional)

        Returns:
            List of matching exercises
        """
        try:
            client = self.client
            response = await client.get(
                "/exercises",
                params={"query": query, "limit": 20},
            )
            response.raise_for_status()
            exercises = response.json()

            # Filter results
            results = []
            for exercise in exercises:
                if body_part and exercise.get("bodyPart") != body_part:
                    continue
                if target and exercise.get("target") != target:
                    continue
                results.append(exercise)

            return results[:10]
        except httpx.HTTPError as e:
            raise RuntimeError(f"Exercise DB API error: {e}")

    async def get_exercise_by_id(
        self, exercise_id: str
    ) -> Dict[str, Any]:
        """
        Get detailed exercise information

        Args:
            exercise_id: Exercise ID

        Returns:
            Exercise details with animated GIF URL
        """
        try:
            client = self.client
            response = await client.get(f"/exercises/{exercise_id}")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise RuntimeError(f"Exercise DB API error: {e}")

    async def get_exercises_by_body_part(
        self, body_part: str
    ) -> List[Dict[str, Any]]:
        """
        Get exercises by body part

        Args:
            body_part: Body part name (back, chest, legs, etc.)

        Returns:
            List of exercises for the body part
        """
        try:
            client = self.client
            response = await client.get(
                f"/exercises/bodyPart/{body_part}"
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise RuntimeError(f"Exercise DB API error: {e}")

    async def get_target_muscles(self) -> List[str]:
        """
        Get list of all target muscles

        Returns:
            List of target muscle names
        """
        try:
            client = self.client
            response = await client.get("/targetMuscles")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise RuntimeError(f"Exercise DB API error: {e}")

    async def get_body_parts(self) -> List[str]:
        """
        Get list of all body parts

        Returns:
            List of body part names
        """
        try:
            client = self.client
            response = await client.get("/bodyParts")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise RuntimeError(f"Exercise DB API error: {e}")
