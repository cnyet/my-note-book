# Specification: Review Agent

## 1. Overview

The Review Agent provides a daily summary and review of the user's activities, extracting preferences to improve future interactions.

## ADDED Requirements

### Requirement: Daily Review

The Review Agent SHALL aggregate daily data from News, Task, and Life agents.

#### Scenario: Review Generation

Given today's tasks are completed
And news items are read
When the user requests a review
Then the agent fetches all daily activity data
And generates a comprehensive daily report via LLM.

### Requirement: Preference Extraction

The Review Agent SHALL extract user preferences from the daily review and update the User Profile.

#### Scenario: Preference Update

Given the daily review highlights a user's focus on "React Performance"
When the review is finalized
Then a new preference tag "Interest: React Performance" is added to the user profile
With a confidence score.

### Requirement: Manual Correction

The user SHALL be able to manually correct or delete extracted preferences.

#### Scenario: Correct Preference

Given an incorrect tag "Interest: PHP"
When the user deletes it via the UI
Then the tag is removed from the database for future reference.

## 3. Data Model

- `daily_reviews`: id, user_id, date, content (Markdown), created_at.
- `user_preferences`: id, user_id, key, value, confidence, source_agent.
