import { useContext } from 'react';

import styles from './ToggleSwitch.module.css';

import { ThemeContext } from '../../constext';
import type { ThemeContextValue } from '../../constext/theme-context/ThemeContext';

const ToggleSwitch = () => {
  const theme = useContext<ThemeContextValue | null>(ThemeContext);
  if (!theme) throw new Error('useTheme must be used within ThemeProvider');
  const { toggleMode } = theme;

  return (
    <label className={styles['switch-container']}>
      <span className={styles['switch-label']}>Theme</span>
      <div className={styles['switch-wrapper']}>
        <input onClick={toggleMode} type="checkbox" className={styles['switch-input']} />
        <span className={styles['switch-slider']} />
      </div>
    </label>
  );
};

export default ToggleSwitch;
