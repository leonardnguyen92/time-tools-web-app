class Fireworks {
    constructor(canvasId = "canvas", duration = 0) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.particles = [];
        this.animationId = null;
        this.duration = duration; // giây, 0 nghĩa là phụ thuộc vào nhạc chúc mừng
        this.fireworkSound = null;
        this.music = null;
        this._clickStopHandler = null;

        this._setupCanvas();
    }

    _setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.display = "none";
        window.addEventListener("resize", () => this._resizeCanvas());
    }

    _resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    _playFireworkSound() {
        this.fireworkSound = document.getElementById("fireworkSound");
        if (this.fireworkSound) {
            this.fireworkSound.loop = true;
            this.fireworkSound.currentTime = 0;
            this.fireworkSound.play().catch(() => { });
        }
    }

    _playMusic(musicUrl) {
        if (!musicUrl) return;

        this.music = new Audio(musicUrl);
        this.music.play().catch(() => { });

        if (this.duration === 0) {
            this.music.addEventListener("ended", () => this.stop());
        } else {
            setTimeout(() => this.stop(), this.duration * 1000);
        }
    }

    _showMessage(msg) {
        if (!msg) return;

        const messageEl = document.createElement("div");
        messageEl.textContent = msg;
        messageEl.id = "fireworksMessage";
        Object.assign(messageEl.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "3rem",
            fontWeight: "bold",
            zIndex: "10000",
            background: "linear-gradient(90deg, red, orange, yellow, green, cyan, blue, violet)",
            backgroundSize: "400%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "rainbowText 4s linear infinite",
            textAlign: "center",
            pointerEvents: "none",
            whiteSpace: "pre-wrap"
        });
        document.body.appendChild(messageEl);

        // Inject keyframes nếu chưa có
        if (!document.getElementById("rainbowTextStyle")) {
            const style = document.createElement("style");
            style.id = "rainbowTextStyle";
            style.textContent = `
        @keyframes rainbowText {
            0% { background-position: 0% }
            100% { background-position: 400% }
        }`;
            document.head.appendChild(style);
        }
    }

    _removeMessage() {
        const msgEl = document.getElementById("fireworksMessage");
        if (msgEl) msgEl.remove();
    }

    _createParticle(x, y) {
        const colors = ["#ff4242", "#ffd700", "#00e5ff", "#00ff7f", "#ff69b4"];
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 5 + 2;

        return {
            x, y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            life: 100,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }

    _explode(x, y) {
        for (let i = 0; i < 50; i++) {
            this.particles.push(this._createParticle(x, y));
        }
    }

    _render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();

            p.x += p.dx;
            p.y += p.dy;
            p.dy += 0.05;
            p.life--;

            if (p.life <= 0) this.particles.splice(i, 1);
        });

        if (Math.random() < 0.1) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height / 2;
            this._explode(x, y);
        }

        this.animationId = requestAnimationFrame(() => this._render());
    }

    start(message = "", musicUrl = "", duration = 0) {
        this.duration = duration; // cho phép truyền lại duration mới
        this.canvas.style.display = "block";
        this._resizeCanvas();
        this._showMessage(message);
        this._playFireworkSound();
        this._playMusic(musicUrl);
        this._render();

        this._clickStopHandler = () => this.stop();
        window.addEventListener("click", this._clickStopHandler, { once: true });
    }

    stop() {
        cancelAnimationFrame(this.animationId);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.style.display = "none";
        this._removeMessage();

        if (this.fireworkSound) {
            this.fireworkSound.pause();
            this.fireworkSound.currentTime = 0;
        }

        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }

        if (this._clickStopHandler) {
            window.removeEventListener("click", this._clickStopHandler);
            this._clickStopHandler = null;
        }

        this.particles = [];
    }
}
export default Fireworks;