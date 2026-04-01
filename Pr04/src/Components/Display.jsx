import styles from './CSS/Display.module.css'

function Display({ text, cursorPos, language }) {
    const before = text.slice(0, cursorPos);
    const after = text.slice(cursorPos);
    const isRTL = language === "Hebrew";
    const cursorKey = `${cursorPos}-${text.length}`;
    return (
        <div className={styles.display} dir={isRTL ? "rtl" : "ltr"}>
            {before.map((c, i) => <span key={i} style={c.style}>{c.char}</span>)}
            <span key={cursorKey} className={styles.cursor}>|</span>
            {after.map((c, i) => <span key={before.length + 1 + i} style={c.style}>{c.char}</span>)}
        </div>
    );
}

export default Display;
