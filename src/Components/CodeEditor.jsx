import React, {useState} from 'react'
import Editor from '@monaco-editor/react';
import { useTheme } from '../Context/ThemeContext';

const CodeEditor = ({onChange, language, code, editorRef}) => {
  const { isDarkMode } = useTheme();
  const [value, setValue] = useState(code || "");
    React.useEffect(() => {
    setValue(code || "");
  }, [code]);
  
  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };
  
  const handleMount = (editor) => {
    if (editorRef) {
      editorRef.current = editor;
    }
  };
  
  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl py-1">
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "javascript"}
        value={value}
        theme={isDarkMode ? "vs-dark" : "light"}
        onChange={handleEditorChange}
        onMount={handleMount}
      />
    </div>
  )
}

export default CodeEditor;