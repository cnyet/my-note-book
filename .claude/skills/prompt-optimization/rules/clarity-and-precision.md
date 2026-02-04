---
title: Clarity and Precision in Prompts
impact: CRITICAL
impactDescription: Prompts with clear, precise language dramatically improve AI comprehension and response quality
tags: clarity, precision, language, terminology
---

## Clarity and Precision

Effective prompts use precise terminology and eliminate ambiguity. This ensures the AI understands exactly what you want and produces higher quality results.

### clarity-specific-language

Use precise terminology instead of vague concepts. This reduces misinterpretation and improves response accuracy.

**Incorrect:**
```
Create a thing that handles user login
```

**Correct:**
```
Create a React component that renders a login form with email and password fields, handles form validation, and calls the authenticateUser API when submitted
```

### clarity-define-terms

Define technical terms, acronyms, or domain-specific concepts to ensure the AI interprets them correctly.

**Incorrect:**
```
Add the new auth pattern to the dashboard
```

**Correct:**
```
Add the OAuth 2.0 with PKCE (Proof Key for Code Exchange) authentication pattern to the dashboard. This refers to the authorization flow that securely exchanges an authorization code for an access token without exposing the client secret.
```

### clarity-clear-objectives

State specific goals and expectations. Clearly define what success looks like for the task.

**Incorrect:**
```
Improve the API
```

**Correct:**
```
Refactor the user API endpoint to reduce response time from the current average of 800ms to under 200ms by implementing caching for user records that don't change frequently
```

### clarity-avoid-ambiguity

Eliminate vague pronouns, references, and relative terms that could be misinterpreted.

**Incorrect:**
```
It should work like that thing in the other file
```

**Correct:**
```
The new function should follow the same error handling pattern as the `processUserData` function in `src/utils/userProcessor.js`, specifically the try/catch block structure and error logging to the `userProcessing` logger
```

### clarity-be-explicit-about-defaults

Don't assume default behaviors. Explicitly state what should happen in edge cases.

**Incorrect:**
```
Sort the items
```

**Correct:**
```
Sort the items by creation date in descending order (most recent first). If two items have the same creation date, sort by alphabetical order of the title property
```

### clarity-specify-format-expectations

Be explicit about the expected format and structure of the output.

**Incorrect:**
```
Give me the user data
```

**Correct:**
```
Return the user data as a JSON object with the following structure: { id: number, name: string, email: string, isActive: boolean, registrationDate: ISODateString }. Only include users who registered within the last 30 days.
```

### General Clarity Guidelines

- Use active voice instead of passive voice
- Be specific about quantities (numbers, sizes, limits)
- Avoid relative terms like "some", "many", "few" without quantification
- Specify exact file formats, data types, and technical requirements
- Clearly distinguish between required and optional elements
- Use concrete examples to illustrate abstract concepts