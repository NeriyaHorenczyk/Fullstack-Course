import { useState } from 'react'
import DisplayArea from './Components/DisplayArea.jsx'
import KeyboardArea from './Components/KeyboardArea.jsx'
import Login from './Components/Login.jsx'
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
    language: 'Hebrew',
    isDirty: false,
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('textEditor_session') || null)
  const [panels, setPanels] = useState([createPanel(1)])
  const [activePanelId, setActivePanelId] = useState(1)

  const activePanel = panels.find(p => p.id === activePanelId) || panels[0]

  const updateActivePanel = (updates) => {
    setPanels(prev => prev.map(p =>
      p.id === activePanel.id ? { ...p, ...updates } : p
    ))
  }

  const setText = (val) => updateActivePanel({ text: val, isDirty: true })
  const setHistory = (val) => updateActivePanel({ history: val })
  const setCursorPos = (val) => updateActivePanel({ cursorPos: val })
  const setCurrentStyle = (val) => updateActivePanel({ currentStyle: val })
  const setFilename = (val) => updateActivePanel({ filename: val })
  const setLanguage = (val) => updateActivePanel({ language: val })
  const setIsDirty = (val) => updateActivePanel({ isDirty: val })

  const handleNewPanel = () => {
    const id = nextIdCounter++
    setPanels(prev => [...prev, createPanel(id)])
    setActivePanelId(id)
  }

  const handleClosePanel = (id) => {
    const panel = panels.find(p => p.id === id)
    if (panel.isDirty) {
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

  const handleLogin = (username) => {
    localStorage.setItem('textEditor_session', username)
    setCurrentUser(username)
  }

  const handleLogout = () => {
    localStorage.removeItem('textEditor_session')
    setCurrentUser(null)
    const freshId = nextIdCounter++
    setPanels([createPanel(freshId)])
    setActivePanelId(freshId)
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className='app'>
      <DisplayArea
        panels={panels}
        activePanelId={activePanel.id}
        setActivePanelId={setActivePanelId}
        onClosePanel={handleClosePanel}
        onNewPanel={handleNewPanel}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <KeyboardArea
        text={activePanel.text} setText={setText}
        history={activePanel.history} setHistory={setHistory}
        language={activePanel.language} setLanguage={setLanguage}
        cursorPos={activePanel.cursorPos} setCursorPos={setCursorPos}
        currentStyle={activePanel.currentStyle} setCurrentStyle={setCurrentStyle}
        filename={activePanel.filename} setFilename={setFilename}
        currentUser={currentUser}
        setIsDirty={setIsDirty}
      />
    </div>
  )
}

export default App
