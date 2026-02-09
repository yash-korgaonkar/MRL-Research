/**
 * Dark-mode-first, calm palette. Red only when tremor active.
 */
export const colors = {
  background: '#0F1419',
  surface: '#1A2129',
  surfaceElevated: '#242D38',
  card: '#1E2730',
  cardBorder: '#2D3843',

  text: '#E6EDF3',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',

  primary: '#58A6FF',
  primaryMuted: '#388BFD',
  success: '#3FB950',
  warning: '#D29922',
  tremorActive: '#F85149', // Red only when tremor
  tremorInactive: '#3FB950',

  border: '#30363D',
  borderFocus: '#58A6FF',

  white: '#FFFFFF',
  black: '#000000',
} as const;
