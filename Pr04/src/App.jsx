import { useState } from 'react'
import DisplayArea from './Components/DisplayArea.jsx'
import KeyboardArea from './Components/KeyboardArea.jsx'
import './App.css'

let nextIdCounter = 2

function createPanel(id) {
  return {
    id,
    text: [],
    history: [],
    cursorPos: 0,
    currentStyle: { fontSize: '16px', color: '#000000', fontFamily: 'inherit' },
    filename: '',
    language: 'Hebrew'
  }
}

function App() {
  const [panels, setPanels] = useState([createPanel(1)])
  const [activePanelId, setActivePanelId] = useState(1)

  const activePanel = panels.find(p => p.id === activePanelId) || panels[0]

  const updateActivePanel = (updates) => {
    setPanels(prev => prev.map(p =>
      p.id === activePanel.id ? { ...p, ...updates } : p
    ))
  }

  const setText = (val) => updateActivePanel({ text: val })
  const setHistory = (val) => updateActivePanel({ history: val })
  const setCursorPos = (val) => updateActivePanel({ cursorPos: val })
  const setCurrentStyle = (val) => updateActivePanel({ currentStyle: val })
  const setFilename = (val) => updateActivePanel({ filename: val })
  const setLanguage = (val) => updateActivePanel({ language: val })

  const handleNewPanel = () => {
    const id = nextIdCounter++
    setPanels(prev => [...prev, createPanel(id)])
    setActivePanelId(id)
  }

  const handleClosePanel = (id) => {
    const panel = panels.find(p => p.id === id)
    if (panel.text.length > 0) {
      if (!confirm(`"${panel.filename || 'Untitled'}" has unsaved content. Close anyway?`)) return
    }
    const remaining = panels.filter(p => p.id !== id)
    if (remaining.length === 0) {
      const newId = nextIdCounter++
      setPanels([createPanel(newId)])
      setActivePanelId(newId)
      return
    }
    setPanels(remaining)
    if (activePanelId === id) {
      setActivePanelId(remaining[remaining.length - 1].id)
    }
  }

  return (
    <div className='app'>
      <DisplayArea
        panels={panels}
        activePanelId={activePanel.id}
        setActivePanelId={setActivePanelId}
        onClosePanel={handleClosePanel}
        onNewPanel={handleNewPanel}
      />

      <KeyboardArea
        text={activePanel.text} setText={setText}
        history={activePanel.history} setHistory={setHistory}
        language={activePanel.language} setLanguage={setLanguage}
        cursorPos={activePanel.cursorPos} setCursorPos={setCursorPos}
        currentStyle={activePanel.currentStyle} setCurrentStyle={setCurrentStyle}
        filename={activePanel.filename} setFilename={setFilename}
      />
    </div>
  )
}

export default App
