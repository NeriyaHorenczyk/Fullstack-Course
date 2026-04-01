import React, {useState} from 'react'
import styles from './CSS/CharacterKeys.module.css'
import { characters } from '../Data/Characters'
import Key from './Key'
import { MdKeyboardReturn } from 'react-icons/md';


function CharacterKeys({language="Hebrew", text, setText, history, setHistory, cursorPos, setCursorPos, currentStyle}) {

    const insertAtCursor = (char) => {
        setHistory([...history, text]);
        const newText = [
            ...text.slice(0, cursorPos),
            { char, style: { ...currentStyle } },
            ...text.slice(cursorPos)
        ];
        setText(newText);
        setCursorPos(cursorPos + 1);
    };

    const [isCaps, setIsCaps] = useState(false);
    const [isSpecial, setIsSpecial] = useState(false);

    const letterRows = characters[language][isCaps && characters[language].secondary ? "secondary" : "primary"]
    const numberRow = isSpecial ? characters[language].special : characters[language].numbers

    return (
        <section className={styles.characterKeys}>

            {/* Number / Special row */}
            <div className={styles.row}>
                <Key 
                label={isSpecial ? "123" : "!@#"} 
                onClick={() => setIsSpecial(!isSpecial)}
                />

                {numberRow.map((char, index) => (
                    <Key
                    key={index}
                    label={char}
                    onClick={() => insertAtCursor(char)}
                    />
                ))}
            </div>

            {/* Letter rows */}
            {letterRows.map((row, rowIndex) => (
                <div className={styles.row} key={rowIndex}>
                    {row.map((char, charIndex) => (
                        <Key
                        key={charIndex}
                        label={char}
                        onClick={() => insertAtCursor(char)}
                        />
                    ))}
                </div>
            ))}

            {/* Space bar row */}
            <div className={styles.row}>
                {language !== "Hebrew" && language !== "Emoji" && (
                    <Key
                    label="Caps"
                    onClick={() => setIsCaps(!isCaps)}
                    isSelected={isCaps}
                    />
                )}
            <Key
            label="Space"
            onClick={() => insertAtCursor(' ')}
            className={styles.spaceBar}
            />

            <Key
            label={<MdKeyboardReturn />}
            onClick={() => insertAtCursor("\n")}
            />
            </div>

            {/* Control keys row */}
            <div className={styles.row}>
                
                
            </div>

        </section>
      );
}

export default CharacterKeys;