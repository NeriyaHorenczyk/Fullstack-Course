import Key from './Key'
import styles from './CSS/StyleControls.module.css'

const FONT_SIZES = ['12px', '14px', '16px', '18px', '24px', '32px', '48px', '64px']

const COLOR_KEYS = [
    { color: '#000000', title: 'Black' },
    { color: '#ffffff', title: 'White' },
    { color: '#ef4444', title: 'Red' },
    { color: '#22c55e', title: 'Green' },
    { color: '#3b82f6', title: 'Blue' },
    { color: '#f97316', title: 'Orange' },
    { color: '#a855f7', title: 'Purple' },
    { color: '#ec4899', title: 'Pink' },
]

function StyleControls({ currentStyle, setCurrentStyle }) {
    return (
        <section className={styles.styleControls}>
            <label className={styles.label}>Size</label>
            <select
                className={styles.select}
                value={currentStyle.fontSize}
                onChange={e => setCurrentStyle({ ...currentStyle, fontSize: e.target.value })}
            >
                {FONT_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                ))}
            </select>

            <label className={styles.label}>Color</label>
            {COLOR_KEYS.map(c => (
                <Key
                    key={c.color}
                    label="⬤"
                    style={{ color: c.color, border: currentStyle.color === c.color ? '2px solid #333' : undefined }}
                    isSelected={currentStyle.color === c.color}
                    onClick={() => setCurrentStyle({ ...currentStyle, color: c.color })}
                />
            ))}
            <input
                type="color"
                className={styles.colorPicker}
                value={currentStyle.color}
                onChange={e => setCurrentStyle({ ...currentStyle, color: e.target.value })}
            />
        </section>
    );
}

export default StyleControls;
