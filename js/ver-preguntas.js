const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://constantly-top-goshawk.ngrok-free.app";

document.addEventListener("DOMContentLoaded", async () => {
    // Mostrar nombre de usuario si existe el elemento
    const divNombre = document.getElementById('nombreProfesor');
    if (divNombre) {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario && usuario.nombre) {
            divNombre.textContent = `👤 ${usuario.nombre}`;
        } else {
            divNombre.textContent = '👤 Invitado';
        }
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
        if (!res.ok) throw new Error('Error al obtener la pregunta');
        const p = await res.json();

        // Mostrar título, descripción y dificultad
        document.getElementById("tituloPregunta").textContent = p.nombre;
        // Soporta innerHTML para listas/formatos
        document.getElementById("descripcionPregunta").innerHTML = p.descripcion || '';
        document.getElementById("dificultadPregunta").textContent = "Dificultad: " + capitalize(p.dificultad);

        // Opciones de respuesta
        renderOptions(p.opciones, p.respuesta_correcta);

        // Puzzle: elige el modo según tu HTML (con o sin basket)
        if (document.getElementById('basket-container')) {
            cargarImagenParaPuzzle(p.imagen, id, renderPuzzleAndBasket);
        } else {
            cargarImagenParaPuzzle(p.imagen, id, renderPuzzleSolo);
        }

    } catch (error) {
        alert("Hubo un error al cargar la pregunta: " + error.message);
        window.location.href = "professor.html";
    }
});

// --- Utilidades ---
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

// --- Render opciones de respuesta ---
function renderOptions(opciones, respuestaCorrecta) {
    const letras = ['A', 'B', 'C', 'D'];
    const opcionesContainer = document.getElementById("opcionesContainer");
    opcionesContainer.innerHTML = '';
    (Array.isArray(opciones) ? opciones : []).forEach((op, idx) => {
        const btn = document.createElement("div");
        btn.className = "question-option";
        btn.innerHTML = `<span style="color:#3759b4;">${letras[idx]}:</span> - ${op}`;
        btn.onclick = () => {
            document.querySelectorAll(".question-option").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            const respuestaMsg = document.getElementById("respuestaMsg");
            respuestaMsg.innerHTML = `¡La respuesta correcta es <b>${respuestaCorrecta}</b>!<br>`;
            respuestaMsg.style.display = "block";
        };
        opcionesContainer.appendChild(btn);
    });
}

// --- Puzzle: imagen a base64 y renderiza (con fallback) ---
function cargarImagenParaPuzzle(imgPath, id, renderCallback) {
    if (imgPath && !imgPath.startsWith('data:')) {
        fetch(imgPath)
            .then(response => response.blob())
            .then(blob => blobToBase64(blob))
            .then(base64 => {
                localStorage.setItem(`img_${id}`, base64);
                renderCallback(base64);
            })
            .catch(() => renderCallback(null));
    } else if (imgPath && imgPath.startsWith('data:')) {
        localStorage.setItem(`img_${id}`, imgPath);
        renderCallback(imgPath);
    } else {
        renderCallback(null);
    }
}

// --- Renderizar sólo puzzle estático (NO cesta) ---
function renderPuzzleSolo(imgSrc) {
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

// --- Renderizar puzzle + cesta de piezas (basket) ---
function renderPuzzleAndBasket(imgSrc) {
    const puzzleContainer = document.getElementById('puzzle-container');
    const basketContainer = document.getElementById('basket-container');
    puzzleContainer.innerHTML = '';
    basketContainer.innerHTML = '';

    if (!imgSrc) {
        puzzleContainer.textContent = "No hay imagen para mostrar el puzzle.";
        return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        const rows = 3, cols = 3, pieceSize = 95;
        const pieces = [];
        // Cortar en canvas las piezas
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const canvas = document.createElement('canvas');
                canvas.width = pieceSize;
                canvas.height = pieceSize;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(
                    img,
                    x * img.width / cols, y * img.height / rows,
                    img.width / cols, img.height / rows,
                    0, 0, pieceSize, pieceSize
                );
                pieces.push({
                    id: y * cols + x + 1,
                    src: canvas.toDataURL()
                });
            }
        }
        // Mezclar
        shuffleArray(pieces);

        // Renderizar celdas vacías en el puzzle
        puzzleContainer.style.display = "grid";
        puzzleContainer.style.gridTemplateColumns = `repeat(${cols}, ${pieceSize}px)`;
        puzzleContainer.style.gridTemplateRows = `repeat(${rows}, ${pieceSize}px)`;
        puzzleContainer.style.gap = "5px";
        puzzleContainer.style.border = "2px solid #ccc";
        puzzleContainer.style.padding = "5px";
        for (let i = 0; i < rows * cols; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.pos = i + 1;
            cell.style.width = `${pieceSize}px`;
            cell.style.height = `${pieceSize}px`;
            cell.style.border = "1px dashed #aaa";
            cell.style.display = "flex";
            cell.style.justifyContent = "center";
            cell.style.alignItems = "center";
            cell.style.backgroundColor = "#fafafa";

            // Arrastrar y soltar
            cell.addEventListener('dragover', e => {
                e.preventDefault();
                cell.style.backgroundColor = '#d0f0ff';
            });
            cell.addEventListener('dragleave', e => {
                e.preventDefault();
                cell.style.backgroundColor = '#fafafa';
            });
            cell.addEventListener('drop', e => {
                e.preventDefault();
                cell.style.backgroundColor = '#fafafa';

                const pieceId = e.dataTransfer.getData('text/plain');
                const draggedPiece = basketContainer.querySelector(`img[data-id='${pieceId}']`);
                if (!draggedPiece) return;
                if (cell.children.length > 0) return;
                cell.appendChild(draggedPiece);
                draggedPiece.draggable = false;
            });

            puzzleContainer.appendChild(cell);
        }

        // Renderizar piezas mezcladas en basket
        basketContainer.style.display = "flex";
        basketContainer.style.flexWrap = "wrap";
        basketContainer.style.gap = "10px";
        basketContainer.style.padding = "10px";
        basketContainer.style.border = "2px solid #ccc";
        basketContainer.style.borderRadius = "8px";
        basketContainer.style.maxWidth = `${cols * (pieceSize + 10)}px`;

        pieces.forEach(piece => {
            const imgEl = document.createElement('img');
            imgEl.src = piece.src;
            imgEl.dataset.id = piece.id;
            imgEl.className = "puzzle-piece-img";
            imgEl.style.width = `${pieceSize}px`;
            imgEl.style.height = `${pieceSize}px`;
            imgEl.style.cursor = "grab";
            imgEl.draggable = true;
            imgEl.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', piece.id);
            });
            basketContainer.appendChild(imgEl);
        });
    };
    img.onerror = () => {
        puzzleContainer.textContent = "Error cargando la imagen.";
    };
    img.src = imgSrc;
}

// Fisher-Yates para mezclar arrays
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
