import styles from './CSS/ActionKeys.module.css'
import Key from './Key'
import { FaUndo } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

function ActionKeys({text, setText, history, setHistory, cursorPos, setCursorPos}) {
    return (
        <section className={styles.actionKeys}>

            <Key
            label={<FaDeleteLeft />}
            onClick={() => {
                if (cursorPos === 0) return;
                setHistory([...history, text]);
                setText(text.slice(0, cursorPos - 1) + text.slice(cursorPos));
                setCursorPos(cursorPos - 1);
                }} />

            <Key
            label="Delete Word"
            onClick={() => {
                setHistory([...history, text]);
                const newText = text.trim().split(" ").slice(0, -1).join(" ") + " ";
                setText(newText);
                setCursorPos(newText.length);
                }} />

            <Key
            label={<MdDelete />}
            onClick={() => {
                setHistory([...history, text]);
                setText("");
                setCursorPos(0);
                }} />

            <Key
            label={<FaUndo />}
            onClick={() => {
                if (history.length === 0) return;
                const prev = history[history.length - 1];
                setText(prev);
                setCursorPos(prev.length);
                setHistory(history.slice(0, -1));
                }} />
                
        </section>
     );
}

export default ActionKeys;