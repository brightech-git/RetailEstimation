// Phase 2 – Design System
// Raw elevation values (Android's z-depth). Use these when you only need a
// stacking depth number. For a full cross-platform shadow, use `shadow.ts`
// (which pairs these numbers with matching iOS shadow props).

export const elevation = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
} as const;

export type Elevation = typeof elevation;
export type ElevationKey = keyof Elevation;
