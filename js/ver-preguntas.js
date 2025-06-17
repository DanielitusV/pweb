const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://constantly-top-goshawk.ngrok-free.app";

document.addEventListener("DOMContentLoaded", async () => {
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

        // Cargar la imagen y renderizar el puzzle y basket
        if (p.imagen && !p.imagen.startsWith('data:')) {
            const respImg = await fetch(p.imagen);
            const blob = await respImg.blob();
            const base64 = await blobToBase64(blob);
            localStorage.setItem(`img_${id}`, base64);
            renderPuzzleAndBasket(base64);
        } else if (p.imagen && p.imagen.startsWith('data:')) {
            localStorage.setItem(`img_${id}`, p.imagen);
            renderPuzzleAndBasket(p.imagen);
        } else {
            renderPuzzleAndBasket(null);
        }

        // Mostrar título, descripción y dificultad
        document.getElementById("tituloPregunta").textContent = p.nombre;
        document.getElementById("descripcionPregunta").textContent = p.descripcion;
        document.getElementById("dificultadPregunta").textContent = "Dificultad: " + capitalize(p.dificultad);

        // Opciones de respuesta
        renderOptions(p.opciones, p.respuesta_correcta);

    } catch (error) {
        alert("Hubo un error al cargar la pregunta: " + error.message);
        window.location.href = "professor.html";
    }
});

// Función para pasar blob a base64
function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderOptions(opciones, respuestaCorrecta) {
    const letras = ['A', 'B', 'C', 'D'];
    const opcionesContainer = document.getElementById("opcionesContainer");
    opcionesContainer.innerHTML = '';
    opciones.forEach((op, idx) => {
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

// Función que crea y divide la imagen en piezas, además crea el basket para arrastrar
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
    img.crossOrigin = "anonymous"; // para evitar problemas CORS
    img.onload = () => {
        const rows = 3;
        const cols = 3;
        const pieceSize = 96; // tamaño de cada pieza en px (puedes ajustar)
        const pieces = [];

        // Crear piezas cortando la imagen con canvas
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const canvas = document.createElement('canvas');
                canvas.width = pieceSize;
                canvas.height = pieceSize;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(
                    img,
                    x * img.width / cols,
                    y * img.height / rows,
                    img.width / cols,
                    img.height / rows,
                    0,
                    0,
                    pieceSize,
                    pieceSize
                );

                const dataUrl = canvas.toDataURL();
                pieces.push({
                    id: y * cols + x + 1,
                    src: dataUrl
                });
            }
        }

        // Mezclar las piezas para que no estén ordenadas (opcional)
        shuffleArray(pieces);

        // Renderizar puzzle (celdas vacías)
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

            // Permitir soltar piezas
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

                // Si la celda ya tiene una pieza, no permitir
                if (cell.children.length > 0) return;

                // Mover la pieza a la celda
                cell.appendChild(draggedPiece);
                draggedPiece.draggable = false; // ya no se puede mover dentro del puzzle

                // Opcional: quitar la pieza del basket visualmente
                // (ya está en el puzzle, así que no la mostramos en basket)
            });

            puzzleContainer.appendChild(cell);
        }

        // Renderizar basket con piezas mezcladas
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

// Función para mezclar un array (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////


/*const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://constantly-top-goshawk.ngrok-free.app";

document.addEventListener("DOMContentLoaded", async() => {
    const id = localStorage.getItem("pregunta_ver");
    if (!id) {
        alert("No se ha seleccionado ninguna pregunta para ver.");
        window.location.href = "professor.html";
        return;
    }

    const res = await fetch(`${apiBaseUrl}/preguntas/ver/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const p = await res.json();

    if (p.imagen && !p.imagen.startsWith('data:')) {
        // Si es URL, la descargas y la conviertes a base64
        fetch(p.imagen)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onload = function (event) {
                    localStorage.setItem(`img_${id}`, event.target.result);
                    renderPuzzle(event.target.result);
                };
                reader.readAsDataURL(blob);
            });
    } else if (p.imagen && p.imagen.startsWith('data:')) {
        // Si ya es base64, la guardas y la usas
        localStorage.setItem(`img_${id}`, p.imagen);
        renderPuzzle(p.imagen);
    } else {
        // No hay imagen
        renderPuzzle(null);
    }

    document.getElementById("tituloPregunta").textContent = p.nombre;
    document.getElementById("descripcionPregunta").textContent = p.descripcion;
    document.getElementById("dificultadPregunta").textContent = "Dificultad: " + p.dificultad.charAt(0).toUpperCase() + p.dificultad.slice(1);

    const letras = ['A', 'B', 'C', 'D'];
    const opcionesContainer = document.getElementById("opcionesContainer");
    opcionesContainer.innerHTML = '';

    p.opciones.forEach((op, idx) => {
        const btn = document.createElement("div");
        btn.className = "question-option";
        btn.innerHTML = `<span style="color:#3759b4;">${letras[idx]}:</span> - ${op}`;

        btn.onclick = () => {
            document.querySelectorAll(".question-option").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");

            document.getElementById("respuestaMsg").innerHTML= `
                ¡La respuesta correcta es <b>${p.respuesta_correcta}</b>!<br>
            `;
            document.getElementById("respuestaMsg").style.display = "block";
        };
        opcionesContainer.appendChild(btn);
    });
});

function renderPuzzle(imgSrc) {
    const container = document.getElementById('puzzle-container');
    container.innerHTML = '';
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
}*/