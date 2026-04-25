/**
 * MD3 Design Token constants for programmatic use.
 * These mirror the CSS custom properties defined in globals.css.
 */

// ── Light mode color tokens ──

export const colors = {
  primary: '#6c002a',
  'on-primary': '#ffffff',
  'primary-container': '#8c1d40',
  'on-primary-container': '#ff9eb1',
  'primary-fixed': '#ffd9de',
  'primary-fixed-dim': '#ffb2bf',
  'on-primary-fixed': '#3f0016',
  'on-primary-fixed-variant': '#88193d',

  secondary: '#775a00',
  'on-secondary': '#ffffff',
  'secondary-container': '#fdc424',
  'on-secondary-container': '#6d5200',
  'secondary-fixed': '#ffdf9a',
  'secondary-fixed-dim': '#f6be1d',
  'on-secondary-fixed': '#251a00',
  'on-secondary-fixed-variant': '#5a4300',

  tertiary: '#333333',
  'on-tertiary': '#ffffff',
  'tertiary-container': '#4a4a4a',
  'on-tertiary-container': '#bababa',
  'tertiary-fixed': '#e2e2e2',
  'tertiary-fixed-dim': '#c6c6c6',
  'on-tertiary-fixed': '#1b1b1b',
  'on-tertiary-fixed-variant': '#474747',

  error: '#ba1a1a',
  'on-error': '#ffffff',
  'error-container': '#ffdad6',
  'on-error-container': '#93000a',

  surface: '#fbf9f9',
  'on-surface': '#1b1c1c',
  'surface-variant': '#e3e2e2',
  'on-surface-variant': '#564145',
  'surface-dim': '#dbdad9',
  'surface-bright': '#fbf9f9',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#f5f3f3',
  'surface-container': '#efeded',
  'surface-container-high': '#e9e8e7',
  'surface-container-highest': '#e3e2e2',
  'surface-tint': '#a73354',

  outline: '#897174',
  'outline-variant': '#ddbfc3',

  background: '#fbf9f9',
  'on-background': '#1b1c1c',

  'inverse-surface': '#303031',
  'inverse-on-surface': '#f2f0f0',
  'inverse-primary': '#ffb2bf',
} as const;

export const darkColors = {
  primary: '#ffb2bf',
  'on-primary': '#5e1130',
  'primary-container': '#8c1d40',
  'on-primary-container': '#ff9eb1',
  'primary-fixed': '#ffd9de',
  'primary-fixed-dim': '#ffb2bf',
  'on-primary-fixed': '#3f0016',
  'on-primary-fixed-variant': '#88193d',

  secondary: '#f6be1d',
  'on-secondary': '#3e2e00',
  'secondary-container': '#fdc424',
  'on-secondary-container': '#6d5200',
  'secondary-fixed': '#ffdf9a',
  'secondary-fixed-dim': '#f6be1d',
  'on-secondary-fixed': '#251a00',
  'on-secondary-fixed-variant': '#5a4300',

  tertiary: '#c6c6c6',
  'on-tertiary': '#2e2e2e',
  'tertiary-container': '#4a4a4a',
  'on-tertiary-container': '#bababa',
  'tertiary-fixed': '#e2e2e2',
  'tertiary-fixed-dim': '#c6c6c6',
  'on-tertiary-fixed': '#1b1b1b',
  'on-tertiary-fixed-variant': '#474747',

  error: '#ffb4ab',
  'on-error': '#690005',
  'error-container': '#93000a',
  'on-error-container': '#ffdad6',

  surface: '#131314',
  'on-surface': '#e3e2e2',
  'surface-variant': '#444748',
  'on-surface-variant': '#c4c7c8',
  'surface-dim': '#131314',
  'surface-bright': '#39393a',
  'surface-container-lowest': '#0e0e0f',
  'surface-container-low': '#1b1c1c',
  'surface-container': '#1f2020',
  'surface-container-high': '#2a2a2b',
  'surface-container-highest': '#353536',
  'surface-tint': '#ffb2bf',

  outline: '#8e9192',
  'outline-variant': '#444748',

  background: '#131314',
  'on-background': '#e3e2e2',

  'inverse-surface': '#e3e2e2',
  'inverse-on-surface': '#303031',
  'inverse-primary': '#a73354',
} as const;

// ── Spacing tokens ──

export const spacing = {
  base: '4px',
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '40px',
  xl: '64px',
  gutter: '24px',
  margin: '32px',
} as const;

// ── Border radius tokens ──

export const borderRadius = {
  DEFAULT: '0.125rem',
  lg: '0.25rem',
  xl: '0.5rem',
  full: '0.75rem',
} as const;

// ── Typography tokens ──

export const typography = {
  'label-sm': {
    fontSize: '12px',
    lineHeight: 1.4,
    fontWeight: 500,
  },
  'label-bold': {
    fontSize: '14px',
    lineHeight: 1.4,
    letterSpacing: '0.02em',
    fontWeight: 600,
  },
  'body-md': {
    fontSize: '16px',
    lineHeight: 1.6,
    fontWeight: 400,
  },
  'body-lg': {
    fontSize: '18px',
    lineHeight: 1.6,
    fontWeight: 400,
  },
  'headline-md': {
    fontSize: '24px',
    lineHeight: 1.3,
    fontWeight: 700,
  },
  'headline-lg': {
    fontSize: '32px',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    fontWeight: 700,
  },
  'headline-xl': {
    fontSize: '48px',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    fontWeight: 800,
  },
} as const;

// ── Shadow tokens ──

export const shadows = {
  'card-hover': '0 8px 24px rgba(0, 0, 0, 0.06)',
} as const;

// ── Convenience type for color token keys ──

export type ColorToken = keyof typeof colors;
export type DarkColorToken = keyof typeof darkColors;
export type SpacingToken = keyof typeof spacing;
export type TypographyToken = keyof typeof typography;
