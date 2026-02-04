# identity-auth Specification

## Purpose
TBD - created by archiving change genesis-full-implementation. Update Purpose after archive.
## Requirements
### Requirement: Unified JWT Authentication
The system MUST provide a unified JWT-based authentication mechanism for all users and agents.

#### Scenario: Local Registration and Login
Given a new user
When the user provides a valid email and password
Then the system SHALL create a new account
And the system SHALL return a JWT access token and a refresh token upon successful login.

### Requirement: OAuth 2.0 Integration
The system MUST support third-party authentication via GitHub and Google.

#### Scenario: GitHub Login
Given a user with a GitHub account
When the user clicks "Login with GitHub"
Then the system SHALL redirect to GitHub for authorization
And upon callback, the system SHALL link the GitHub identity to a user account and issue a JWT.

### Requirement: Identity Propagation
The system MUST propagate the user's identity across all integrated agents and services.

#### Scenario: WebSocket Identity
Given an authenticated user
When the user opens a WebSocket connection to an agent
Then the connection MUST include the JWT in the initial handshake
And the agent SHALL verify the identity before allowing communication.

