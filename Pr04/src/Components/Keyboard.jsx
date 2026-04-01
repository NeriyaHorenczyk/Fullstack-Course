import styles from './CSS/Keyboard.module.css'
import LanguageBar from './LanguageBar'
import CharacterKeys from './CharacterKeys'
import NavigationKeys from './NavigationKeys'
import ActionKeys from './ActionKeys'


function Keyboard({language, setLanguage, text, setText, history, setHistory, cursorPos, setCursorPos}) {
    return (
        <section className={styles.keyboard}>
            <LanguageBar
            language={language} setLanguage={setLanguage}
            />

            <CharacterKeys
            language={language}
            text={text} setText={setText}
            history={history} setHistory={setHistory}
            cursorPos={cursorPos} setCursorPos={setCursorPos}
            />

            <NavigationKeys
            text={text}
            cursorPos={cursorPos} setCursorPos={setCursorPos}
            />

            <ActionKeys
            text={text} setText={setText}
            history={history} setHistory={setHistory}
            cursorPos={cursorPos} setCursorPos={setCursorPos}
            />
        </section>
     );
}

export default Keyboard;