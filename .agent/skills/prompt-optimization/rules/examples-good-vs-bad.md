---
title: Good vs Bad Prompt Examples
impact: MEDIUM
impactDescription: Learning from examples helps understand the practical application of prompt optimization principles
tags: examples, patterns, anti-patterns, comparisons
---

## Examples: Good vs Bad Prompts

Understanding the difference between effective and ineffective prompts is crucial for developing better prompting skills. This section provides real-world examples of common scenarios with both poor and improved versions.

### example-good-vs-bad

#### Example 1: Code Generation Request

**Bad Prompt:**
```
Write code to do the thing with the users.
```

**Why it's bad:**
- Vague: No specific task defined
- No context: Missing technology stack, constraints, requirements
- No structure: Undirected request

**Good Prompt:**
```
## Task
Create a TypeScript function that fetches user data from our API and caches it for 5 minutes.

## Context
- Tech stack: React 18, TypeScript, TanStack Query for caching
- API endpoint: `GET /api/users` returns array of User objects
- User object shape: `{id: number, name: string, email: string, isActive: boolean}`

## Requirements
- Use tanstack/react-query for caching
- Handle loading and error states
- Function should return {data, isLoading, error, refetch}
- Cache key: "users", TTL: 5 minutes
- Invalidate cache when user data is modified

## Code Standards
- Follow our linting rules (ESLint + Prettier)
- Include JSDoc comments
- Type safety for all parameters and return values
```

#### Example 2: Debugging Request

**Bad Prompt:**
```
My code doesn't work, fix it.
```

**Why it's bad:**
- No specific problem description
- No code provided
- No expected vs. actual behavior
- No context about the environment

