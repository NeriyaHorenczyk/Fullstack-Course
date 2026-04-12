import Display from './Display.jsx'
import styles from './CSS/DisplayArea.module.css'

function DisplayArea({ panels, activePanelId, setActivePanelId, onClosePanel, onNewPanel, currentUser, onLogout }) {
  return (
    <div className={styles.displayArea}>
      <div className={styles.toolbar}>
        <span className={styles.userInfo}>Logged in as <strong>{currentUser}</strong></span>
        <button className={styles.logoutBtn} onClick={onLogout}>Logout</button>
        <button className={styles.newPanelBtn} onClick={onNewPanel}>+ New Panel</button>
      </div>

      <div className={styles.panelsContainer}>
        {panels.map(panel => (
          <div
            key={panel.id}
            className={`${styles.panel} ${panel.id === activePanelId ? styles.active : ''}`}
            onClick={() => setActivePanelId(panel.id)}
          >
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>{panel.filename || 'Untitled'}{panel.isDirty ? ' *' : ''}</span>
              <button
                className={styles.closeBtn}
                onClick={e => { e.stopPropagation(); onClosePanel(panel.id) }}
              >×</button>
            </div>

            <Display
              text={panel.text}
              cursorPos={panel.cursorPos}
              language={panel.language}
              isActive={panel.id === activePanelId}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DisplayArea
