import Key from './Key'
import styles from './CSS/StyleControls.module.css'

const FONTS = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Impact',
    'Comic Sans MS',
    'Trebuchet MS',
]

function FontKeys({ currentStyle, setCurrentStyle }) {
    return (
        <section className={styles.styleControls}>
            <label className={styles.label}>Font</label>
            {FONTS.map(font => (
                <Key
                    key={font}
                    label={font}
                    style={{ fontFamily: font, fontSize: '12px' }}
                    isSelected={currentStyle.fontFamily === font}
                    onClick={() => setCurrentStyle({ ...currentStyle, fontFamily: font })}
                />
            ))}
        </section>
    );
}

export default FontKeys;
