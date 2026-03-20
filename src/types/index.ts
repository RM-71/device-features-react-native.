// ─── Travel Entry ─────────────────────────────────────────────────────────────

export interface TravelEntry {
  id: string;
  imageUri: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface TravelEntryDraft {
  imageUri: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
};

// ─── Theme ────────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentLight: string;
  border: string;
  borderLight: string;
  destructive: string;
  success: string;
  overlay: string;
  shadow: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

export interface DiaryContextType {
  entries: TravelEntry[];
  addEntry: (entry: Omit<TravelEntry, 'id' | 'createdAt'>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  isLoading: boolean;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}
