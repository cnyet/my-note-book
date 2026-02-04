---
title: Structure and Formatting in Prompts
impact: HIGH
impactDescription: Well-structured prompts improve AI comprehension and lead to better organized responses
tags: structure, formatting, organization, readability
---

## Structure and Formatting

Proper structure and formatting of prompts make them easier for the AI to process and understand. Well-organized prompts lead to more organized and complete responses.

### structure-segmentation

Break complex requests into logical sections to help the AI understand the task hierarchy and requirements.

**Poorly Structured:**
```
Update the login form component to handle validation and error states and make it look good according to our design system and also it should work with our auth API and maybe add some loading states and also don't forget to include accessibility features.
```

**Well Structured:**
```
## Task
Update the login form component with validation and error handling.

## Design Requirements
- Follow our Material Design system (found in `/design/material-tokens.json`)
- Use our primary and error color tokens
- Include hover and focus states

## Functional Requirements
- Client-side validation for email and password fields
- Integration with our auth API (`/api/auth/login`)
- Loading state during authentication
- Error state display with specific error messages

## Accessibility Requirements
- ARIA attributes for screen readers
- Keyboard navigation support
- Proper label associations
```

### structure-order-of-info

Present information in a logical sequence that guides the AI through the problem-solving process.

**Disorganized:**
```
The response time is critical and should be under 200ms. We use React 18 with TypeScript and the component should show user data. Don't make any database changes. For the UI, use our custom components from `@/components/ui`. We need to fetch user data from the `/api/users/{id}` endpoint. Security is important, so implement proper error handling.
```

**Organized:**
```
## Technology Stack
- React 18 with TypeScript
- Custom UI components from `@/components/ui`

## Task
Create a user profile component that displays user data.

## Requirements
- Fetch data from `/api/users/{id}` endpoint
- Implement proper error handling
- Security compliance required
- Response time must be under 200ms
- No database changes

## Constraints
- Use only existing API endpoints
- Follow existing code patterns
```

### structure-formatting-visual

Use markdown formatting to improve readability and emphasize important information.

**Unformatted:**
```
create a dashboard that shows user statistics it should have a chart showing user growth over time and a table with user activity data and make sure it loads quickly and is responsive on mobile devices and secure
```

**Formatted:**
```
## Dashboard Requirements

Create a user dashboard with the following components:

### Components
1. **Growth Chart** - Line chart showing user growth over time
2. **Activity Table** - Tabular view of user activity data

### Performance Requirements
- Page load time: < 2 seconds
- Chart load time: < 500ms
- Mobile responsive design

### Security Requirements
- JWT token validation
- Role-based access control
```

### structure-sequential-steps

Number steps when sequence matters to ensure the AI follows the correct order of operations.

**Without Sequence:**
```
Create a migration that adds a new field, updates existing records, deploys to staging, tests the changes, verifies data integrity, and promotes to production.
```

**With Sequence:**
```
Perform the following steps in order:

1. Create a database migration that adds the `last_active_date` field to the users table
2. Update existing user records with an appropriate default value based on their last login
3. Deploy the changes to the staging environment
4. Test the changes on staging to ensure they work correctly
5. Verify data integrity after the update
6. Promote the changes to production following the standard deployment process
```

### structure-use-headings-effectively

Use headings to separate different types of information in complex prompts.

```
## Objective
Migrate user data from the legacy system to the new platform.

## Data Mapping
- Legacy `user.name` → New `profile.fullName`
- Legacy `user.email_address` → New `contact.primaryEmail`

## Validation Requirements
- All email addresses must be verified
- Duplicate emails must be flagged, not automatically merged

## Error Handling
- Log all migration failures with specific error types
- Continue migration if possible when individual records fail
- Generate summary report of success/failure rates

## Timeline
- Migration must complete within 4-hour maintenance window
- Staging environment migration first
- Production migration after approval
```

### structure-separate-concerns

Keep different concerns in separate sections to avoid confusion.

```
## Component Requirements
Create a React component that displays user profiles.

## Styling Requirements
- Use Tailwind CSS
- Follow our design system tokens
- Responsive design for mobile and desktop

## Data Requirements
- Fetch from `/api/users/:id`
- Cache data for 5 minutes
- Handle loading and error states

## Testing Requirements
- Unit tests for all functions
- Integration tests for API calls
- Accessibility testing
```

### General Structure Guidelines

- Start with the main task or objective
- Follow with context and background information
- Detail requirements and constraints
- Specify technical specifications
- Include any special considerations or edge cases
- Use bullet points for lists of similar items
- Use numbered lists when order matters
- Include a summary or key takeaways if the prompt is lengthy
- Group related information under clear headings
- Use bold text to emphasize critical requirements