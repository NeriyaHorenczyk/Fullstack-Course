import { useState } from 'react'
import Keyboard from './Components/Keyboard.jsx'
import Display from './Components/Display.jsx'
import StyleControls from './Components/StyleControls.jsx'
import FontKeys from './Components/FontKeys.jsx'
import './App.css'

function App() {
  const [text, setText] = useState([])
  const [history, setHistory] = useState([])
  const [language, setLanguage] = useState("Hebrew")
  const [cursorPos, setCursorPos] = useState(0)
  const [currentStyle, setCurrentStyle] = useState({ fontSize: '16px', color: '#000000', fontFamily: 'inherit' })

  return (
    <div className='app'>
      <Display
      text={text}
      cursorPos={cursorPos}
      language={language}
      />

      <div className='keyboardArea'>
        
        <StyleControls 
        currentStyle={currentStyle} setCurrentStyle={setCurrentStyle} 
        />

        <Keyboard
        language={language} setLanguage={setLanguage}
        text={text} setText={setText}
        history={history} setHistory={setHistory}
        cursorPos={cursorPos} setCursorPos={setCursorPos}
        currentStyle={currentStyle}
        />

        <FontKeys 
        currentStyle={currentStyle} setCurrentStyle={setCurrentStyle} 
        />
      </div>
    </div>
  )
}

export default App
