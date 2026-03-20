import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelEntry, DiaryContextType } from '../types';
import { STORAGE_KEYS } from '../constants/theme';

// Simple UUID generator (no external dep issues)
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
};

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load persisted entries on mount
  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.entries);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setEntries(parsed as TravelEntry[]);
          }
        }
      } catch (err) {
        console.error('Failed to load entries:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Persist helper
  const persist = useCallback(async (data: TravelEntry[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to persist entries:', err);
      throw new Error('Could not save entry. Please try again.');
    }
  }, []);

  const addEntry = useCallback(
    async (entryData: Omit<TravelEntry, 'id' | 'createdAt'>): Promise<void> => {
      const newEntry: TravelEntry = {
        ...entryData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const updated = [newEntry, ...entries];
      await persist(updated);
      setEntries(updated);
    },
    [entries, persist]
  );

  const removeEntry = useCallback(
    async (id: string): Promise<void> => {
      if (!id || typeof id !== 'string') throw new Error('Invalid entry ID.');
      const updated = entries.filter((e) => e.id !== id);
      await persist(updated);
      setEntries(updated);
    },
    [entries, persist]
  );

  return (
    <DiaryContext.Provider value={{ entries, addEntry, removeEntry, isLoading }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = (): DiaryContextType => {
  const ctx = useContext(DiaryContext);
  if (!ctx) throw new Error('useDiary must be used within DiaryProvider');
  return ctx;
};
