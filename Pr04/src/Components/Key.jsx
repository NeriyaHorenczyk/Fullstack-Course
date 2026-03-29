
import styles from './CSS/Key.module.css'

function Key({label, onClick, isSelected = false}) {
    return ( 
        <button
        className={`${styles.key} ${isSelected ? styles.selected : ''}`}
        onClick={onClick}
        >
        {label}
        </button>
     );
}

export default Key;