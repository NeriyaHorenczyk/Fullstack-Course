import styles from './CSS/Keyboard.module.css'
import LanguageBar from './LanguageBar'
import CharacterKeys from './CharacterKeys'
import ActionKeys from './ActionKeys'


function Keyboard({language, setLanguage, text, setText, history, setHistory}) {
    return ( 
        <section className={styles.keyboard}>
            <LanguageBar language={language} setLanguage={setLanguage} />
            <CharacterKeys language={language} text={text} setText={setText} />
            <ActionKeys text={text} setText={setText} history={history} setHistory={setHistory} />
        </section>
     );
}

export default Keyboard;