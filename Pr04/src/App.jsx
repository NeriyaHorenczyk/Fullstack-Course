import { useState } from 'react'
import DisplayArea from './Components/DisplayArea.jsx'
import KeyboardArea from './Components/KeyboardArea.jsx'
import './App.css'

function App() {
  const [text, setText] = useState([])
  const [history, setHistory] = useState([])
  const [language, setLanguage] = useState("Hebrew")
  const [cursorPos, setCursorPos] = useState(0)
  const [currentStyle, setCurrentStyle] = useState({ fontSize: '16px', color: '#000000', fontFamily: 'inherit' })

  return (
    <div className='app'>
      <DisplayArea
        text={text}
        cursorPos={cursorPos}
        language={language}
      />

      <KeyboardArea
        text={text} setText={setText}
        history={history} setHistory={setHistory}
        language={language} setLanguage={setLanguage}
        cursorPos={cursorPos} setCursorPos={setCursorPos}
        currentStyle={currentStyle} setCurrentStyle={setCurrentStyle}
      />
    </div>
  )
}

export default App
