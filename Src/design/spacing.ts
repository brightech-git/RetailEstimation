// Phase 2 – Design System
// Spacing scale (in px). Use these for padding, margin, and gaps instead of
// magic numbers. Kept small and predictable: each step is a sensible jump.

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof Spacing;
