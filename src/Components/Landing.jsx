import React, { useEffect, useState, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import CodeEditor from './CodeEditor';
import OutputDetails from './OutputDetails';
import OutputWindow from './OutputWindow';
import axios from 'axios';
import UseKeyPress from '../Hooks/UseKeyPress';
import { FaPlay, FaPause, FaRedo, FaDownload } from 'react-icons/fa';
import LanguageDropdown from './LanguageDropdown';
import CustomInput from './CustomInput';
import ThemeToggle from './ThemeToggle';
import { classnames } from '../Utils/general';
import { LanguageOption } from '../Constants/LanguageOption';
import { useTheme } from '../Context/ThemeContext';
import { getHelloWorldTemplate } from '../Constants/HelloWorldTemplate';

const Landing = () => {
  const [code, setCode] = useState(getHelloWorldTemplate('javascript'));
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [language, setLanguage] = useState(LanguageOption[0]);
  const enterpress = UseKeyPress("Enter");
  const ctrlpress = UseKeyPress("Control");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showEditor, setShowEditor] = useState(true);
  const timerRef = useRef(null);
  const editorRef = useRef(null);


  const onSelectChange = (selectedOption) => {
    console.log("Selected Option...", selectedOption);
    setLanguage(selectedOption);
    // Load the appropriate Hello World template for the selected language
    setCode(getHelloWorldTemplate(selectedOption.value));
  };

  useEffect(() => {
    if (enterpress && ctrlpress) {
      console.log("Enter pressed", enterpress);
      console.log("Control pressed", ctrlpress);
      
    }
  }, [ctrlpress, enterpress]);

  const startTimer = () => {
    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimeElapsed(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setTimerRunning(false);
    clearInterval(timerRef.current);
    timerRef.current = null;
  };
  const resetTimer = () => {
    setTimerRunning(false);
    clearInterval(timerRef.current);
    timerRef.current = null;
    setTimeElapsed(0);
  };

  useEffect(() => {
    return () => {
      // Clean up the interval when the component unmounts
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const toggleView = () => {
    setShowEditor(!showEditor);
  };
  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("Case not handled!", action, data);
      }
    }
  };

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      source_code: btoa(code),
      stdin: btoa(customInput),
    };

   const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": 'judge0-ce.p.rapidapi.com',
        "X-RapidAPI-Key": 'd733c648f1mshe43d60590914b45p1a1572jsncc8aa30644b5',
      },
      data: formData,
    };


    axios.request(options).then(function (response) {
      console.log("res.data", response.data);
      const token = response.data.token;
      CheckStatus(token);
    }).catch((err) => {
      let error = err.response ? err.response.data : err;
      let status = err.response.status;
      console.log("status", status);

      if (status === 429) {
        console.log("Too many requests", status);
        showErrorToast(
          `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to set up your own RAPID API Judge0!`,
          10000
        );
      }

      setProcessing(false);
      console.log("Catch block:", error);
    });
  };

  const fileExtensionByLanguage = (lang) => {
    const map = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      csharp: 'cs',
      ruby: 'rb',
      php: 'php',
      go: 'go',
      rust: 'rs',
      kotlin: 'kt',
      scala: 'scala',
      perl: 'pl',
      r: 'r',
      bash: 'sh',
      assembly: 'asm',
      basic: 'bas',
      cobol: 'cob',
      lisp: 'lisp',
      sql: 'sql',
      swift: 'swift',
      text: 'txt',
    };
    return map[lang] || 'txt';
  };

  const handleDownload = () => {
    const ext = fileExtensionByLanguage(language?.value);
    const filename = `code.${ext}`;
    const blob = new Blob([code || ''], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleResetCode = () => {
    const template = getHelloWorldTemplate(language?.value);
    setCode(template);
  };

  const CheckStatus = async (token) => {
     const options = {
      method: "GET",
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": 'judge0-ce.p.rapidapi.com',
        "X-RapidAPI-Key": 'd733c648f1mshe43d60590914b45p1a1572jsncc8aa30644b5',
      },
    };



    try {
      let response = await axios.request(options);
      let statusId = response.data.status.id;
      

      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          CheckStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast('Compiled Successfully');
        console.log('response.data', response.data);
        return;
      }
    } catch (err) {
      console.log("Error", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  const showSuccessToast = (msg) => {
    toast.success(msg || 'Compiled Successfully', {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const { isDarkMode } = useTheme();
  
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={20}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-200`}>
        <div className={`sticky top-0 z-30 w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="flex items-stretch p-3">
            <div className="flex-1 flex items-center justify-start ml-4 sm:ml-10 sm:mr-12">
              <h1 className="font-bold text-lg sm:text-xl" style={{ fontFamily: 'Poppins, sans-serif', margin: 0, padding: 0 }}>
                <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{'</>'}</span>
                <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Codzy</span>
              </h1>
            </div>

            <div className="flex-1 items-center justify-center ml-20 hidden sm:flex">
              {/* Timer display */}
              <div className={`text-xl font-bold mr-2 sm:mr-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatTime(timeElapsed)}</div>

              {/* Start/Stop button */}
              <button
                onClick={timerRunning ? stopTimer : startTimer}
                className={`border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} z-10 rounded-md shadow-sm px-3 py-2 mr-2 hover:shadow transition duration-100 ${timerRunning ? 'bg-gray-700' : 'bg-blue-600 border-blue-700 opacity-80'} flex-shrink-0 text-white`}
              >
                {timerRunning ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5" />}
              </button>
              <button
                onClick={resetTimer}
                className={`border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} z-10 rounded-md shadow-sm px-3 py-2 hover:shadow transition duration-100 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'} flex-shrink-0 text-white`}
              >
                <FaRedo className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-end px-2 sm:px-4 py-2">
              <ThemeToggle />
            </div>
          </div>
          <div className={`h-1 w-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
        <div className='flex flex-col md:flex-row space-x-0 md:space-x-4 items-start px-2 py-4'>
          {/* LEFT: Editor section */}
          <div className='flex flex-col w-full h-full justify-start items-start md:w-[61%]'>
            {/* Editor header with language dropdown (like the screenshot) */}
            <div className='w-full flex items-center justify-between px-2 sm:px-4 pb-2'>
              <div className='flex items-center space-x-2'>
                <LanguageDropdown OnSelectChange={onSelectChange} className="w-full sm:w-auto"/>
              </div>
              {/* Mobile toggle to switch to Output */}
              <div className='flex md:hidden'>
                <button
                  onClick={toggleView}
                  className={classnames(
                    "mr-2 border rounded-md px-3 py-2 hover:shadow transition duration-200 text-white",
                    isDarkMode ? "bg-blue-600 border-blue-700" : "bg-blue-500 border-blue-600"
                  )}
                >
                  {showEditor ? "Output" : "Editor"}
                </button>
              </div>
            </div>
            <div className={`${showEditor ? 'block' : 'hidden'} md:block flex flex-col w-full h-full justify-start items-start`}>
              <CodeEditor
                code={code}
                onChange={onChange}
                language={language?.value}
                editorRef={editorRef}
              />
            </div>
          </div>
          {/* RIGHT: Controls, input and output */}
          <div className={`${!showEditor ? 'block' : 'hidden'} md:block right-container flex flex-shrink-0 w-full md:w-[39%] flex-col`}>
            {/* Right panel header with actions */}
            <div className='w-full flex items-center justify-between px-2 sm:px-0 pb-3'>
              <div className='flex-1'></div>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={handleCompile}
                  disabled={!code}
                  className={classnames(
                    "border rounded-md px-4 py-2 hover:shadow transition duration-200 text-white",
                    isDarkMode ? 
                      (code ? "bg-blue-600 border-blue-700" : "bg-blue-600 border-blue-700 opacity-50") : 
                      (code ? "bg-blue-600 border-blue-700" : "bg-blue-600 border-blue-700 opacity-50")
                  )}
                >
                  {processing ? "Processing..." : "Run"}
                </button>
                <button
                  onClick={handleDownload}
                  title="Download code"
                  className={classnames(
                    "border rounded-md px-3 py-2 flex items-center justify-center transition duration-200",
                    isDarkMode ? "text-white border-gray-600 hover:bg-gray-700" : "text-gray-800 border-gray-300 hover:bg-gray-100"
                  )}
                >
                  <FaDownload className="w-5 h-5" />
                </button>
                <button
                  onClick={handleResetCode}
                  title="Reset code"
                  className={classnames(
                    "border rounded-md px-3 py-2 flex items-center justify-center transition duration-200",
                    isDarkMode ? "text-white border-gray-600 hover:bg-gray-700" : "text-gray-800 border-gray-300 hover:bg-gray-100"
                  )}
                >
                  <FaRedo className="w-5 h-5" />
                </button>
                <button
                />
              </div>
            </div>
            <div className='flex flex-col mb-4'>
              <CustomInput customInput={customInput} setCustomInput={setCustomInput} />
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                If your code takes input, add it in the above box before
              </p>
            </div>
            <OutputWindow outputDetails={outputDetails} />
            {outputDetails && <OutputDetails outputDetails={outputDetails} />}
          </div>
        </div>
      </div>
    </div>
    </>
 );
}

export default Landing;
