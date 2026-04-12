import Display from './Display.jsx'

function DisplayArea({ text, cursorPos, language }) {
  return (
    <Display
      text={text}
      cursorPos={cursorPos}
      language={language}
    />
  )
}

export default DisplayArea
