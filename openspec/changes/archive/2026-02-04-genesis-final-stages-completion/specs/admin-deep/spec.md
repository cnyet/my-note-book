# Admin Deepening Specification

## ADDED Requirements

### Requirement: Role-Based Access Control
The system MUST enforce granular permissions for administrative actions.

#### Scenario: Unauthorized Access Block
Given a non-admin user
When they attempt to access `POST /api/v1/posts`
Then the system SHALL return a 403 Forbidden response.

### Requirement: Platform Insights
The system MUST provide administrators with high-level statistics of platform usage.

#### Scenario: View Analytics
Given an authenticated admin
When they view the Dashboard
Then the system SHALL display active agent counts and user registration trends.
