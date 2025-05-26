export function showCelebration() {
    const msg = document.getElementById("celebrationMsg");
    msg.style.display = "flex";

    void msg.offsetWidth;
    msg.classList.add("active");
    launchConfetti();

    msg.onclick = (e) => {
        if (e.target === msg) hideCelebration();
    }

    document.getElementById("closeCelebration").onclick = hideCelebration;
}

function launchConfetti() {
    const colors = ["#567cc1", "#79c2ff", "#876dd3", "#a7e5ff", "#b8e1ff"];
    const canvas = document.getElementById("confettiCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const confetti = [];

    for (let i = 0; i < 120; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 8 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: 2 + Math.random() * 3,
            angle: Math.random() * 360
        });
    }

    let running = true;
    let frameId = null; 

    function draw() {
        if (!running) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const c of confetti) {
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.angle);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.r / 2, -c.r / 2, c.r, c.r);
            ctx.restore();
            c.y += c.speed;
            c.angle += 0.05;
            if (c.y > canvas.height) c.y = -c.r;
        }
        frameId = requestAnimationFrame(draw);
    }
    draw();

    setTimeout(() => {
        running = false;
        if (frameId) cancelAnimationFrame(frameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);
}

function hideCelebration() {
    const msg = document.getElementById("celebrationMsg");
    msg.classList.remove("active");
    setTimeout(() => {
        msg.style.display = "none";
    }, 400);
}