**Good Prompt:**
```
## Problem
The user authentication function is returning undefined instead of a user object, causing the app to treat authenticated users as guests.

## Code
```javascript
async function authenticateUser(credentials) {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (response.ok) {
      const userData = await response.json();
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
```

## Expected Behavior
Function should return a user object with id, name, and email properties when authentication succeeds.

## Actual Behavior
Function returns undefined, even when credentials are correct and the API responds with valid user data.

## Environment
- Node.js v18.17.0
- React 18 frontend
- Using React Query for state management

## Investigation Notes
- API response has been verified as correct using Postman
- Network tab shows successful request with 200 status
- No errors in console
- Problem occurs in Chrome 118+ and Firefox 117+
```

#### Example 3: Architecture Decision Request

**Bad Prompt:**
```
What's the best way to do state management?
```

**Why it's bad:**
- Too broad for a meaningful answer
- No context about the application
- No constraints or requirements considered

**Good Prompt:**
```
## Context
We're building a medium-sized e-commerce application using React 18 with the following characteristics:
- 10-15 concurrent users during peak hours
- Complex product filtering and search functionality
- Shopping cart with real-time updates
- User authentication and preferences
- Server-side rendering for SEO

## Current State
Currently using React Context and useState hooks, but experiencing performance issues with frequent re-renders in the product listing component when filters change.

## Requirements
- Solution must handle complex nested state efficiently
- Team has intermediate React experience but limited Redux experience
- Need server-state client-state synchronization
- Must support optimistic updates for cart operations
- Prefer minimal bundle size impact

## Constraints
- Deadline: 2 months to implement
- Team size: 3 developers
- Cannot change to a different framework
- Must maintain compatibility with existing components

## Request
Compare Redux Toolkit, Zustand, and React Query for our use case, considering learning curve, performance, and maintainability. Recommend the best option with implementation strategy.
```

#### Example 4: Refactoring Request

**Bad Prompt:**
```
Make this better.
```

**Good Prompt:**
```
## Task
Refactor the user permission validation code to improve readability and maintainability.

## Current Code
```python
def validate_user_permissions(user_id, resource_type, action):
    user = get_user(user_id)
    if user.role == 'admin':
        return True
    elif user.role == 'moderator':
        if resource_type == 'post' and action in ['read', 'update']:
            return True
        elif resource_type == 'comment' and action == 'read':
            return True
        else:
            return False
    elif user.role == 'user':
        if resource_type == 'post' and action == 'read':
            return True
        elif resource_type == 'own_post' and action in ['read', 'update', 'delete']:
            return True
        else:
            return False
    else:
        return False
```

## Issues to Address
- Deep nesting makes it hard to understand permission rules
- Violates the open/closed principle (hard to add new roles/resources)
- Repetitive permission checks
- No centralized place to define permissions

## Requirements
- Improve readability while maintaining exact same functionality
- Make it easier to add new roles, resources, or actions
- Follow the principle of least privilege
- Include unit tests for the new implementation
- Maintain the same function signature if possible

## Coding Standards
- Python 3.9+
- Follow PEP 8
- Add type hints
- Include comprehensive docstrings
```

#### Example 5: Performance Optimization Request

**Bad Prompt:**
```
Make it faster.
```

**Good Prompt:**
```
## Task
Optimize the product listing page to meet performance targets.

## Current Performance
- First Contentful Paint: 4.2s
- Largest Contentful Paint: 6.8s
- Time to Interactive: 12.1s
- Target devices: Mobile (Moto G4, 4x CPU slowdown)

## Context
Product listing page displaying 24 products per page with images, prices, ratings, and availability status.

## Tech Stack
- Next.js 13.4 with App Router
- React 18
- Tailwind CSS
- Product data from Strapi CMS
- Images served from Cloudinary with responsive optimization

## Requirements
- Achieve LCP under 2.5s on target devices
- Ensure page is usable (TTI) within 5s
- Maintain SEO functionality
- Preserve all current UI elements and interactions
- No changes to CMS structure

## Known Issues
- Large JavaScript bundle (4.2MB total, 1.8MB main)
- Product images not properly sized for display
- Blocking third-party scripts
- Unoptimized product data fetching

## Success Metrics
- Lighthouse performance score >80
- All Core Web Vitals in green
- No regressions in functionality
```

### example-template-patterns

#### Template: Bug Report
```
## Problem
[Brief description of the issue]

## Context
- Environment: [browser, OS, device, etc.]
- Version: [app, browser, or relevant versions]
- Frequency: [always, sometimes, only in specific conditions]

## Steps to Reproduce
1. [Action]
2. [Action]
3. [Observe the problem]

## Expected Behavior
[Description of what should happen]

## Actual Behavior
[Description of what actually happens]

## Supporting Information
[Console errors, screenshots, API responses, etc.]
```

#### Template: Feature Request
```
## Objective
[Clear statement of what you want to accomplish]

## Context
- Current state: [What exists now]
- Pain points: [Why current solution is inadequate]
- User need: [Who needs this and why]

## Requirements
### Must Have
- [Critical functionality]

### Should Have
- [Important but not critical]

### Could Have
- [Nice-to-have features]

## Constraints
- Technical: [Technical limitations]
- Business: [Business constraints]
- Timeline: [Time constraints]

## Acceptance Criteria
- [How to verify the feature works]
```

#### Template: Code Review
```
## Code to Review
[File/PR/commit reference]

## Context
- Purpose: [What this code accomplishes]
- Related to: [Issue/ticket reference]
- Architecture: [How it fits into the system]

## Focus Areas
- Security: [Specific security concerns to check]
- Performance: [Performance considerations]
- Maintainability: [Code structure concerns]
- [Other specific areas to review]

## Questions
- [Specific questions for the reviewer]
```

### example-error-patterns

Common mistakes to avoid in prompts:

1. **Insufficient Context**: Not providing enough background about the project, constraints, or environment
2. **Vague Objectives**: Using imprecise language like "better", "faster", "fixed"
3. **Missing Specifications**: Forgetting to specify required formats, data types, or interfaces
4. **Overcomplicating**: Adding too much information that obscures the main request
5. **Assumption-Based**: Assuming the AI knows internal details about your project
6. **Contradictory Requirements**: Including conflicting instructions
7. **No Success Criteria**: Not specifying how to verify the solution worked
8. **Ambiguous Pronouns**: Using "it", "this", "that" without clear antecedents