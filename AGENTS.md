# AGENTS.MD - Coding Guidelines for Agentic Development

This document contains essential information for AI coding agents working in this repository. It covers build systems, testing frameworks, code style, and best practices.

## BUILD SYSTEM & COMMANDS

### Core Commands
```bash
# Install dependencies
npm install

# Development build
npm run build

# Production build
npm run build:prod

# Watch mode for development
npm run build:watch

# Clean build artifacts
npm run clean
```

### Testing Commands
```bash
# Run all tests
npm test
npm run test

# Run specific test file
npm test -- testNamePattern="MyComponent"

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a single test file
npm test -- tests/unit/myComponent.test.ts

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

### Linting & Formatting Commands
```bash
# Run linter
npm run lint

# Fix lint issues
npm run lint:fix

# Run formatter
npm run format

# Check formatting
npm run format:check
```

### Development Server
```bash
# Start dev server
npm run dev
npm run start

# Start with hot reloading
npm run dev:hot
```

## CODE STYLE GUIDELINES

### Language Standards
- Target: ES2022+/TypeScript 5+
- Module system: ES Modules
- Strict mode enabled in tsconfig.json
- Nullish coalescing and optional chaining encouraged
- Top-level await permitted where appropriate

### Type Safety
- Strict TypeScript with `strict: true` in tsconfig.json
- Explicit typing over inference when clarity benefits maintenance
- Use `unknown` over `any` when type is truly unknown
- Avoid type assertions (`as`) except when absolutely necessary
- Prefer interfaces over types for object shapes

### Imports Organization
```typescript
// Group imports in this order:
// 1. External packages
// 2. Internal modules within project
// 3. Parent directory imports (../)
// 4. Sibling directory imports (./)
// 5. Type-only imports with import type { }

import fs from 'fs';
import path from 'path';

import { MyClass } from '@internal/package';
import { utilityFunction } from '../utils/helpers';
import { siblingHelper } from './localUtils';

import type { MyInterface } from './types';
```

### Naming Conventions
- Variables: camelCase
- Functions: camelCase
- Classes: PascalCase
- Interfaces: PascalCase (prefix with I only if improves clarity)
- Types: PascalCase
- Constants: UPPER_SNAKE_CASE
- File names: kebab-case.tsx
- Component files: PascalCase.tsx

### Error Handling
```typescript
// Preferred try/catch pattern
try {
  const result = await riskyOperation();
  return processResult(result);
} catch (error) {
  // Log with context-rich messages
  console.error('Failed to process risky operation:', { 
    error: error instanceof Error ? error.message : 'Unknown error',
    context: { userId, operationId }
  });
  
  // Re-throw or return safe defaults
  throw new CustomError('Processing failed', { cause: error });
}

// Early returns for validation
function processData(data: InputData | undefined): Result {
  if (!data) {
    throw new ValidationError('Data is required');
  }
  
  if (data.id <= 0) {
    throw new ValidationError('Valid ID required');
  }
  
  // Main logic here
  return performOperation(data);
}
```

### Functional Programming Patterns
- Pure functions preferred when feasible
- Immutability favored (use spread operator, Array methods)
- Higher-order functions over imperative loops
- Chain methods appropriately with clear intermediate steps

### Comments & Documentation
- JSDoc for public APIs, exported functions/classes
- Inline comments for complex logic or non-obvious decisions
- Explain "why" over "what" in comments
- TODO with specific issue references when applicable
- Remove outdated comments during refactorings

### React-Specific Guidelines
```jsx
// Functional components with TypeScript interfaces
interface ComponentProps {
  title: string;
  isActive?: boolean;
  onClick: () => void;
}

const MyComponent: React.FC<ComponentProps> = ({ 
  title, 
  isActive = false, 
  onClick 
}) => {
  // Destructure props with defaults at parameter level
  // Declare memoized values with useMemo/useCallback appropriately
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  // Early returns for conditional rendering
  if (!title) {
    return null;
  }

  return (
    <button 
      className={isActive ? 'active' : 'inactive'}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};
```

### Testing Principles
```typescript
// Unit tests should be isolated and focused
describe('calculateTotal', () => {
  it('should calculate total with tax', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 }
    ];
    const taxRate = 0.1;
    
    const result = calculateTotal(items, taxRate);
    
    expect(result).toBe(275); // (200 + 50) * 1.1
  });

  it('should handle empty items array', () => {
    const items: Item[] = [];
    const taxRate = 0.1;
    
    const result = calculateTotal(items, taxRate);
    
    expect(result).toBe(0);
  });
});

// Integration tests for component behavior
describe('UserForm', () => {
  it('should submit valid data', async () => {
    render(<UserForm />);
    
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
  });
});
```

## FILE STRUCTURE CONVENTIONS

```
src/
├── components/        # Shared UI components
│   ├── atoms/         # Basic building blocks
│   ├── molecules/     # Composed atoms
│   └── organisms/     # Complex components
├── features/          # Feature-based modules
├── hooks/             # Custom React hooks
├── lib/               # Business logic utilities
├── services/          # API clients
├── store/             # State management
├── types/             # Shared TypeScript types
├── utils/             # Generic helper functions
└── views/             # Page components
```

## GIT WORKFLOW

### Branch Strategy
- Main branch: `main`
- Feature branches: `feature/short-description`
- Hotfix branches: `hotfix/issue-description`
- Release branches: `release/version-number`

### Commit Convention
Follow Conventional Commits specification:
```
type(scope): description

[type] = feat | fix | chore | docs | style | refactor | perf | test | ci | build
[scope] = affected module (optional)
```

Examples:
- `feat(auth): add password reset functionality`
- `fix(api): resolve user data fetching issue`
- `chore(deps): update React to v18`

## PERFORMANCE CONSIDERATIONS

- Lazy load non-critical components
- Bundle splitting for code delivery
- Memoization for expensive computations
- Virtualized lists for large datasets
- Proper cleanup of event listeners and subscriptions
- Image optimization (next-gen formats, proper sizing)

## SECURITY BEST PRACTICES

- Validate and sanitize all user inputs
- Use environment variables for secrets
- Implement proper authentication/authorization
- Protect against XSS, CSRF, and injection attacks
- Regular dependency vulnerability scanning

## ACCESSIBILITY (A11Y)

- Semantic HTML elements
- Proper labeling of form controls
- Color contrast compliance (WCAG 2.1 AA)
- Keyboard navigation support
- ARIA attributes when native elements insufficient
- Screen reader compatibility testing

## ENVIRONMENT VARIABLES

```
# Development
.development.env

# Staging
.staging.env

# Production
.production.env
```

Prefix all environment variables with the project acronym for organization.

## DEBUGGING TIPS FOR AGENTS

1. **When builds fail:** Check terminal output for specific file/line errors
2. **When tests fail:** Examine the exact assertion that failed and related code paths
3. **When linting fails:** Address all errors first, then warnings
4. **When runtime errors occur:** Check browser console, implement error boundaries
5. **Performance issues:** Use profiling tools to identify bottlenecks

## COMMON CONFIGURATION FILES LOCATION

- ESLint: `.eslintrc.js` in root
- Prettier: `.prettierrc` in root
- TypeScript: `tsconfig.json` in root
- Jest: `jest.config.js` in root
- Webpack: `webpack.config.js` in root
- Babel: `babel.config.js` in root
- EditorConfig: `.editorconfig` in root