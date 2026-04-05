import styles from './CSS/ActionKeys.module.css'
import Key from './Key'
import { FaUndo } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";


function ActionKeys({text, setText, history, setHistory, cursorPos, setCursorPos}) {
    return (
        <section className={styles.actionKeys}>

            <Key
            label={<FaDeleteLeft />}
            onClick={() => {
                if (cursorPos === 0) return;
                setHistory([...history, text]);
                setText([...text.slice(0, cursorPos - 1), ...text.slice(cursorPos)]);
                setCursorPos(cursorPos - 1);
                }} />

            <Key
            label="Delete Word"
            onClick={() => {
                const str = text.map(c => c.char).join('');
                const trimmed = str.trimEnd();
                const lastSpace = trimmed.lastIndexOf(' ');
                const newLength = lastSpace === -1 ? 0 : lastSpace + 1;
                setHistory([...history, text]);
                setText(text.slice(0, newLength));
                setCursorPos(newLength);
                }} />

            <Key
            label={<MdDelete />}
            onClick={() => {
                setHistory([...history, text]);
                setText([]);
                setCursorPos(0);
                }} />

            <Key
            label={<FaUndo />}
            onClick={() => {
                if (history.length === 0) return;
                const prev = history[history.length - 1];
                setText(prev);
                setCursorPos(cursorPos > prev.length ? prev.length : cursorPos);
                setHistory(history.slice(0, -1));
                }} />
                
        </section>
     );
}

export default ActionKeys;
