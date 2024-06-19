import React, { useEffect, useState,useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import CodeEditor from './CodeEditor';
import OutputDetails from './OutputDetails';
import OutputWindow from './OutputWindow';
import axios from 'axios';
import UseKeyPress from '../Hooks/UseKeyPress';
import { FaPlay, FaPause,FaRedo } from 'react-icons/fa';
import LanguageDropdown from './LanguageDropdown';
import CustomInput from './CustomInput';
import { classnames } from '../Utils/general';
import { LanguageOption } from '../Constants/LanguageOption';
const javascriptDefault = `
console.log("Hello world")`;

const Landing = () => {
  const [code, setCode] = useState(javascriptDefault);
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

  const onSelectChange = (selectedOption) => {
    console.log("Selected Option...", selectedOption);
    setLanguage(selectedOption);
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
      />
      <div className='h-2 absolute z-30 w-full bg-black'>
        <div className="flex items-stretch">
        <div className="flex-1 flex items-center justify-start ml-4 sm:ml-10 sm:mr-12">
        <h1 className="font-bold text-lg sm:text-xl" style={{ fontFamily: 'Times New Roman', margin: 0, padding: 0 }}>
      <span className="font-bold">{'</>'}</span>Codzy
    </h1></div>

          <div className="flex-1 flex items-center justify-center ml-4 ml-20 hidden sm:flex">
            {/* Timer display */}
            <div className="text-xl font-bold mr-2 sm:mr-4">{formatTime(timeElapsed)}</div>

            {/* Start/Stop button */}
            <button
              onClick={timerRunning ? stopTimer : startTimer}
              className="border-2 border-black z-10 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0)] px-3 py-2 mr-2 hover:shadow transition duration-100 bg-green-600 flex-shrink-0 text-white"
            >
              {timerRunning ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5" />}
            </button>
            <button
              onClick={resetTimer}
              className="border-2 border-black z-10 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0)] px-3 py-2 hover:shadow transition duration-100 bg-gray-500 flex-shrink-0 text-white"
            >
              <FaRedo className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-end px-2 sm:px-4 py-2">
            <div className="px-2 sm:px-4 py-2 flex items-center space-x-2 sm:space-x-4 z-20">
              <LanguageDropdown OnSelectChange={onSelectChange} className="w-full sm:w-auto"/>
            </div>
          </div>
        </div>
        <div className='h-2 w-full bg-black'></div>
        <div className='flex flex-col md:flex-row space-x-0 md:space-x-4 items-start px-2 py-4'>
          <div className='flex flex-col w-full h-full justify-start items-start'>
          <div className="w-full flex justify-end px-8 ">
            <button
              onClick={toggleView}
              className={classnames(
                "block md:hidden mr-2 border-2 border-black z-10 rounded-md shadow-[3px_2px_0px_0px_rgba(0,0,0)] px-2 py-2 sm:px-4 hover:shadow transition duration-200 bg-blue-600 flex-shrink-0 text-white",
              )}
            >
              {showEditor ? "Output" : "Editor"}
            </button>
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                "border-2 border-black z-10 rounded-md shadow-[3px_2px_0px_0px_rgba(0,0,0)] px-2 py-2 sm:px-4 hover:shadow transition duration-200 bg-green-600 flex-shrink-0 text-white",
                !code ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Run"}
            </button>
          </div>
          <div className={`${showEditor ? 'block' : 'hidden'} md:block flex flex-col w-full h-full justify-start items-start`}>
            <CodeEditor
              code={code}
              onChange={onChange}
              language={language?.value}
            />
          </div>
        </div>
        <div className={`${!showEditor ? 'block' : 'hidden'} md:block right-container flex flex-shrink-0 w-full md:w-[39%] flex-col`}>
          <OutputWindow outputDetails={outputDetails} />
          <div className='flex flex-col items-end'>
            <CustomInput customInput={customInput} setCustomInput={setCustomInput} />
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
