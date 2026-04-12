import Keyboard from './Keyboard.jsx'
import StyleControls from './StyleControls.jsx'
import FontKeys from './FontKeys.jsx'
import FileControls from './FileControls.jsx'

function KeyboardArea({
  text, setText,
  history, setHistory,
  language, setLanguage,
  cursorPos, setCursorPos,
  currentStyle, setCurrentStyle,
}) {
  return (
    <div className='keyboardArea'>
      <StyleControls
        currentStyle={currentStyle} setCurrentStyle={setCurrentStyle}
        onApplyToAll={() => setText(text.map(c => ({ ...c, style: currentStyle })))}
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

      <FileControls
        text={text} setText={setText}
        setCursorPos={setCursorPos}
        setHistory={setHistory}
      />
    </div>
  )
}

export default KeyboardArea
