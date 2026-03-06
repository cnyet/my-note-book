/**
 * Duralux Design System Constants
 *
 * Color palette, shadows, spacing, and typography based on Duralux admin template
 * Reference: https://themewagon.github.io/Duralux-admin/analytics.html
 */

// ═══ COLOR PALETTE ════════════════════════════════════════════════════════════

export const DURALUX_COLORS = {
  // Primary
  PRIMARY: '#696cff',
  PRIMARY_DARK: '#5f61e6',
  PRIMARY_LIGHT: '#7d80ff',

  // Functional Colors
  SUCCESS: '#71dd37',
  SUCCESS_DARK: '#64c430',
  WARNING: '#ffab00',
  WARNING_DARK: '#e69a00',
  DANGER: '#ff3e1d',
  DANGER_DARK: '#e6381a',
  INFO: '#03c3ec',
  INFO_DARK: '#03adcf',

  // Text Colors (Light Mode)
  TEXT_PRIMARY: '#566a7f',
  TEXT_SECONDARY: '#697a8d',
  TEXT_MUTED: '#a1acb8',
  TEXT_SECTION: '#adadb4',

  // Background Colors (Light Mode)
  BG_PAGE: '#f5f5f9',
  BG_CARD: '#ffffff',
  BG_HOVER: '#f5f5f9',

  // Dark Mode Colors
  DARK: {
    BG_PAGE: '#232333',
    BG_CARD: '#2b2c40',
    BG_HOVER: '#323249',
    TEXT_PRIMARY: '#a3b1c2',
    TEXT_SECONDARY: '#8592a3',
    TEXT_MUTED: '#696c80',
    BORDER: '#444564',
  },

  // Borders (Light Mode)
  BORDER: '#eceef1',

  // Transparent Variants (for icon backgrounds)
  TRANSPARENT: {
    PRIMARY: 'rgba(105, 108, 255, 0.1)',
    SUCCESS: 'rgba(113, 221, 55, 0.1)',
    WARNING: 'rgba(255, 171, 0, 0.1)',
    DANGER: 'rgba(255, 62, 29, 0.1)',
    INFO: 'rgba(3, 195, 236, 0.1)',
  },
} as const;

// ═══ SHADOW SYSTEM ════════════════════════════════════════════════════════════

export const DURALUX_SHADOWS = {
  // Card Shadows
  CARD: '0 2px 6px 0 rgba(67, 89, 113, 0.12)',
  CARD_DARK: '0 2px 6px 0 rgba(0, 0, 0, 0.25)',

  // Hover Shadows
  HOVER: '0 4px 10px 0 rgba(67, 89, 113, 0.15)',
  HOVER_DARK: '0 4px 10px 0 rgba(0, 0, 0, 0.3)',

  // Dropdown Shadows
  DROPDOWN: '0 6px 12px 0 rgba(67, 89, 113, 0.15)',
  DROPDOWN_DARK: '0 6px 12px 0 rgba(0, 0, 0, 0.35)',

  // Active/Selected Shadows
  ACTIVE: '0 2px 6px rgba(105, 108, 255, 0.4)',

  // Stat Card Mini Chart Shadows
  CHART: '0 2px 4px 0 rgba(67, 89, 113, 0.1)',
} as const;

// ═══ BORDER RADIUS ════════════════════════════════════════════════════════════

export const DURALUX_RADIUS = {
  CARD: '0.5rem',      // 8px - Cards, panels
  BUTTON: '0.375rem',  // 6px - Buttons
  INPUT: '0.375rem',   // 6px - Form inputs
  BADGE: '0.375rem',   // 6px - Badges, tags
  AVATAR: '9999px',    // Circle - Avatars
  THUMBNAIL: '0.375rem', // 6px - Image thumbnails
} as const;

// ═══ SPACING SYSTEM ════════════════════════════════════════════════════════════

