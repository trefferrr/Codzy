# Codzy

An in-browser multi-language code runner and editor powered by Monaco Editor and Judge0 CE (via RapidAPI). Write code, provide custom input, and run it across 40+ languages with a clean, responsive UI and dark/light themes.

## Features
- Multi-language support with syntax highlighting (Monaco)
- One-click Run via Judge0 CE API
- Custom input box (stdin)
- Output panel with success/error states
- Language-aware Hello World templates
- Download current code with the correct file extension
- Reset code to the language template
- Dark/Light theme with elegant toggle
- Responsive layout (editor left, input+output right)

## Tech Stack
- React (Create React App)
- Monaco Editor (`@monaco-editor/react`)
- Tailwind CSS
- Judge0 CE via RapidAPI
- react-select (themed language dropdown)
- react-toastify (notifications)

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Configure environment variables

Create a file named `.env.local` in the project root:

```bash
REACT_APP_RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
REACT_APP_RAPIDAPI_KEY=your_rapidapi_key_here
```

Notes:
- React only exposes variables prefixed with `REACT_APP_`.
- Restart the dev server after editing env files.

3) Run the app

```bash
npm start
```

Open http://localhost:3000 in your browser.

## Usage
- Select a language from the dropdown; the editor loads a Hello World template for that language.
- Enter input in the “Enter Input here” box if your program expects stdin.
- Click Run to compile/execute via Judge0.
- Download: saves the current code as `code.<ext>` (extension matches the selected language).
- Reset: restores the Hello World template for the selected language.
- Toggle theme using the sun/moon button.

## Keyboard Tips
- The Monaco editor supports common shortcuts like Ctrl/Cmd+S (no-op), multi-cursor edits, and search.

## Project Structure (key files)
- `src/Components/Landing.jsx`: main layout and actions (run, download, reset)
- `src/Components/CodeEditor.jsx`: Monaco editor wrapper
- `src/Components/OutputWindow.jsx`: output display
- `src/Components/CustomInput.jsx`: stdin textarea
- `src/Components/LanguageDropdown.jsx`: themed language selector
- `src/Context/ThemeContext.js`: dark/light state
- `src/Constants/HelloWorldTemplate.jsx`: language templates
- `src/Constants/LanguageOption.jsx`: Judge0 language list

## Environment and Security
- Do not commit your real RapidAPI key. Use `.env.local` (ignored by Git).
- In production, ensure the key is stored securely in your hosting provider’s env settings.

## Troubleshooting
- API key missing: you’ll see a toast asking to set `REACT_APP_RAPIDAPI_KEY`.
- 429 Too many requests: free RapidAPI tiers are limited. Consider your own Judge0 instance or a paid plan.
- Editor not updating on language change: ensure `CodeEditor` receives updated `code` prop (already wired).
- Changes to `.env.local` not applied: restart `npm start`.

## Scripts
- `npm start` — start dev server
- `npm run build` — production build
- `npm test` — run tests (if any)

## License
This project is provided as-is for educational purposes. Judge0 and dependent services have their own licenses/terms; please review them before production use.
