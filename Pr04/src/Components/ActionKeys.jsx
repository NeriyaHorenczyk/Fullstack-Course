import styles from './CSS/ActionKeys.module.css'
import Key from './Key'
import { FaUndo } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

function ActionKeys({text, setText, history, setHistory}) {
    return ( 
        <section className={styles.actionKeys}>
            
            <Key 
            label={<FaDeleteLeft />} 
            onClick={() =>{ 
                setHistory([...history, text]);
                setText(text.slice(0, -1))
                }} />
            
            <Key 
            label="Delete Word" 
            onClick={() => { 
                setHistory([...history, text]);
                setText(text.trim().split(" ").slice(0, -1).join(" ") + " "); 
                }} />
            
            <Key 
            label={<MdDelete />} 
            onClick={() => { 
                setHistory([...history, text]); 
                setText(""); 
                }} />

            <Key 
            label={<FaUndo />} 
            onClick={()=>{
                if (history.length === 0) return;
                setText(history[history.length - 1]);
                setHistory(history.slice(0, -1));
                }} />
                
        </section>
     );
}

export default ActionKeys;