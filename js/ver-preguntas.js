const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://constantly-top-goshawk.ngrok-free.app";

document.addEventListener("DOMContentLoaded", async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const divNombre = document.getElementById('nombreProfesor');
    if (usuario && usuario.nombre) {
        divNombre.textContent = `👤 ${usuario.nombre}`;
    } else {
        divNombre.textContent = '👤 Invitado';
    }

    const id = localStorage.getItem("pregunta_ver");
    if (!id) {
        alert("No se ha seleccionado ninguna pregunta para ver.");
        window.location.href = "professor.html";
        return;
    }

    try {
        const res = await fetch(`${apiBaseUrl}/preguntas/ver/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const p = await res.json();

        if (p.imagen && !p.imagen.startsWith('data:')) {
            fetch(p.imagen)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        renderPuzzle(event.target.result);
                    };
                    reader.readAsDataURL(blob);
                });
        } else if (p.imagen && p.imagen.startsWith('data:')) {
            renderPuzzle(p.imagen);
        } else {
            renderPuzzle(null);
        }

        document.getElementById("tituloPregunta").textContent = p.nombre;
        document.getElementById("descripcionPregunta").innerHTML = p.descripcion;
        document.getElementById("dificultadPregunta").textContent = "Dificultad: " + p.dificultad.charAt(0).toUpperCase() + p.dificultad.slice(1);

        const letras = ['A', 'B', 'C', 'D'];
        const opcionesContainer = document.getElementById("opcionesContainer");
        opcionesContainer.innerHTML = '';
        (Array.isArray(p.opciones) ? p.opciones : []).forEach((op, idx) => {
            const btn = document.createElement("div");
            btn.className = "question-option";
            btn.innerHTML = `<span style="color:#3759b4;">${letras[idx]}:</span> - ${op}`;
            btn.onclick = () => {
                document.querySelectorAll(".question-option").forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                document.getElementById("respuestaMsg").innerHTML =
                    `¡La respuesta correcta es <b>${p.respuesta_correcta}</b>!<br>`;
                document.getElementById("respuestaMsg").style.display = "block";
            };
            opcionesContainer.appendChild(btn);
        });
    } catch (error) {
        alert("Error al cargar la pregunta. Intenta de nuevo.");
        window.location.href = "professor.html";
    }
});

function renderPuzzle(imgSrc) {
    const container = document.getElementById('puzzle-container');
    container.innerHTML = '';
    if (!imgSrc) return;

    const img = new window.Image();
    img.onload = () => {
        const size = 48;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(
                    img,
                    x * img.width / 3, y * img.height / 3, img.width / 3, img.height / 3,
                    0, 0, size, size
                );
                const piece = document.createElement('img');
                piece.className = 'puzzle-piece-img';
                piece.src = canvas.toDataURL();
                container.appendChild(piece);
            }
        }
    };
    img.src = imgSrc;
}