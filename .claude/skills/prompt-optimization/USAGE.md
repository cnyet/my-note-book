# Usage Guide for Prompt Optimization Skill

This guide provides step-by-step instructions on how to use the Prompt Optimization Skill to create effective prompts for Claude Code.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Basic Prompt Assessment](#basic-prompt-assessment)
3. [Step-by-Step Optimization Process](#step-by-step-optimization-process)
4. [Prompt Templates](#prompt-templates)
5. [Troubleshooting Common Issues](#troubleshooting-common-issues)
6. [Best Practices Checklist](#best-practices-checklist)

## Getting Started

Before creating a prompt, familiarize yourself with the core concepts in the main SKILL.md file. The five key categories of prompt optimization are:
1. Clarity and Precision
2. Context Provisioning
3. Structure and Formatting
4. Tactical Tips
5. Examples and Patterns

## Basic Prompt Assessment

Before finalizing any prompt, ask yourself these key questions:

1. Is the goal clearly defined and specific?
2. Does the AI have enough context to complete the task?
3. Is the structure logical and easy to follow?
4. Are the expectations for output clearly stated?
5. Would another developer understand the task after reading this prompt?

## Step-by-Step Optimization Process

### Step 1: Define Your Objective
- Clearly state what you want the AI to do
- Use specific, actionable language
- Identify the desired deliverable

### Step 2: Provide Necessary Context
- Include project background if relevant
- Describe current state and constraints
- Share important priorities and trade-offs
- Reference existing files, architecture, or decisions

### Step 3: Structure Your Prompt
- Organize information in logical sequence
- Use markdown for readability
- Number steps when sequence matters
- Separate distinct concerns

### Step 4: Specify Output Requirements
- Define expected format (code, list, explanation, etc.)
- Mention any specific tools or approaches to use
- Indicate constraints or requirements
- State how to handle potential errors or edge cases

### Step 5: Add Tactical Enhancements
- Assign a specific role to the AI if beneficial
- Include iteration or feedback loops if needed
- Add quality checks or validation steps

## Prompt Templates

### Template 1: Code Creation Task
```
## Task
Create a [specific component/functionality] that [clear purpose].

## Context
- Current architecture: [relevant details]
- Existing files: [reference files that should be considered]
- Constraints: [limitations, requirements, or restrictions]
- Success criteria: [how to determine the task is complete]

## Requirements
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

## Deliverable
Provide the [format/type] with [specific elements]. Include [specific details like error handling, validation, etc.].

## Additional Notes
[Any other important considerations]
```

### Template 2: Code Review Task
```
## Task
Review [file/path] for [specific concerns - performance, security, best practices, etc.].

## Context
- Purpose of the code: [what this code is supposed to do]
- Architecture: [relevant system context]
- Performance requirements: [if applicable]
- Security requirements: [if applicable]

## Focus Areas
- [Area 1 - e.g., security vulnerabilities]
- [Area 2 - e.g., performance bottlenecks]
- [Area 3 - e.g., maintainability issues]

## Desired Output
Provide findings as:
1. Critical issues (require immediate attention)
2. Recommendations (would improve code quality)
3. Suggestions (nice to have improvements)

Format each finding as: Issue, Risk/Impact, Suggested Fix.
```

### Template 3: Problem-Solving Task
```
## Problem Statement
[Describe the specific problem in detail]

## Context
- Environment: [runtime, OS, framework, etc.]
- Current implementation: [what exists now]
- Error messages: [if applicable]
- Attempts made: [what has already been tried]

## Goal
The solution should [specific objectives and success criteria].

## Constraints
- [Limitation 1]
- [Limitation 2]

## Desired Output
Provide [format of response] including [specific elements needed].
```

## Troubleshooting Common Issues

### Issue: AI Response Is Too Generic
**Cause:** Insufficient specificity in the request
**Solution:** Add more detail about the desired approach, constraints, or expected outcome

### Issue: AI Doesn't Understand Context
**Cause:** Missing background information
**Solution:** Add project context, architecture details, or reference to existing code

### Issue: Response Is Off-Topic
**Cause:** Ambiguous or conflicting instructions
**Solution:** Clarify the specific task and check for contradictory requirements

### Issue: Output Format Is Wrong
**Cause:** Unclear expectations about deliverable
**Solution:** Explicitly state the format and structure of the expected response

## Advanced Techniques

For more sophisticated prompt optimization, consider the advanced techniques:

### When to Use Advanced Techniques
- When basic optimization isn't achieving desired results
- For production-level prompts requiring high reliability
- When working with multiple AI models
- For complex multi-step workflows
- When prompt consistency across various inputs is critical

### Advanced Optimization Process

#### Step 1: Assess Your Needs
Determine which advanced technique applies to your scenario:
- **Iterative Optimization**: For progressive refinement
- **Dual-Prompt Strategy**: For system/user prompt combinations
- **Testing Methodologies**: For validation and reliability
- **Directional Optimization**: For specific improvement goals
- **Production Readiness**: For deployment scenarios

#### Step 2: Apply Relevant Techniques
Refer to the `advanced-techniques.md` file for detailed implementation guidance.

#### Step 3: Validate Results
Use systematic testing approaches to verify improvements.

#### Step 4: Iterate Based on Feedback
Continue refining based on validation results.

## Best Practices Checklist

Before submitting any prompt, ensure you've addressed:

- [ ] Specific goal clearly defined
- [ ] Relevant context provided
- [ ] Structure organized logically
- [ ] Output format specified
- [ ] Constraints and requirements mentioned
- [ ] No ambiguous or vague language
- [ ] All necessary file references included
- [ ] Success criteria defined
- [ ] Role expectations (if any) communicated
- [ ] Quality requirements stated
- [ ] For advanced scenarios: Selected and applied appropriate advanced technique
- [ ] Validated with systematic testing approach (if required)

Remember: The quality of AI output is directly proportional to the quality of the input prompt. Investing time in crafting effective prompts will yield significantly better results.