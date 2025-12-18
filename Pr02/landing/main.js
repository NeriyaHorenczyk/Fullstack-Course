class AudioPlayer {
    constructor(src) {
        this.audio = new Audio(src);
    }

    play() {
        this.audio.currentTime = 0;
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    onEnded(callback) {
        this.audio.addEventListener('ended', callback);
    }
}

class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.hover = false;
        this.active = false;
        this.cursorDistance = Infinity;
        this.mouseCoords = { x: 0, y: 0 };

        this.onMouseDown = null;
        this.onMouseUp = null;

        this._attachEvents();
    }

    _attachEvents() {
        this.canvas.addEventListener('mouseenter', () => (this.hover = true));
        this.canvas.addEventListener('mouseleave', () => {
            this.hover = false;
            this.active = false;
            if (this.onMouseUp) this.onMouseUp();
        });

        this.canvas.addEventListener('mousedown', () => {
            this.active = true;
            if (this.onMouseDown) this.onMouseDown();
        });

        this.canvas.addEventListener('mouseup', () => {
            this.active = false;
            if (this.onMouseUp) this.onMouseUp();
        });

        document.addEventListener('mousemove', (e) => this._updateCursorDistance(e));
    }

    _updateCursorDistance(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        // Compute distance from point to rectangle
        let dx = 0,
            dy = 0;
        if (x < rect.left) dx = rect.left - x;
        else if (x > rect.right) dx = x - rect.right;

        if (y < rect.top) dy = rect.top - y;
        else if (y > rect.bottom) dy = y - rect.bottom;

        this.cursorDistance = Math.hypot(dx, dy);

        // Clamp cursor coordinates inside canvas for reference
        this.mouseCoords.x = Math.min(Math.max(x - rect.left, 0), rect.width);
        this.mouseCoords.y = Math.min(Math.max(y - rect.top, 0), rect.height);
    }
}

class SketchyButton {
    constructor(containerId, label = '(:  לחץ אם אתה לא מפחד', audioRiser, audioDing) {
        this.container = document.getElementById(containerId);
        if (!(this.container instanceof HTMLDivElement)) {
            throw new Error('Invalid container element');
        }

        this.label = label;
        this.running = true;
        this.frame = 0;
        this.progress = 0;
        this.maxProgress = 1.2;

        this.audioRiser = audioRiser;
        this.audioDing = audioDing;

        this._initCanvas();
        this.input = new InputHandler(this.canvas);
        this.input.onMouseDown = () => this.audioRiser.play();
        this.input.onMouseUp = () => this.audioRiser.pause();

        window.addEventListener('resize', () => this._resizeCanvas());
        this._resizeCanvas();

        this._draw();
    }

