import { useState } from 'react'
import styles from './CSS/Login.module.css'

const LS_USERS_KEY = 'textEditor_users'

function getUsers() {
    const raw = localStorage.getItem(LS_USERS_KEY)
    return raw ? JSON.parse(raw) : {}
}

function saveUsers(users) {
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(users))
}

function Login({ onLogin }) {
    const [mode, setMode] = useState('login')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const clearError = () => setError('')

    const handleSubmit = (e) => {
        e.preventDefault()
        const trimmed = username.trim()
        if (!trimmed) { setError('Username cannot be empty'); return }

        const users = getUsers()

        if (mode === 'register') {
            if (users[trimmed] !== undefined) {
                setError('Username already exists')
                return
            }
            users[trimmed] = password
            saveUsers(users)
            onLogin(trimmed)
        } else {
            if (users[trimmed] === undefined || users[trimmed] !== password) {
                setError('Invalid username or password')
                return
            }
            onLogin(trimmed)
        }
    }

    const switchMode = (next) => {
        setMode(next)
        setError('')
        setUsername('')
        setPassword('')
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <h2 className={styles.title}>Text Editor</h2>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
                        onClick={() => switchMode('login')}
                    >Login</button>
                    <button
                        className={`${styles.tab} ${mode === 'register' ? styles.activeTab : ''}`}
                        onClick={() => switchMode('register')}
                    >Register</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => { setUsername(e.target.value); clearError() }}
                        autoFocus
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => { setPassword(e.target.value); clearError() }}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <button className={styles.submit} type="submit">
                        {mode === 'login' ? 'Login' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
