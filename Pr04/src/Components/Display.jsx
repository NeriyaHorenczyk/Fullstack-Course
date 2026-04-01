import styles from './CSS/Display.module.css'

function Display({ text, cursorPos, language }) {
    const before = text.slice(0, cursorPos);
    const after = text.slice(cursorPos);
    const isRTL = language === "Hebrew";
    return (
        <div className={styles.display} dir={isRTL ? "rtl" : "ltr"}>
            <span style={{whiteSpace: 'pre-wrap'}}>{before}</span>
            <span key={`${cursorPos}-${text.length}`} className={styles.cursor}>|</span>
            <span style={{whiteSpace: 'pre-wrap'}}>{after}</span>
        </div>
    );
}


export default Display;