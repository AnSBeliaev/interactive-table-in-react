import { createContext } from 'react';

export type ThemeContextValue = {
  isDark: boolean;
  toggleMode: () => void;
};
export const ThemeContext = createContext<ThemeContextValue | null>(null);
