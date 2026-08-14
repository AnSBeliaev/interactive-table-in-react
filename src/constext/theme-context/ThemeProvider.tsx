import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';

type ThemeProviderProps = {
  children: ReactNode;
};

const applyTheme = (isDark: boolean) => {
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(false);

  const toggleMode = () => {
    setIsDark((mode) => {
      const next = !mode;
      applyTheme(next);
      return next;
    });
  };

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  return <ThemeContext.Provider value={{ isDark, toggleMode }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
