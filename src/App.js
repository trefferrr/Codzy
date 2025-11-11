import './App.css';
// import CodeEditor from './Components/CodeEditor';
import Landing from './Components/Landing';
import { ThemeProvider } from './Context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Landing/>
    </ThemeProvider>
  );
}

export default App;
