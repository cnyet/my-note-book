# Work Agents Platform v2.0 - Implementation Specification

## MISSION
Transform the existing Work Agents platform to version 2.0 with real-time capabilities, dynamic content management, authentication system, and comprehensive admin interface. The result must be a secure, responsive, and operationally-ready production system.

## ROLE
Senior Full-Stack Architect/Engineer specializing in React/Next.js, WebSocket communication, JWT authentication, and robust backend systems.

## TECH STACK
- Frontend: React/Next.js, TypeScript, Tailwind CSS, Shadcn/UI
- Backend: FastAPI (Python), WebSocket, JWT authentication
- Database: SQLite (primary), with caching layer
- Infrastructure: Docker containerization, CI/CD pipeline

## IMPLEMENTATION REQUIREMENTS

### 1. FRONTEND SYSTEM
**Global Features:**
- Header with LOGO (`frontend/design-assets/logo.png`), navigation (Home, Agents, Blog, Tools, Labs)
- Dynamic right-side auth UI: Guest shows [Sign In] [Sign Up]; Authenticated shows avatar dropdown (Dashboard, Profile, Log Out)
- Footer inspired by `https://checkmarx.dev/`
- Global loading states: progress bar and skeleton screens
- Fully responsive design (mobile, tablet, desktop)
- Dark/light theme toggle with localStorage persistence
- WCAG 2.1 AA accessibility compliance

**Real-time Capabilities:**
- WebSocket connection for bi-directional communication
- Online counter display for Labs section
- Graceful connection state handling (connecting, connected, disconnected, reconnecting)
- Automatic reconnection with exponential backoff

**Individual Pages (based on designs in `frontend/design-assets/pages/`):**
- Home: Complete redesign using `home-desktop.png` as reference, guided by `https://clawdbotai.co/zh`
- Agents: Tabbed interface cycling between LobeChat (default) and 5 internal agents, showing icon, name, description, and interaction point，complete redesign using `agents-desktop.png` as reference
- Tools: Categorized grid/list with search and category filtering, complete redesign using `tools-desktop.png` as reference
- Labs: Card-based layout with name, status badges (Experimental/Preview), descriptions, and experience links; include online counters, complete redesign using `labs-desktop.png` as reference
- Blog: Article listings with tag/date filters and global search; detail views with "Edit" link to admin system, complete redesign using `blog-desktop.png` as reference

### 2. BACKEND SYSTEM
**Authentication Layer:**
- JWT-based authentication with refresh tokens
- Protected `/admin/*` routes with role-based access control
- Rate limiting implementation (e.g., 100 requests per minute per IP)
- Session management and logout functionality

**Real-time Communication:**
- WebSocket server implementation
- Agent-to-agent messaging through Orchestration Protocol
- Connection pooling and client state management
- Fallback mechanisms when WebSocket unavailable

**Database Structure:**
- SQLite database at `backend/data/work_agents.db`
- Tables: users, agents, blogs, tools, labs with appropriate relationships
- Caching layer for frequently accessed data
- Seeded with predefined data (5 agents, 3 blogs, 3 tools, 3 labs)

**API Endpoints:**
- RESTful API for all frontend data needs (agents, tools, blogs, labs)
- Full CRUD operations for admin management
- File upload endpoints for images and media
- Pagination support for large datasets
- Structured error responses with HTTP status codes

**Agent Orchestration:**
- Implement Orchestration Protocol for inter-agent communication
- Context sharing between agents during collaboration
- Health monitoring and automated failover mechanisms

### 3. ADMIN PANEL
- Modern, high-tech dashboard UI (use `ui-ux-pro-max` design principles)
- Persistent sidebar navigation: Dashboard, Agents, Blogs, Tools, Labs, Profile, Settings
- Dashboard: Visual metrics and analytics using charts/graphs
- Agents: Full CRUD for agent configurations
- Blogs: Table view with title, summary, date, status and actions (Edit, Delete); rich text editor with Markdown preview
- Tools/Labs: Management interfaces for entries with sorting and categorization
- Profile: User information and password management
- Settings: Global system configuration options

### 4. INFRASTRUCTURE & DEPLOYMENT
- Docker containerization with separate frontend/backend/database services
- Automated CI/CD pipeline with testing integration
- Environment-specific configurations (dev/staging/prod)
- Database migration strategy for schema updates
- SSL/HTTPS enforcement with certificate management

### 5. QUALITY ASSURANCE
- Unit tests: 80% coverage minimum for business logic
- Integration tests: API endpoints and database interactions
- UI tests: Critical user flow validation
- Performance tests: LCP < 1.5s, API P95 response < 200ms
- Security scanning and vulnerability assessments

### 6. MONITORING & OBSERVABILITY
- Centralized logging with configurable levels across all services
- Error tracking with alerting for critical issues
- Performance monitoring for API response times and page loads
- Health check endpoints for infrastructure monitoring
- Privacy-compliant user analytics

### 7. SECURITY MEASURES
- Input validation and sanitization at all entry points
- Secure JWT handling with proper expiration and refresh
- Role-based access control for admin functions
- Rate limiting to prevent abuse/DDoS
- Security headers: CSP, HSTS, X-Frame-Options
- HTTPS enforcement for all communications
- Password hashing using bcrypt with salt

### 8. ERROR HANDLING
- React error boundaries for graceful component failure handling
- Structured API error responses with appropriate HTTP codes
- Graceful degradation strategies for service unavailability
- User-friendly error messages with separate technical logging

### 9. PERFORMANCE OPTIMIZATION
**Frontend:**
- Code splitting and lazy loading for faster initial loads
- Image optimization with WebP format support
- Browser caching strategies
- Bundle analysis and size optimization

**Backend:**
- Database query optimization with proper indexing
- Caching for frequently accessed data (Redis/memory cache)
- Pagination for large dataset handling
- Query response time optimization

## SUCCESS CRITERIA
- [ ] All frontend pages match design specifications
- [ ] Real-time features function correctly across browsers
- [ ] Authentication system works securely with role-based access
- [ ] All API endpoints return correct data and handle errors
- [ ] Admin panel allows full content management
- [ ] Performance benchmarks met (LCP < 1.5s, API < 200ms)
- [ ] Security audit passed with no critical vulnerabilities
- [ ] Accessibility compliance achieved (WCAG 2.1 AA)
- [ ] Test coverage > 80%
- [ ] Successful deployment to staging environment
- [ ] All risk mitigation strategies implemented

## CONSTRAINTS
- Primary database must remain SQLite at `backend/data/work_agents.db`
- API-driven architecture: no static content allowed for features
- All frontend content must load dynamically from backend
- Follow existing project structure and naming conventions
- Maintain backward compatibility where possible