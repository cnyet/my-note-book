# Design: Core Frontend Pages

## Architecture

### 1. Page Component Structure

- Each page module will reside in `frontend/src/app/` following Next.js App Router conventions.
- Specialized components will be placed in `src/components/features/[moduleName]`.

### 2. LobeChat Integration

- The Agents page will embed LobeChat via an `<iframe>`.
- Messaging between the host app and LobeChat will be explored for state synchronization (e.g., switching agents).

### 3. Content Rendering (Blog)

- Assets: Markdown files will be the primary source for blog content.
- Rendering: `ReactMarkdown` will be used with custom components to map HTML elements to Genesis design system components (e.g., code blocks with `react-syntax-highlighter` using a custom "Abyss" theme).

### 4. Visual Effects

- **Home**: ParticleBg (already implemented) + parallax effects on hero cards.
- **Labs**: Integration of a `GlitchText` component utilizing CSS animations to jitter or flicker text.

## Data Flow

- Initial implementation will use mock data matching the PRD schemas.
- WebSocket listeners will be wired to the `OnlinePulse` component once the backend is ready (Phse 3).
