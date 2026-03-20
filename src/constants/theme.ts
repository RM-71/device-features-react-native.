import { ThemeColors } from '../types';

export const DARK_COLORS: ThemeColors = {
  background: '#080C14',
  surface: '#0F1520',
  surfaceElevated: '#16202E',
  card: '#111827',
  text: '#F0F4FF',
  textSecondary: '#8A9BBF',
  textTertiary: '#4A5570',
  accent: '#F59E0B',
  accentLight: '#FCD34D',
  border: '#1E2D45',
  borderLight: '#162035',
  destructive: '#EF4444',
  success: '#10B981',
  overlay: 'rgba(0,0,0,0.75)',
  shadow: '#000000',
};

export const LIGHT_COLORS: ThemeColors = {
  background: '#F8FAFF',
  surface: '#FFFFFF',
  surfaceElevated: '#F0F4FF',
  card: '#FFFFFF',
  text: '#0A0F1E',
  textSecondary: '#3D4F6B',
  textTertiary: '#8A9BBF',
  accent: '#D97706',
  accentLight: '#F59E0B',
  border: '#DDE3F0',
  borderLight: '#EEF1F9',
  destructive: '#DC2626',
  success: '#059669',
  overlay: 'rgba(0,0,0,0.45)',
  shadow: '#1E2D45',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  xxl: 28,
  round: 9999,
} as const;

export const TYPOGRAPHY = {
  displayLarge:  { fontSize: 40, fontWeight: '800' as const, letterSpacing: -1.5 },
  displayMedium: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -1.0 },
  displaySmall:  { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.5 },
  titleLarge:    { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3 },
  titleMedium:   { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.2 },
  titleSmall:    { fontSize: 15, fontWeight: '600' as const, letterSpacing: -0.1 },
  bodyLarge:     { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium:    { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall:     { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
  labelLarge:    { fontSize: 12, fontWeight: '600' as const, letterSpacing: 1.2 },
  labelMedium:   { fontSize: 10, fontWeight: '600' as const, letterSpacing: 1.5 },
  labelSmall:    { fontSize: 9,  fontWeight: '700' as const, letterSpacing: 2.0 },
} as const;

export const ANIMATION = {
  fast: 200,
  medium: 300,
  slow: 500,
} as const;

export const STORAGE_KEYS = {
  entries: '@travel_diary_entries',
  theme: '@travel_diary_theme',
} as const;