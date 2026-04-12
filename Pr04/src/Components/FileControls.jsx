import { useState } from 'react'
import styles from './CSS/StyleControls.module.css'
import fileStyles from './CSS/FileControls.module.css'

const LS_PREFIX = 'textEditor_'

function getSavedFiles() {
    return Object.keys(localStorage)
        .filter(k => k.startsWith(LS_PREFIX))
        .map(k => k.slice(LS_PREFIX.length))
}

function FileControls({ text, setText, setCursorPos, setHistory }) {
    const [filename, setFilename] = useState('')
    const [savedFiles, setSavedFiles] = useState(getSavedFiles)
    const [selectedFile, setSelectedFile] = useState('')

    const save = (name) => {
        if (!name) return alert('Enter a file name')
        localStorage.setItem(LS_PREFIX + name, JSON.stringify(text))
        setSavedFiles(getSavedFiles())
        setSelectedFile(name)
    }

    const handleSave = () => {
        save(filename)
    }

    const handleSaveAs = () => {
        const name = prompt('Save as:', filename)
        if (!name) return
        setFilename(name)
        save(name)
    }

    const handleOpen = () => {
        if (!selectedFile) return
        const raw = localStorage.getItem(LS_PREFIX + selectedFile)
        if (!raw) return
        const loaded = JSON.parse(raw)
        setHistory([])
        setText(loaded)
        setCursorPos(loaded.length)
        setFilename(selectedFile)
    }

    const handleDelete = () => {
        if (!selectedFile) return
        if (!confirm(`Delete "${selectedFile}"?`)) return
        localStorage.removeItem(LS_PREFIX + selectedFile)
        setSavedFiles(getSavedFiles())
        setSelectedFile('')
    }

    return (
        <section className={styles.styleControls}>
            <label className={styles.label}>File</label>

            <input
                className={fileStyles.input}
                placeholder="Filename"
                value={filename}
                onChange={e => setFilename(e.target.value)}
            />

            <button className={fileStyles.btn} onClick={handleSave}>Save</button>
            <button className={fileStyles.btn} onClick={handleSaveAs}>Save As</button>

            <label className={styles.label}>Open</label>

            <select
                className={styles.select}
                value={selectedFile}
                onChange={e => setSelectedFile(e.target.value)}
            >
                <option value="">-- select --</option>
                {savedFiles.map(f => (
                    <option key={f} value={f}>{f}</option>
                ))}
            </select>

            <button className={fileStyles.btn} onClick={handleOpen}>Open</button>

            <label className={styles.label}>Delete</label>

            <select
                className={styles.select}
                value={selectedFile}
                onChange={e => setSelectedFile(e.target.value)}
            >
                <option value="">-- select --</option>
                {savedFiles.map(f => (
                    <option key={f} value={f}>{f}</option>
                ))}
            </select>

            <button className={fileStyles.btn} onClick={handleDelete}>Delete</button>
        </section>
    )
}

export default FileControls
