
import styles from './CSS/Key.module.css'

function Key({label, onClick, isSelected = false, className=""}) {
    return ( 
        <button
        className={`${styles.key} ${isSelected ? styles.selected : ''} ${className}`}
        onClick={onClick}
        >
        {label}
        </button>
     );
}

export default Key;