export const DURALUX_SPACING = {
  // Base spacing (4px grid)
  XS: '0.25rem',   // 4px
  SM: '0.5rem',    // 8px
  MD: '0.75rem',   // 12px
  LG: '1rem',      // 16px
  XL: '1.5rem',    // 24px
  XL2: '2rem',     // 32px
  XL3: '2.5rem',   // 40px
  XL4: '3rem',     // 48px

  // Component-specific
  CARD_PADDING: '1.5rem',      // 24px
  CARD_HEADER_PADDING: '1.5rem', // 24px
  TABLE_CELL_PADDING: '1rem',    // 16px
} as const;

// ═══ TYPOGRAPHY ═══════════════════════════════════════════════════════════════

export const DURALUX_TYPOGRAPHY = {
  // Font Families
  FONT_FAMILY: '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

  // Font Sizes
  FONT_SIZE: {
    XS: '0.6875rem',   // 11px - Section headers
    SM: '0.8125rem',   // 13px - Small text
    BASE: '0.9375rem', // 15px - Body text
    LG: '1rem',        // 16px - Large body
    XL: '1.125rem',    // 18px - H4
    XL2: '1.25rem',    // 20px - H3
    XL3: '1.5rem',     // 24px - H2
    XL4: '2rem',       // 32px - H1
  },

  // Font Weights
  FONT_WEIGHT: {
    NORMAL: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700',
  },

  // Line Heights
  LINE_HEIGHT: {
    TIGHT: '1.2',
    NORMAL: '1.53',
    RELAXED: '1.625',
  },

  // Letter Spacing
  LETTER_SPACING: {
    NORMAL: 'normal',
    TIGHT: '-0.01em',
    WIDE: '0.8px',    // Section headers
  },
} as const;

// ═══ LAYOUT DIMENSIONS ════════════════════════════════════════════════════════

export const DURALUX_LAYOUT = {
  // Sidebar
  SIDEBAR_EXPANDED: '260px',
  SIDEBAR_COLLAPSED: '78px',

  // Header
  HEADER_HEIGHT: '64px',

  // Breadcrumb
  BREADCRUMB_HEIGHT: '40px',

  // Breakpoints (matching Tailwind)
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    XL2: '1400px',
  },
} as const;

// ═══ TRANSITIONS ══════════════════════════════════════════════════════════════

export const DURALUX_TRANSITIONS = {
  // Timing
  FAST: '150ms',
  NORMAL: '200ms',
  SLOW: '300ms',

  // Easing
  EASE_IN_OUT: 'ease-in-out',
  EASE: 'ease',

  // Common transitions
  COLOR: 'color 0.2s ease',
  BACKGROUND: 'background-color 0.2s ease',
  SHADOW: 'box-shadow 0.2s ease',
  TRANSFORM: 'transform 0.2s ease',
  ALL: 'all 0.2s ease-in-out',
} as const;

// ═══ HOVER EFFECTS ════════════════════════════════════════════════════════════

export const DURALUX_HOVER = {
  // Card hover effect
  CARD: {
    transform: 'translateY(-2px)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },

  // Button hover
  BUTTON: {
    opacity: 0.9,
    transition: 'all 0.2s ease',
  },

  // Menu item hover
  MENU_ITEM: {
    background: 'rgba(67, 89, 113, 0.04)',
    transition: 'all 0.2s ease',
  },
} as const;

// ═══ EXPORT COMBINED THEME ════════════════════════════════════════════════════

export const DURALUX_THEME = {
  colors: DURALUX_COLORS,
  shadows: DURALUX_SHADOWS,
  radius: DURALUX_RADIUS,
  spacing: DURALUX_SPACING,
  typography: DURALUX_TYPOGRAPHY,
  layout: DURALUX_LAYOUT,
  transitions: DURALUX_TRANSITIONS,
  hover: DURALUX_HOVER,
} as const;

export type DuraluxTheme = typeof DURALUX_THEME;
