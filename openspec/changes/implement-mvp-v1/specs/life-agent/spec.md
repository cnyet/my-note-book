# Specification: Life Agent

## 1. Overview

The Life Agent records and analyzes the user's health metrics, providing personalized advice while ensuring data privacy through encryption.

## ADDED Requirements

### Requirement: Health Data Recording

The Life Agent SHALL record user health metrics (weight, sleep, etc.) via a daily form.

#### Scenario: Record Metrics

Given a form with "Weight: 70kg", "Sleep: 7h"
When the user submits
Then the data is validated and stored.

### Requirement: Data Encryption

The Life Agent SHALL encrypt sensitive health data before storing it in the database.

#### Scenario: Encrypt on Save

Given a raw metric "Weight: 70kg"
When saving to the `life_metrics` table
Then the stored value is an encrypted string (Fernet/AES)
And cannot be read without the encryption key.

### Requirement: Health Advice

The Life Agent SHALL generate health advice based on recorded metrics.

#### Scenario: Generate Advice

Given a week of sleep data averaging 5 hours
When generating advice
Then the agent suggests "Increase sleep duration" and provides specific tips.

## 3. Data Model

- `life_metrics`: id, user_id, date, data (Encrypted Text), advice (Text), created_at.
