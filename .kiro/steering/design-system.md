---
inclusion: always
---

# AI Life Assistant Design System Rules

## Overview

This design system is built for the AI Life Assistant web application, featuring a modern, accessible interface with comprehensive theming support. The system uses Tailwind CSS with custom CSS variables for theming, Radix UI primitives, and follows shadcn/ui patterns.

## Color System

### Primary Colors
- **Primary Blue**: `hsl(221.2 83.2% 53.3%)` - Main brand color for buttons, links, focus states
- **Primary Foreground**: `hsl(210 40% 98%)` - Text on primary backgrounds

### Semantic Colors
- **Destructive**: `hsl(0 84.2% 60.2%)` - Error states, delete actions
- **Secondary**: `hsl(210 40% 96%)` - Secondary buttons, subtle backgrounds
- **Muted**: `hsl(210 40% 96%)` - Disabled states, placeholder text

### Neutral Grays
- **Background**: `hsl(0 0% 100%)` (light) / `hsl(222.2 84% 4.9%)` (dark)
- **Foreground**: `hsl(222.2 84% 4.9%)` (light) / `hsl(210 40% 98%)` (dark)
- **Border**: `hsl(214.3 31.8% 91.4%)` (light) / `hsl(217.2 32.6% 17.5%)` (dark)

### Usage Guidelines
- Use CSS variables for all colors: `hsl(var(--primary))`
- Always provide dark mode variants
- Maintain WCAG AA contrast ratios (4.5:1 minimum)

## Typography

### Font Hierarchy
- **Headings**: Use semantic HTML (`h1`, `h2`, `h3`) with Tailwind classes
- **Body Text**: Default `text-sm` (14px) for most UI text
- **Labels**: `text-sm font-medium` for form labels
- **Descriptions**: `text-sm text-gray-600 dark:text-gray-400`

### Font Weights
- **Regular**: `font-normal` (400) - Body text
- **Medium**: `font-medium` (500) - Labels, emphasis
- **Semibold**: `font-semibold` (600) - Card titles, headings
- **Bold**: `font-bold` (700) - Main headings

## Spacing System

### Standard Scale
- **0**: `0` - No spacing
- **1**: `0.25rem` (4px) - Minimal spacing
- **2**: `0.5rem` (8px) - Small spacing
- **3**: `1rem` (16px) - Medium spacing
- **4**: `1.5rem` (24px) - Large spacing
- **5**: `3rem` (48px) - Extra large spacing

### Component Spacing
- **Card Padding**: `p-6` (24px) for content areas
- **Form Spacing**: `space-y-4` (16px) between form elements
- **Button Padding**: `px-4 py-2` for default buttons
- **Icon Spacing**: `gap-2` (8px) between icons and text

## Border Radius

### Scale
- **Small**: `calc(var(--radius) - 4px)` - Small elements
- **Medium**: `calc(var(--radius) - 2px)` - Standard elements
- **Large**: `var(--radius)` (0.5rem/8px) - Cards, modals
- **Extra Large**: `rounded-xl` (12px) - Cards with emphasis

### Usage
- **Cards**: `rounded-xl` for main content cards
- **Buttons**: `rounded-md` for standard buttons
- **Inputs**: `rounded-md` for form inputs
- **Icons**: `rounded-full` for avatar/profile images

## Component Patterns

### Button Variants
```tsx
// Primary action button
<Button variant="default">主要操作</Button>

// Secondary action
<Button variant="secondary">次要操作</Button>

// Destructive action
<Button variant="destructive">删除</Button>

// Subtle action
<Button variant="ghost">取消</Button>

// Link-style button
<Button variant="link">了解更多</Button>
```

### Card Structure
```tsx
<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardDescription>描述文本</CardDescription>
  </CardHeader>
  <CardContent>
    {/* 主要内容 */}
  </CardContent>
  <CardFooter>
    {/* 操作按钮 */}
  </CardFooter>
</Card>
```

### Form Patterns
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700">
    标签文本
  </label>
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <input
      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="占位符文本"
    />
  </div>
