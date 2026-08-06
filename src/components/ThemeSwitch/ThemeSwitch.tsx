import { useContext } from 'react';

import { ThemeContext } from '../../constext';
import type { ThemeContextValue } from '../../constext/theme-context/ThemeContext';

const ToggleSwitch = () => {
  const theme = useContext<ThemeContextValue | null>(ThemeContext);
  if (!theme) throw new Error('useTheme must be used within ThemeProvider');
  const { toggleMode } = theme;

  return (
    <div className="ToggleSwitch-div">
      <label className="switch">
        <input onClick={toggleMode} type="checkbox" />
        <span></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
