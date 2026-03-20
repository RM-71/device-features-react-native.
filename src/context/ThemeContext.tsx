import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeContextType, ThemeMode } from '../types';
import { DARK_COLORS, LIGHT_COLORS, STORAGE_KEYS } from '../constants/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.theme)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') setMode(saved);
      })
      .catch((err) => console.error('Failed to load theme:', err));
  }, []);

  const toggleTheme = useCallback(async (): Promise<void> => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.theme, next);
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  }, [mode]);

  const theme: Theme = {
    mode,
    colors: mode === 'dark' ? DARK_COLORS : LIGHT_COLORS,
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: mode === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
