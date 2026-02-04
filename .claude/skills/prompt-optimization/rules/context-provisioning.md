---
title: Context Provisioning in Prompts
impact: CRITICAL
impactDescription: Adequate context is essential for AI to provide accurate and relevant responses
tags: context, background, information, relevance
---

## Context Provisioning

Providing adequate context is crucial for the AI to understand the situation, constraints, and requirements. Without proper context, the AI may make incorrect assumptions or provide solutions that don't fit the specific scenario.

### context-project-info

Include relevant project background to help the AI understand the specific environment and constraints.

**Incomplete:**
```
Create a login form
```

**Complete:**
```
Create a login form for a React-based SaaS application called "TaskFlow" that uses Firebase Authentication. The form should match our existing Material UI design system, integrate with our custom analytics tracking, and support social login via Google. Our users are primarily professionals managing complex workflows, so security is paramount.
```

### context-current-state

Describe the current situation, constraints, or problems that need to be addressed.

**Incomplete:**
```
Improve the API
```

**Complete:**
```
We have an existing Express.js API serving ~500 concurrent users. The /users endpoint currently takes 800-1200ms to respond during peak hours due to fetching user details from three different microservices (auth, profile, preferences). The API uses JWT authentication and returns JSON responses. We need to reduce response time while maintaining data consistency.
```

### context-goals-outcomes

Specify desired outcomes and success criteria to guide the AI toward the right solution.

**Incomplete:**
```
Fix the slow loading
```

**Complete:**
```
Our product page takes 4 seconds to load on 3G connections, causing 60% of mobile users to abandon the page. The goal is to achieve First Contentful Paint in under 1.5 seconds and Time to Interactive under 3 seconds. Success means reducing bounce rate by at least 30% without compromising functionality.
```

### context-priorities-tradeoffs

Explain important priorities and trade-offs to guide decision-making.

**Incomplete:**
```
Optimize this code
```

**Complete:**
```
Optimize the payment processing code for our e-commerce platform. Security is the highest priority - never sacrifice security for performance. Performance is second priority - aim for 99.9% success rate and <200ms processing time. Code maintainability is also important, but secondary to security and performance.
```

### context-technical-constraints

Provide specific technical constraints and requirements.

**Incomplete:**
```
Update the UI
```

**Complete:**
```
Update the settings page UI to support the new accessibility requirements. Must comply with WCAG 2.1 AA standards. Compatible with Chrome 90+, Safari 14+, Firefox 88+. Must work with keyboard navigation and screen readers. The site uses Tailwind CSS v3 with our custom design tokens. Avoid adding new dependencies over 10KB.
```

### context-business-context

Include relevant business context to help AI make appropriate decisions.

**Incomplete:**
```
Create a notification system
```

**Complete:**
```
Create a notification system for a healthcare patient portal. HIPAA compliance is mandatory - no patient health information in notifications. Notifications can include appointment reminders, lab results ready, and medication refill alerts. Patients must opt-in separately for each notification type. The system should integrate with our existing patient management system API.
```

### context-reference-materials

Point to existing resources, files, or documentation that provide additional context.

**Incomplete:**
```
Update the authentication
```

**Complete:**
```
Update the authentication flow in accordance with our security audit recommendations in `/docs/security/audit-q3-2024.md`. Refer to the user stories in `/docs/user-journeys.md#auth-flow` for expected behavior. The new flow should maintain compatibility with our existing API endpoints defined in `/docs/api/auth.yaml`.
```

### General Context Guidelines

- Start with the most critical context that impacts the solution
- Include constraints and requirements early in the prompt
- Provide enough detail for the AI to understand the implications of its recommendations
- Mention specific frameworks, tools, or technologies already in use
- Clarify any domain-specific requirements or regulations
- Include relevant performance, security, or compliance requirements
- Point to existing documentation when appropriate
- Be specific about the environment where the solution will be implemented