</div>
```

## Layout Patterns

### Header Structure
- Height: `h-14` (56px)
- Background: `bg-white/80 dark:bg-gray-900/80 backdrop-blur-md`
- Border: `border-b border-white/20 dark:border-gray-700/20`
- Padding: `px-4 md:px-6`

### Sidebar Navigation
- Width: Responsive (mobile overlay, desktop fixed)
- Background: Semi-transparent with backdrop blur
- Navigation items: Consistent spacing and hover states

### Content Areas
- Main content: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Cards: `rounded-xl` with consistent shadow
- Spacing: `space-y-6` between major sections

## Theming Guidelines

### Dark Mode Support
- All components must support both light and dark themes
- Use CSS variables for colors: `text-gray-900 dark:text-gray-100`
- Background transparency: `bg-white/80 dark:bg-gray-900/80`
- Smooth transitions: `transition-colors duration-200`

### Theme Toggle
- Use `ThemeToggle` component for consistent theme switching
- Support system preference detection
- Maintain theme state across page navigation

## Accessibility Standards

### Focus Management
- Visible focus indicators: `focus-visible:ring-2 focus-visible:ring-blue-500`
- Logical tab order for all interactive elements
- Skip links for keyboard navigation

### ARIA Labels
- Descriptive `aria-label` for icon-only buttons
- `aria-expanded` for collapsible elements
- Proper heading hierarchy (`h1` → `h2` → `h3`)

### Color Contrast
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text
- Test both light and dark themes

## Icon Usage

### Icon Library
- Primary: Lucide React icons
- Size: `h-4 w-4` for inline icons, `h-5 w-5` for standalone
- Color: `text-gray-400` for subtle, `text-current` for emphasis

### Icon Patterns
```tsx
// With text
<Button className="gap-2">
  <Mail className="h-4 w-4" />
  发送邮件
</Button>

// Icon-only button
<Button variant="ghost" size="icon" aria-label="关闭">
  <X className="h-4 w-4" />
</Button>
```

## Animation Guidelines

### Transitions
- Duration: `duration-200` for most interactions
- Easing: Default CSS easing for smooth feel
- Properties: `transition-colors`, `transition-transform`

### Hover States
- Buttons: Subtle background color change
- Cards: Slight shadow increase or border highlight
- Links: Underline or color change

### Loading States
- Spinner component for async operations
- Skeleton loading for content areas
- Disabled state styling during loading

## Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - Single column, overlay navigation
- **Tablet**: `768px - 1024px` - Adapted layouts, collapsible sidebar
- **Desktop**: `> 1024px` - Full layout with fixed sidebar

### Mobile-First Approach
- Start with mobile styles, enhance for larger screens
- Use `md:` and `lg:` prefixes for responsive variants
- Touch-friendly button sizes (minimum 44px)

## Chinese Language Support

### Typography
- Ensure proper font rendering for Chinese characters
- Adequate line height for mixed Chinese/English content
- Proper text wrapping and overflow handling

### Content Guidelines
- Use clear, concise Chinese labels and descriptions
- Maintain consistent terminology across the application
- Consider character width in layout calculations

## File Organization

### Component Structure
```
components/
├── ui/           # Base UI components (Button, Card, etc.)
├── layout/       # Layout components (Header, Sidebar)
├── auth/         # Authentication-specific components
├── secretaries/  # Secretary-specific components
└── common/       # Shared utility components
```

### Styling Approach
- Use Tailwind utility classes for styling
- Create component variants with `class-variance-authority`
- Maintain consistent naming conventions
- Group related styles logically

## Implementation Guidelines

### Component Creation
1. Start with semantic HTML structure
2. Apply Tailwind classes following the design system
3. Add proper TypeScript types
4. Include accessibility attributes
5. Test in both light and dark themes

### Code Quality
- Use `cn()` utility for conditional classes
- Prefer composition over inheritance
- Keep components focused and reusable
- Document complex component APIs

### Performance
- Minimize CSS bundle size with Tailwind purging
- Use CSS variables for dynamic theming
- Optimize for Core Web Vitals
- Lazy load non-critical components