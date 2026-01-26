## ADDED Requirements

### Requirement: Smart Background Freshness
The system SHALL automatically check the freshness of news articles when the news page is accessed. If the latest article is older than 4 hours, a background refresh MUST be triggered.

#### Scenario: Background refresh triggered
- **WHEN** user opens the news page
- **AND** the latest article in DB was created > 4 hours ago
- **THEN** the system returns existing articles immediately
- **AND** triggers a background process to fetch new articles

#### Scenario: No refresh needed
- **WHEN** user opens the news page
- **AND** the latest article in DB was created < 4 hours ago
- **THEN** the system returns existing articles
- **AND** does NOT trigger a background process

### Requirement: Expanded Article Count
The system SHALL curate and display at least 20 articles in the daily briefing.

#### Scenario: Display 20 articles
- **WHEN** the news agent finishes execution
- **THEN** at least 20 structured articles should be available in the database
- **AND** the frontend should display up to 20 of the latest articles