    _initCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'sketchy-button';
        this.container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) throw new Error('Failed to acquire 2D context');
    }

    _resizeCanvas() {
        if (!this.canvas.parentElement) return;
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = 64;
    }

    // -------------------- Utilities --------------------
    _rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    _jitter(v, amount) {
        return v + this._rand(-amount, amount);
    }

    _sketchyRect(x, y, w, h, jitterAmount) {
        const passes = 2 + Math.floor(this._rand(0, 2));
        for (let p = 0; p < passes; p++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this._jitter(x, jitterAmount), this._jitter(y, jitterAmount));
            this.ctx.lineTo(this._jitter(x + w, jitterAmount), this._jitter(y, jitterAmount));
            this.ctx.lineTo(this._jitter(x + w, jitterAmount), this._jitter(y + h, jitterAmount));
            this.ctx.lineTo(this._jitter(x, jitterAmount), this._jitter(y + h, jitterAmount));
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    _drawWithRGBSplit(drawFn, intensity = 1) {
        const offsets = ['red', 'green', 'blue'].map((c) => ({
            x: this._rand(-intensity, intensity),
            y: this._rand(-intensity, intensity),
            c,
        }));

        offsets.forEach((o) => {
            this.ctx.save();
            this.ctx.translate(o.x, o.y);
            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.fillStyle = o.c;
            this.ctx.strokeStyle = o.c;
            drawFn();
            this.ctx.restore();
        });

        this.ctx.globalCompositeOperation = 'source-over';
    }

    _drawGlitchText() {
        const ctx = this.ctx;
        const label = this.label;
        const baseY = this.canvas.height / 2;
        let cursorX = this.canvas.width / 2 + ctx.measureText(label).width / 2;

        for (const ch of label) {
            ctx.fillText(ch, cursorX + this._rand(-1.5, 1.5), baseY + this._rand(-1.5, 1.5));
            cursorX -= ctx.measureText(ch).width;
        }
    }

    _computeRGBIntensity() {
        const input = this.input;
        const maxDistance = 300;

        const distanceFactor = Math.max(0, 1 - input.cursorDistance / maxDistance);
        const hoverFactor = input.hover ? 1.5 : 1.0;
        const progressFactor = input.active
            ? (Math.exp(5 * Math.min(this.progress / this.maxProgress, 1)) - 1) / (Math.exp(5) - 1)
            : 0;

        return (distanceFactor * hoverFactor + progressFactor) * 4;
    }

    // -------------------- Rendering --------------------
    _draw() {
        this.frame++;
        const ctx = this.ctx;
        const canvas = this.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // -------------------- Progress handling --------------------
        const input = this.input;
        if (input.active) {
            this.progress += 0.005;

            if (this.progress >= this.maxProgress) {
                this.progress = this.maxProgress;
                this.running = false;
                freezeGlitch();

                setTimeout(() => {
                    showOverlayMessage('לא אמור להיות כאן, אבל נו, נלך על זה');
                    this.audioDing.play();
                    this.audioDing.onEnded(() => {
                        const a = document.createElement('a');
                        a.href = '/home/';
                        document.body.appendChild(a);
                        a.click();
                    });
                }, 1400);
            }
        } else {
            if (this.progress > 0) {
                this.progress -= 0.02;
                if (this.progress < 0) this.progress = 0;
            }
        }

        const pad = 8;
        const baseJitter = input.hover ? 2.5 + this.progress : 1.5;
        const glitchJitter = input.active ? 6 + this.progress * 5 : input.hover ? 3 : 1.5;
        const w = canvas.width - pad * 2;
        const h = canvas.height - pad * 2;
        const breathe = Math.sin(this.frame * 0.05) * 1.5;

        ctx.save();
        ctx.translate(this._rand(-glitchJitter, glitchJitter), this._rand(-glitchJitter, glitchJitter));

        // -------------------- Background --------------------
        ctx.fillStyle = '#f2f2f2';
        ctx.fillRect(pad + breathe, pad, w - breathe * 2, h);

        // Paper noise
        ctx.globalAlpha = 0.08;
        for (let i = 0; i < 200; i++) {
            ctx.fillRect(this._rand(pad, pad + w), this._rand(pad, pad + h), 1, 1);
        }
        ctx.globalAlpha = 1;

        // Progress bar
        if (this.progress > 0) {
            ctx.fillStyle = 'rgba(255,0,0)';
            ctx.fillRect(pad, pad, w * Math.min(this.progress, 1), canvas.height - pad * 2);
        }

        const rgbIntensity = this._computeRGBIntensity();
        const actualProgress = Math.min(this.progress / this.maxProgress, 1);
        const expGrowthConst = 5;
        const expIntensity = ((Math.exp(expGrowthConst * actualProgress) - 1) / (Math.exp(expGrowthConst) - 1)) * 4;
        document.documentElement.style.setProperty('--glitch-intensity', expIntensity);

        // -------------------- RGB border --------------------
        this._drawWithRGBSplit(() => {
            ctx.lineWidth = 2;
            this._sketchyRect(pad + breathe, pad, w - breathe * 2, h, baseJitter);
        }, rgbIntensity);

        // -------------------- Glitchy text --------------------
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ['red', 'green', 'blue'].forEach((c) => {
            ctx.save();
            ctx.translate(this._rand(-1.5, 1.5) * (1 + this.progress), this._rand(-1.5, 1.5) * (1 + this.progress));
            ctx.fillStyle = c;
            ctx.strokeStyle = c;
            ctx.globalCompositeOperation = 'source-over';
            this._drawGlitchText();
            ctx.restore();
        });

        // -------------------- Glitch scanlines --------------------
        if (Math.random() < (input.hover ? 1 : 0.3)) {
            const sliceY = this._rand(0, canvas.height);
            const sliceH = this._rand(6, 12);
            const offset = this._rand(-10, 10);
            const img = ctx.getImageData(0, sliceY, canvas.width, sliceH);
            ctx.putImageData(img, offset, sliceY);
        }

        ctx.restore();
        if (this.running) requestAnimationFrame(() => this._draw());
    }
}

// -------------------- Utilities --------------------
function freezeGlitch() {
    const computed = getComputedStyle(document.documentElement).getPropertyValue('--glitch-intensity');
    document.documentElement.style.setProperty('--glitch-intensity', computed);
    document.querySelectorAll('body *').forEach((el) => {
        el.style.textShadow = getComputedStyle(el).textShadow;
    });
    document.body.classList.add('glitch-frozen');
}

function showOverlayMessage(message) {
    const overlayDiv = document.createElement('div');
    overlayDiv.id = 'overlay-message';
    Object.assign(overlayDiv.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '9999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'lime',
        fontFamily: 'monospace',
        fontSize: '48px',
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    });
    overlayDiv.textContent = message;
    document.body.appendChild(overlayDiv);
}

// -------------------- Initialization --------------------
document.addEventListener('DOMContentLoaded', () => {
    const riser = new AudioPlayer('landing/assets/glitch_riser.wav');
    const ding = new AudioPlayer('landing/assets/microwave-ding.mp3');
    new SketchyButton('sketchy-button-container', '(:  לחץ אם אתה לא מפחד', riser, ding);
});
