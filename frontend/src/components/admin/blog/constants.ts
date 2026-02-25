export const BLOG_EDITOR_CONSTANTS = {
  // Image upload constraints
  MAX_IMAGE_SIZE_MB: 2,
  MAX_IMAGE_SIZE_BYTES: 2 * 1024 * 1024,
  RECOMMENDED_COVER_WIDTH: 1200,
  RECOMMENDED_COVER_HEIGHT: 630,

  // Editor settings
  MIN_EDITOR_HEIGHT: 400,
  TEXTAREA_ROWS: 15,

  // File upload settings
  MAX_FILES: 1,

  // Timing
  UPLOAD_DELAY_MS: 1000,
  SAVE_DELAY_MS: 1000,

  // Content conversion
  MODE_SWITCH_DEBOUNCE_MS: 300,
} as const;
