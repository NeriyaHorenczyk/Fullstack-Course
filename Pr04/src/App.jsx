import { useState } from 'react'
import Keyboard from './Components/Keyboard.jsx'
import Display from './Components/Display.jsx'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [history, setHistory] = useState([])
  const [language, setLanguage] = useState("Hebrew")
  const [cursorPos, setCursorPos] = useState(0)
  

  console.log('history:', history)

  return (
    <div className='app'>
      <Display
      text={text}
      cursorPos={cursorPos}
      language={language}
      />
      
      <Keyboard 
      language={language} setLanguage={setLanguage} 
      text={text} setText={setText} 
      history={history} setHistory={setHistory}
      cursorPos={cursorPos} setCursorPos={setCursorPos} 
      />

    </div>
  )
}

export default App
