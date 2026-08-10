class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.characters = '01';
        this.colors = ['rgba(0, 255, 0, 0.4)']

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(char, x, y);

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    start() {
        setInterval(() => this.draw(), 50);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se a tela é maior que 768px
    if (window.innerWidth > 768) {
        const canvas = document.getElementById('matrix-canvas');
        const matrix = new MatrixRain(canvas);
        matrix.start();
    }
});

