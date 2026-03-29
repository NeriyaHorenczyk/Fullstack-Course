import Key from './Key'
import styles from './LanguageBar.module.css'

function LanguageBar({language, setLanguage}) {
    return (
        <section className={styles.languageBar}>
            <Key label="Hebrew" onClick={() => setLanguage("Hebrew")} isSelected={language==="Hebrew"} />
            <Key label="English" onClick={() => setLanguage("English")} isSelected={language==="English"} />
            <Key label="French" onClick={() => setLanguage("French")} isSelected={language==="French"} />
        </section>
      );
}

export default LanguageBar;