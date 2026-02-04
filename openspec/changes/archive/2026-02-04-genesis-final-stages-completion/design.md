# Design: Genesis Final Stages

## Architecture Deepening

### 1. Real-time Ecosystem (Phase 6)
- **WebSocket Protocol**: A centralized WebSocket manager in FastAPI to track active sessions.
- **Live Counter**: Broadcasts user count increments/decrements to all connected clients in the `/labs` scope.

### 2. Admin & Security (Phase 7)
- **RBAC**: Implementation of Scopes in JWT. Middleware to check `user:admin` or `content:editor` permissions.
- **Dashboard**: Aggregation queries for user growth, agent activity, and storage usage.

### 3. Deployment (Phase 8)
- **Containerization**: Multi-stage Docker builds for optimized frontend/backend images.
- **Production Script**: `scripts/deploy.sh` to handle automated migration, seeding, and container restart.

### 4. Advanced Orchestration (Phase 9)
- **Memory TTL**: Background worker to prune expired agent memories.
- **Message Bus Tracing**: Correlation IDs injected into bus signals to track multi-agent task flows.
- **Observability**: Prometheus-compatible metrics endpoint and structured JSON logging.

## UI/UX Integration
- All new interfaces (Admin stats, Lab counters) must use the **Kinetic** and **Electric** tokens from the Genesis spec.
