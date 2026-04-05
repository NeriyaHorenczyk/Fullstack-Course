import { useState } from 'react'
import styles from './CSS/SearchReplace.module.css'

function SearchReplace({ text, setText, history, setHistory, setCursorPos, cursorPos }) {
    const [findChar, setFindChar] = useState('')
    const [replaceChar, setReplaceChar] = useState('')

    // Move cursor to the next occurrence of findChar starting after cursorPos
    const handleFind = () => {
        if (findChar === '') return;

        // Search from cursorPos onward, then wrap around
        for (let i = cursorPos; i < text.length; i++) {
            if (text[i].char === findChar) {
                setCursorPos(i + 1);
                return;
            }
        }
        // Wrap: search from beginning
        for (let i = 0; i < cursorPos; i++) {
            if (text[i].char === findChar) {
                setCursorPos(i + 1);
                return;
            }
        }
    };

    // Replace all occurrences of findChar with replaceChar in text
    const handleReplace = () => {
        if (findChar === '') return;
        const newText = text.map(c =>
            c.char === findChar ? { ...c, char: replaceChar } : c
        );
        setHistory([...history, text]);
        setText(newText);
    };

    return (
        <div className={styles.searchReplace}>
            <input
                className={styles.input}
                maxLength={1}
                placeholder="Find"
                value={findChar}
                onChange={e => setFindChar(e.target.value)}
            />
            <button className={styles.btn} onClick={handleFind}>Find</button>

            <input
                className={styles.input}
                maxLength={1}
                placeholder="Replace"
                value={replaceChar}
                onChange={e => setReplaceChar(e.target.value)}
            />
            <button className={styles.btn} onClick={handleReplace}>Replace</button>
        </div>
    );
}

export default SearchReplace;
