# Design: Genesis Full Implementation

## Architecture Overview
The platform follows a Service-Schema-Model (SSM) separation on the backend and a Feature-driven organization on the frontend.

### 1. Data Layer (Core Models)
The backend will use SQLAlchemy 2.0 with an async engine. The following entities will be established:
- **User**: Identity and credentials (hashed).
- **Agent**: Metadata and orchestration endpoints.
- **Category/Tag**: Organization for tools and blog articles.
- **Article**: Blog content with Markdown support.
- **Memory**: Persistent storage for agent states.

### 2. Identity & Authentication
- **Local Auth**: standard JWT flow with refresh tokens.
- **OAuth 2.0**: Integration with GitHub and Google using a unified callback handler.
- **Identity Propagation**: JWT will be passed in WebSocket connection headers and shared between agents via the Orchestration Protocol.

### 3. Genesis UI/UX System
- **Next.js 15.4 + Tailwind 4**: Leveraging modern styling capabilities.
- **Abyss Theme**: Deep dark backgrounds (`#0a0a0f`) with high-contrast neon accents.
- **Glassmorphism**: 24-40px backdrop blur components.
- **Animations**: Framer Motion for kinetic transitions, magnetic buttons, and glitch effects.

### 4. Advanced Orchestration
- **Agent Memory**: A specialized table for key-value pair persistence with TTL and agent-specific namespaces.
- **Message Bus**: An internal event stream allowing agents to subscribe to cross-agent signals.

## Database Schema Changes
New tables will be created via Alembic migrations. `Agent` and `Category` tables are critical for the existing `seed.py` to function.

## Security Considerations
- Password hashing using bcrypt.
- JWT signing with HS256/RS256.
- CORS policies strictly controlled.
- Input validation via Pydantic v2.
