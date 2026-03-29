import styles from './CSS/Display.module.css'

function Display({ text }) {
    return ( 
        <div className={styles.display}>
            {text}
        </div>
     );
}

export default Display;