// Feature flags for controlling UI visibility
export const FEATURE_FLAGS = {
  SHOW_CHARTS: process.env.NEXT_PUBLIC_SHOW_CHARTS === '1',
  SHOW_INTERNATIONAL: process.env.NEXT_PUBLIC_SHOW_INTERNATIONAL === '1',
  SHOW_RURAL: process.env.NEXT_PUBLIC_SHOW_RURAL === '1',
  SHOW_DEV_TOOLBAR: process.env.NODE_ENV !== 'production',
} as const;
