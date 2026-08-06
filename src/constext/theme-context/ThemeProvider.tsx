import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(false);
  const toggleMode = () => {
    setIsDark((mode) => !mode);
  };
  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark]);
  return <ThemeContext.Provider value={{ isDark, toggleMode }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
