class SketchyButton {
  constructor(containerId, label = "⚠️  עקוף מסנן  ⚠️") {
    this.container = document.getElementById(containerId);
    if (!(this.container instanceof HTMLDivElement)) {
      throw new Error("Failed to acquire sketchy button container element");
    }

    this.label = label;
    this.running = true;

    this._initCanvas();
    this._initState();
    this._attachEvents();
    this._resizeCanvas();
    window.addEventListener("resize", () => this._resizeCanvas());

    this._draw();
  }

  // -------------------- Initialization --------------------
  _initCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "sketchy-button";
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) {
      throw new Error("Failed to acquire 2D context");
    }
  }

  _initState() {
    this.hover = false;
    this.active = false;
    this.frame = 0;
    this.progress = 0; // Progress bar value
    this.maxProgress = 1.2; // 120%
  }

  _attachEvents() {
    this.canvas.addEventListener("mouseenter", () => (this.hover = true));
    this.canvas.addEventListener("mouseleave", () => {
      this.hover = false;
      this.active = false;
    });
    this.canvas.addEventListener("mousedown", () => (this.active = true));
    this.canvas.addEventListener("mouseup", () => (this.active = false));
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
      this.ctx.moveTo(
        this._jitter(x, jitterAmount),
        this._jitter(y, jitterAmount),
      );
      this.ctx.lineTo(
        this._jitter(x + w, jitterAmount),
        this._jitter(y, jitterAmount),
      );
      this.ctx.lineTo(
        this._jitter(x + w, jitterAmount),
        this._jitter(y + h, jitterAmount),
      );
      this.ctx.lineTo(
        this._jitter(x, jitterAmount),
        this._jitter(y + h, jitterAmount),
      );
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }

  _drawWithRGBSplit(drawFn, intensity = 1) {
    const offsets = [
      {
        x: this._rand(-intensity, intensity),
        y: this._rand(-intensity, intensity),
        c: "red",
      },
      {
        x: this._rand(-intensity, intensity),
        y: this._rand(-intensity, intensity),
        c: "green",
      },
      {
        x: this._rand(-intensity, intensity),
        y: this._rand(-intensity, intensity),
        c: "blue",
      },
    ];
    offsets.forEach((o) => {
      this.ctx.save();
      this.ctx.translate(o.x, o.y);
      this.ctx.globalCompositeOperation = "screen";
      this.ctx.fillStyle = o.c;
      this.ctx.strokeStyle = o.c;
      drawFn();
      this.ctx.restore();
    });
    this.ctx.globalCompositeOperation = "source-over";
  }

  _drawGlitchText() {
    const ctx = this.ctx;
    const label = this.label;
    const baseY = this.canvas.height / 2;
    let cursorX = this.canvas.width / 2 + ctx.measureText(label).width / 2;
    for (const ch of label) {
      ctx.fillText(
        ch,
        cursorX + this._rand(-1.5, 1.5),
        baseY + this._rand(-1.5, 1.5),
      );
      cursorX -= ctx.measureText(ch).width;
    }
  }

  // -------------------- Rendering --------------------
  _draw() {
    this.frame++;
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Handle progressive glitching
    if (this.active) {
      this.progress += 0.003; // Increase progress each frame while held
      if (this.progress >= this.maxProgress) {
        this.progress = this.maxProgress;
        this.running = false;
        // 1.4 seconds later, redirect
        setTimeout(() => {
          //   add an anchor to the page and click it
          const a = document.createElement("a");
          a.href = "/"; // Target URL
          document.body.appendChild(a);
          a.click();
        }, 1400);
      }
    } else if (this.progress > 0) {
      this.progress -= 0.02; // Slide back when released
      if (this.progress < 0) this.progress = 0;
    }

    const pad = 8;
    const baseJitter = this.hover ? 2.5 + this.progress : 1.5;
    const glitchJitter = this.active
      ? 6 + this.progress * 5
      : this.hover
        ? 3
        : 1.5;
    const w = canvas.width - pad * 2;
    const h = canvas.height - pad * 2;
    const breathe = Math.sin(this.frame * 0.05) * 1.5;

    ctx.save();
    ctx.translate(
      this._rand(-glitchJitter, glitchJitter),
      this._rand(-glitchJitter, glitchJitter),
    );

    // Fill
    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(pad + breathe, pad, w - breathe * 2, h);

    // Paper noise
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 200; i++) {
      ctx.fillRect(this._rand(pad, pad + w), this._rand(pad, pad + h), 1, 1);
    }
    ctx.globalAlpha = 1;

    // Draw progress bar overlay
    if (this.progress > 0) {
      ctx.fillStyle = "rgba(255,0,0)";
      ctx.fillRect(
        pad,
        pad,
        w * Math.min(this.progress, 1),
        canvas.height - pad * 2,
      );
    }

    // RGB border
    const rgbIntensity = this.active
      ? 6 + this.progress * 5
      : this.hover
        ? 3
        : 1.5;
    this._drawWithRGBSplit(() => {
      ctx.lineWidth = 2;
      this._sketchyRect(pad + breathe, pad, w - breathe * 2, h, baseJitter);
    }, rgbIntensity);

    // Glitchy text
    ctx.font = "20px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const offsets = [
      {
        x: this._rand(-1.5, 1.5) * (1 + this.progress),
        y: this._rand(-1.5, 1.5) * (1 + this.progress),
        c: "red",
      },
      {
        x: this._rand(-1.5, 1.5) * (1 + this.progress),
        y: this._rand(-1.5, 1.5) * (1 + this.progress),
        c: "green",
      },
      {
        x: this._rand(-1.5, 1.5) * (1 + this.progress),
        y: this._rand(-1.5, 1.5) * (1 + this.progress),
        c: "blue",
      },
    ];
    offsets.forEach((o) => {
      ctx.save();
      ctx.translate(o.x, o.y);
      ctx.fillStyle = o.c;
      ctx.strokeStyle = o.c;
      ctx.globalCompositeOperation = "source-over";
      this._drawGlitchText();
      ctx.restore();
    });

    // Glitch scan lines
    if (Math.random() < (this.hover ? 1 : 0.3)) {
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

document.addEventListener("DOMContentLoaded", () => {
  new SketchyButton("sketchy-button-container");
});
