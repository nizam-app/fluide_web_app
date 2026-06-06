import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const fluideColors = {
  background: { value: '#F8FAFC' },
  surface: { value: '#FFFFFF' },
  sidebar: { value: '#F0F4F8' },
  primary: { value: '#2D6A4F' },
  onPrimary: { value: '#FFFFFF' },
  primaryContainer: { value: '#D8F3DC' },
  onPrimaryContainer: { value: '#1B4332' },
  accentMint: { value: '#95F9AC' },
  accentBlue: { value: '#5B6CFF' },
  secondary: { value: '#1B5E20' },
  onSecondary: { value: '#FFFFFF' },
  secondaryContainer: { value: '#E8F5E9' },
  onSecondaryContainer: { value: '#2D6A4F' },
  navy: { value: '#1E3A5F' },
  onNavy: { value: '#FFFFFF' },
  brandBlack: { value: '#000000' },
  onBackground: { value: '#1A202C' },
  onSurface: { value: '#1A202C' },
  onSurfaceVariant: { value: '#718096' },
  outline: { value: '#A0AEC0' },
  outlineVariant: { value: '#E2E8F0' },
  surfaceVariant: { value: '#EDF2F7' },
  surfaceContainerLow: { value: '#F7FAFC' },
  surfaceContainerLowest: { value: '#FFFFFF' },
  surfaceContainer: { value: '#EDF2F7' },
  surfaceContainerHigh: { value: '#E2E8F0' },
  surfaceContainerHighest: { value: '#CBD5E0' },
  infoBg: { value: '#EBF8FF' },
  infoFg: { value: '#2B6CB0' },
  error: { value: '#C53030' },
  errorContainer: { value: '#FED7D7' },
  onErrorContainer: { value: '#9B2C2C' },
  amberBg: { value: '#FEFCBF' },
  amberFg: { value: '#B7791F' },
  amberBorder: { value: '#F6E05E' },
  loginPanel: { value: '#081A26' },
  tagBlue: { value: '#EBF8FF' },
  tagBlueFg: { value: '#2B6CB0' },
  viewDetailsBg: { value: '#F0FFF4' },
}

const config = defineConfig({
  theme: {
    tokens: {
      colors: fluideColors,
      fonts: {
        heading: { value: "'Inter', system-ui, sans-serif" },
        body: { value: "'Inter', system-ui, sans-serif" },
      },
      radii: {
        fluide: { value: '0.75rem' },
        fluide3xl: { value: '1.5rem' },
        pill: { value: '9999px' },
      },
      shadows: {
        level1: { value: '0 1px 3px rgba(0,0,0,0.06)' },
        level2: { value: '0 4px 12px rgba(0,0,0,0.08)' },
      },
      sizes: {
        sidebar: { value: '17rem' },
        contentMax: { value: '80rem' },
      },
      spacing: {
        gutter: { value: '1.5rem' },
        marginMobile: { value: '1rem' },
        marginDesktop: { value: '2rem' },
      },
    },
    textStyles: {
      headlineXl: {
        value: { fontSize: { base: '36px', md: '48px' }, lineHeight: '1.15', fontWeight: '700', fontFamily: 'heading', letterSpacing: '-0.02em' },
      },
      headlineLg: {
        value: { fontSize: { base: '28px', md: '32px' }, lineHeight: '1.25', fontWeight: '700', fontFamily: 'heading' },
      },
      headlineMd: {
        value: { fontSize: '24px', lineHeight: '1.3', fontWeight: '600', fontFamily: 'heading' },
      },
      headlineSm: {
        value: { fontSize: '20px', lineHeight: '1.4', fontWeight: '600', fontFamily: 'heading' },
      },
      bodyLg: { value: { fontSize: '18px', lineHeight: '1.6', fontWeight: '400', fontFamily: 'body' } },
      bodyMd: { value: { fontSize: '16px', lineHeight: '1.6', fontWeight: '400', fontFamily: 'body' } },
      bodySm: { value: { fontSize: '14px', lineHeight: '1.5', fontWeight: '400', fontFamily: 'body' } },
      labelMd: { value: { fontSize: '14px', lineHeight: '1', fontWeight: '600', fontFamily: 'body' } },
      labelSm: {
        value: { fontSize: '12px', lineHeight: '1', fontWeight: '500', letterSpacing: '0.05em', fontFamily: 'body', textTransform: 'uppercase' },
      },
    },
  },
  globalCss: {
    'html, body, #root': { minH: '100vh' },
    body: { bg: 'background', color: 'onBackground', fontFamily: 'body', margin: 0 },
    '.material-symbols-outlined': {
      fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      userSelect: 'none',
    },
    '.material-symbols-outlined.filled': {
      fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
    },
  },
})

export const fluideSystem = createSystem(defaultConfig, config)

export const fluideInputStyles = {
  borderRadius: 'fluide',
  borderWidth: '1px',
  borderColor: 'outlineVariant',
  bg: 'surfaceContainerLow',
  color: 'onSurface',
  fontSize: '16px',
  px: '4',
  py: '3',
  outline: 'none',
  _placeholder: { color: 'outline' },
  _focus: { borderColor: 'primary', boxShadow: '0 0 0 3px color-mix(in srgb, var(--chakra-colors-primary) 15%, transparent)' },
}

/** Smaller fields for dates, budget, counts — buyer compact create-trip layout */
export const fluideCompactInputStyles = {
  ...fluideInputStyles,
  fontSize: '14px',
  px: '3',
  py: '2',
  minH: '2.25rem',
}

export const fluideDateInputStyles = {
  ...fluideCompactInputStyles,
  '&::-webkit-calendar-picker-indicator': {
    opacity: 0.35,
    cursor: 'pointer',
    marginLeft: '0.25rem',
  },
}

export const stitchBlackButton = {
  bg: 'brandBlack',
  color: 'white',
  borderRadius: 'pill',
  textStyle: 'labelMd',
  fontWeight: '600',
  _hover: { opacity: 0.9 },
}

export const stitchGreenButton = {
  bg: 'primary',
  color: 'onPrimary',
  borderRadius: 'pill',
  textStyle: 'labelMd',
  fontWeight: '600',
  _hover: { bg: 'secondary' },
}
