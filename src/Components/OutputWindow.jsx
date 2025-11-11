import React from "react";
import { useTheme } from "../Context/ThemeContext";

const OutputWindow = ({outputDetails}) => {
  const { isDarkMode } = useTheme();
  
  const getOutput = () => {
    let statusId = outputDetails?.status?.id

    if (statusId === 6) {
      return (
        <pre className={`px-2 py-1 font-normal text-xl ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
          {atob(outputDetails?.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className={`px-2 py-1 font-normal text-xl ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}>
          {atob(outputDetails.stdout) != null
            ? `${atob(outputDetails.stdout)}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className={`px-2 py-1 font-normal text-xs ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      return (
        <pre className={`px-2 py-1 font-normal text-xs ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
          {atob(outputDetails?.stderr)}
        </pre>
      );
    }
  };
  return (
    <>
      <h1 className={`font-bold text-xl mb-2 ${isDarkMode ? 'text-blue-400' : 'bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700'}`}>
        Output
      </h1>
      <div className={`w-full h-56 rounded-md font-normal text-sm overflow-y-auto border ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-[#1e293b] text-white border-gray-600'}`}>
        {outputDetails ? <>{getOutput()}</> : 
        <div className={`h-full flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-300'}`}>
          <p>Run your code to see the output here</p>
        </div>}
      </div>
    </>
  );
};

export default OutputWindow;
