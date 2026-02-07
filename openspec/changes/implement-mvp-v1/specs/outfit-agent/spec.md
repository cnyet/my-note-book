# Specification: Outfit Agent

## 1. Overview

The Outfit Agent recommends daily outfits based on weather forecasts and user schedules, optionally generating visualizations.

## ADDED Requirements

### Requirement: Weather & Schedule Integration

The Outfit Agent SHALL fetch weather data for the user's location. The Outfit Agent SHALL consider the user's calendar events (e.g., "Meeting", "Gym") for context.

#### Scenario: Business Casual

Given a forecast of 20°C and a "Client Meeting" at 10:00 AM
When generating a recommendation
Then the agent suggests "Business Casual" attire (e.g., Blazer, Chinos).

### Requirement: Recommendation Generation

The Outfit Agent SHALL generate a textual description of the recommended outfit.

#### Scenario: Rainy Day

Given a forecast of "Heavy Rain"
When generating a recommendation
Then the agent suggests "Waterproof Jacket" and "Boots".

### Requirement: Visual Generation

The Outfit Agent SHALL generate a visual representation of the recommended outfit using an image generation model (if configured).

#### Scenario: Generate Image

Given a textual recommendation
When the image generation is enabled
Then an image file is created and stored locally in `backend/data/uploads`.

## 3. Data Model

- `outfit_recommendations`: id, user_id, date, suggestion_text, image_path, created_at.
