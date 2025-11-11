import React from 'react'
import { useTheme } from '../Context/ThemeContext'

const OutputDetails = ({outputDetails}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className='metrics-container mt-4 flex flex-col space-y-3'>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Status:{" "}
            <span className={`font-semibold px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                {outputDetails?.status?.description}
            </span>  
        </p>
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Memory:{" "}
        <span className={`font-semibold px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
            {outputDetails?.memory}
        </span>
      </p>
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Time:{" "}
        <span className={`font-semibold px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
            {outputDetails?.time}
        </span>
      </p>
    </div>
  )
}

export default OutputDetails
