
import styles from './CSS/Key.module.css'

function Key({label, onClick, isSelected = false, className="", style={}}) {
    return (
        <button
        className={`${styles.key} ${isSelected ? styles.selected : ''} ${className}`}
        style={style}
        onClick={onClick}
        >
        {label}
        </button>
     );
}

export default Key;