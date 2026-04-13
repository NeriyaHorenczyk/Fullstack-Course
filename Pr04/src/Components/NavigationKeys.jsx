import Key from './Key'
import styles from './CSS/ActionKeys.module.css'
import { MdArrowLeft, MdArrowRight, MdArrowDropUp, MdArrowDropDown } from 'react-icons/md'

function NavigationKeys({ text, cursorPos, setCursorPos }) {

    const chars = text.map(c => c.char).join('');

    const moveLeft = () => {
        setCursorPos(Math.max(0, cursorPos - 1));
    };

    const moveRight = () => {
        setCursorPos(Math.min(text.length, cursorPos + 1));
    };

    const moveUp = () => {
        const before = chars.slice(0, cursorPos);
        const currentLineStart = before.lastIndexOf('\n') + 1;
        const col = cursorPos - currentLineStart;
        const prevLineEnd = currentLineStart - 1;
        if (prevLineEnd < 0) return;
        const prevLineStart = chars.lastIndexOf('\n', prevLineEnd - 1) + 1;
        setCursorPos(Math.min(prevLineStart + col, prevLineEnd));
    };

    const moveDown = () => {
        const before = chars.slice(0, cursorPos);
        const currentLineStart = before.lastIndexOf('\n') + 1;
        const col = cursorPos - currentLineStart;
        const nextLineStart = chars.indexOf('\n', cursorPos) + 1;
        if (nextLineStart === 0) return;
        const nextLineEnd = chars.indexOf('\n', nextLineStart);
        const nextLineEndPos = nextLineEnd === -1 ? text.length : nextLineEnd;
        setCursorPos(Math.min(nextLineStart + col, nextLineEndPos));
    };

    return (
        <section className={styles.actionKeys}>
            <Key label={<MdArrowLeft />}     onClick={moveLeft} />
            <Key label={<MdArrowDropUp />}   onClick={moveUp} />
            <Key label={<MdArrowDropDown />} onClick={moveDown} />
            <Key label={<MdArrowRight />}    onClick={moveRight} />
        </section>
    );
}

export default NavigationKeys;
