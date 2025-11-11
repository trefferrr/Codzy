import React from 'react'
import { LanguageOption } from '../Constants/LanguageOption'
import Select from 'react-select';
import { useTheme } from '../Context/ThemeContext';

const LanguageDropdown = ({OnSelectChange}) => {
  const { isDarkMode } = useTheme();
  
  const themedStyles = {
    control: (styles) => ({
      ...styles,
      width: "100%",
      maxWidth: "14rem",
      minWidth: "12rem",
      borderRadius: "5px",
      fontSize: "0.8rem",
      lineHeight: "1.75rem",
      cursor: "pointer",
      backgroundColor: isDarkMode ? "#1f2937" : "#FFFFFF", // gray-800 / white
      color: isDarkMode ? "#FFFFFF" : "#000000",
      border: isDarkMode ? "2px solid #374151" : "2px solid #000000", // gray-700 / black
      boxShadow: "5px 5px 0px 0px rgba(0,0,0)",
      ":hover": {
        border: isDarkMode ? "2px solid #4b5563" : "2px solid #000000", // gray-600
        boxShadow: "none",
      },
    }),
    option: (styles, state) => ({
      ...styles,
      color: isDarkMode ? "#FFFFFF" : "#000000",
      fontSize: "0.8rem",
      lineHeight: "1.75rem",
      width: "100%",
      background: state.isFocused
        ? (isDarkMode ? "#374151" : "rgb(243 244 246)") // gray-700 / gray-100
        : (isDarkMode ? "#1f2937" : "#FFFFFF"), // gray-800 / white
      cursor: "pointer",
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: isDarkMode ? "#1f2937" : "#FFFFFF",
      maxWidth: "14rem",
      border: isDarkMode ? "2px solid #374151" : "2px solid #000000",
      borderRadius: "5px",
      boxShadow: "5px 5px 0px 0px rgba(0,0,0)",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      overflow: "hidden",
    }),
    singleValue: (styles) => ({
      ...styles,
      color: isDarkMode ? "#FFFFFF" : "#000000",
    }),
    placeholder: (styles) => ({
      ...styles,
      color: isDarkMode ? "#9CA3AF" : "#000000", // gray-400 / black
      fontSize: "0.8rem",
      lineHeight: "1.75rem",
    }),
    input: (styles) => ({
      ...styles,
      color: isDarkMode ? "#FFFFFF" : "#000000",
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
  };

  return (
  <Select
  placeholder={'Filter by Category'}
  options={LanguageOption}
  styles={themedStyles}
  defaultValue={LanguageOption[0]}
  onChange={(selectedOption)=>OnSelectChange(selectedOption)}/>
  )
}

export default LanguageDropdown
