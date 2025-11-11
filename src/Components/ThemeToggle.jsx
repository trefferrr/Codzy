import React from 'react';
import { TbSun, TbMoon } from 'react-icons/tb';
import { useTheme } from '../Context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-full transition-all duration-200 ease-in-out
                 dark:bg-gray-400 bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-400 hover:scale-105"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <TbSun className="w-5 h-5 white" />
      ) : (
        <TbMoon className="w-5 h-5 black" />
      )}
    </button>
  );
};

export default ThemeToggle;