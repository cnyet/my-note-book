---
title: Tactical Tips for Prompt Engineering
impact: MEDIUM
impactDescription: Tactical approaches can significantly enhance the quality and relevance of AI responses
tags: tactics, techniques, strategies, advanced
---

## Tactical Tips

Beyond the foundational principles of clarity, context, and structure, there are tactical approaches that can significantly enhance the quality and relevance of AI responses.

### tactical-role-definition

Assigning a specific role to the AI can improve the quality and perspective of responses.

**Without Role:**
```
How should I implement user authentication?
```

**With Role:**
```
As a senior security engineer, evaluate the following authentication implementation and identify vulnerabilities...
```

**Another Example:**
```
As a frontend performance expert, review this React component and suggest optimizations to reduce bundle size and improve rendering speed...
```

### tactical-expectation-setting

Explicitly stating the format and structure of the expected response helps ensure you get what you need.

**Without Expectations:**
```
Create a component to display users.
```

**With Expectations:**
```
Create a React component that displays users in a table. Return your response with the following structure:
1. Component code
2. Brief explanation of key implementation choices
3. Props interface/type definition
4. Usage example
5. Potential improvements or considerations
```

### tactical-step-by-step-reasoning

Requesting step-by-step reasoning can lead to more thorough and thoughtful responses.

**Simple Request:**
```
Is this code secure?
```

**With Reasoning:**
```
Analyze this code for security vulnerabilities. Please explain your reasoning step by step, identifying each potential vulnerability and explaining why it's a concern.
```

### tactical-constraints-clarification

Clearly defining constraints upfront helps the AI work within appropriate boundaries.

**Without Constraints:**
```
Create a database schema for users.
```

**With Constraints:**
```
Create a PostgreSQL database schema for users with the following constraints:
- Must support 1 million+ users
- Must include audit trail for all changes
- Cannot exceed 10GB storage
- Must support GDPR compliance
- Indexes for common queries (by email, registration date)
```

### tactical-analogy-approach

Using analogies can help the AI understand complex requirements by relating them to known concepts.

```
Design an API rate limiting system analogous to a traffic control system at a busy intersection, where different vehicle types (API consumers) have different priority levels and different routes (API endpoints) have different capacity limits.
```

### tactical-perspective-taking

Requesting specific perspectives can generate more targeted insights.

```
From a user experience perspective, identify potential issues with this checkout flow...
```

```
From a scalability perspective, evaluate this database design...
```

```
From a maintenance perspective, assess this code architecture...
```

### tactical-choice-selection

Presenting options and asking for evaluation can lead to more nuanced responses.

```
We're deciding between Redux Toolkit and Zustand for state management in our React application. Compare these two options across the following dimensions: learning curve, bundle size, performance, community support, and integration complexity with our current TypeScript and React 18 stack. Then recommend which is more suitable for our team of 4 junior developers with a 3-month timeline.
```

### tactical-iteration-approach

Breaking complex tasks into iterative steps often yields better results.

```
Let's build a dashboard incrementally:

1. First, suggest what key metrics should be displayed on a user engagement dashboard for a SaaS application
2. After my confirmation, propose the layout and visualizations for these metrics
3. Once approved, provide the implementation for the first component
```

### tactical-feedback-incorporation

When refining previous AI responses, explicitly reference what you liked and want to keep.

```
I like the structure of the authentication flow you provided, especially the multi-factor authentication steps. However, I need you to replace the email-based verification with SMS verification using Twilio. Keep the same overall flow and security measures, but update the verification step.
```

### tactical-verification-request

Ask the AI to verify or validate its own response.

```
Before providing your solution, please check that it addresses all the requirements I've specified. List which requirements you've fulfilled and note any you couldn't satisfy.
```

### tactical-counterargument-seeking

Encourage more balanced responses by asking for potential downsides or alternative viewpoints.

```
After presenting your recommended approach, identify potential drawbacks or situations where alternative approaches might be better.
```

### tactical-temperature-control

Use specific language to control the conservativeness or creativity of responses:

- For conservative, tried-and-true solutions: "Recommend the most proven and well-established approach"
- For creative solutions: "Think creatively and suggest innovative approaches that challenge conventional wisdom"
- For balanced responses: "Provide a pragmatic solution that balances innovation with proven practices"

### General Tactical Guidelines

- **Chain prompts**: Build on previous responses to develop ideas iteratively
- **Use system messages**: When possible, frame the AI's role in system-level instructions
- **Ask for alternatives**: Request multiple approaches when exploring design decisions
- **Set scope boundaries**: Be clear about what is in and out of scope
- **Acknowledge complexity**: Recognize when issues have multiple valid solutions
- **Validate assumptions**: Ask the AI to state its assumptions when they might affect the response
- **Use examples**: Provide examples of desired output when the format might be unclear
- **Temporal framing**: Consider time sensitivity of recommendations (short-term vs. long-term solutions)