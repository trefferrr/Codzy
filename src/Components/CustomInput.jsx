import React from 'react'
import { classnames } from '../Utils/general'
import { useTheme } from '../Context/ThemeContext'

const CustomInput = ({customInput,setCustomInput}) => {
  const { isDarkMode } = useTheme();
  
  return (
   <>
    <textarea
      rows={6}
      value={customInput}
      onChange={(e)=>setCustomInput(e.target.value)}
      placeholder='Enter Input here'
      className={classnames(
        "focus:outline-none w-full rounded-md px-4 py-2 hover:shadow transition duration-200",
        isDarkMode 
          ? "bg-gray-800 text-white border border-gray-700 placeholder-gray-500" 
          : "bg-white text-gray-900 border-2 border-gray-300 shadow-md placeholder-gray-400"
      )}>
    </textarea>
   </>
  )
}

export default CustomInput
