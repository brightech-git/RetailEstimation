// Phase 2 – Design System
// Border-radius scale (in px). `full` is an arbitrarily large value that
// renders as a pill/circle for any reasonably sized element.

export const radius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type Radius = typeof radius;
export type RadiusKey = keyof Radius;
