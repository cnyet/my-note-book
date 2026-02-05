# Fix CSS Error in globals.css

## Issue
The Tailwind CSS class `bg-background` in `/Users/yet/ClaudeCode/work-agents/frontend/src/app/globals.css` at line 31 is causing a compilation error:
```
CssSyntaxError: Cannot apply unknown utility class `bg-background`
```

## Root Cause
In Tailwind CSS v4 with the `@import "tailwindcss"` syntax, sometimes the automatic mapping between CSS variables defined in `:root` and Tailwind utility classes doesn't work as expected during processing.

## Solution
Replace the problematic Tailwind utility classes with direct CSS variable references using Tailwind's arbitrary value syntax.

## Required Change
File: `/Users/yet/ClaudeCode/work-agents/frontend/src/app/globals.css`
Line: 31
Change from:
```css
@apply bg-background text-foreground;
```
Change to:
```css
@apply bg-[hsl(var(--background))] text-[hsl(var(--foreground))];
```

## Impact
- Same visual result is maintained
- Removes the compilation error
- Uses Tailwind's bracket notation to directly reference CSS variables

## Additional Investigation Needed
Audit the codebase for similar usages of custom Tailwind classes that reference CSS variables to prevent similar issues.