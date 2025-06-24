const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://constantly-top-goshawk.ngrok-free.app";
const BACK_IMAGE = "../assets/icons/back-card.png";
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
        document.getElementById("descripcionPregunta").innerHTML = p.descripcion || '';
        document.getElementById("dificultadPregunta").textContent = "Dificultad: " + capitalize(p.dificultad);
         
        // Opciones de respuesta
        renderOptions(p.opciones, p.respuesta_correcta);

        // Aquí está el cambio para llamar renderPuzzleAndBasket con dificultad
        const dificultad = (p.dificultad || 'novato').toLowerCase();

        if (document.getElementById('basket-container')) {
            cargarImagenParaPuzzle(p.imagen, id, base64 => renderPuzzleAndBasket(base64, dificultad));
        } else {
            cargarImagenParaPuzzle(p.imagen, id, base64 => renderPuzzleSolo(base64));
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
    
    // Normalizar la respuesta correcta (eliminar "OPCIÓN " si existe)
    const respuestaNormalizada = (respuestaCorrecta || '').toString()
        .replace('OPCIÓN ', '')
        .replace('Opción ', '')
        .trim()
        .toUpperCase();
    
    (Array.isArray(opciones) ? opciones : []).forEach((op, idx) => {
        const btn = document.createElement("div");
        btn.className = "question-option";
        btn.innerHTML = `<span style="color:#3759b4;">${letras[idx]}:</span> - ${op}`;
        btn.onclick = () => {
            document.querySelectorAll(".question-option").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            
            const respuestaMsg = document.getElementById("respuestaMsg");
            const letraSeleccionada = letras[idx];
            
            // Comparación directa con la letra (A, B, C, D)
            if (letraSeleccionada === respuestaNormalizada) {
                respuestaMsg.innerHTML = `✅ <b>¡Correcto!</b> La respuesta correcta es ${letraSeleccionada}`;
                respuestaMsg.style.color = "green";
                launchConfetti();
            } else {
                respuestaMsg.innerHTML = `❌ <b>Incorrecto.</b> La respuesta correcta es ${respuestaNormalizada}`;
                respuestaMsg.style.color = "red";
            }
            
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

// --- Renderizar puzzle + cesta de piezas (basket) con dificultad ---
function renderPuzzleAndBasket(imgSrc, dificultad = 'novato') {
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

        // Cortar piezas
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
                    src: canvas.toDataURL(),
                    correctPos: y * cols + x + 1
                });
            }
        }

        // Configurar puzzle
        puzzleContainer.style.display = "grid";
        puzzleContainer.style.gridTemplateColumns = `repeat(${cols}, ${pieceSize}px)`;
        puzzleContainer.style.gridTemplateRows = `repeat(${rows}, ${pieceSize}px)`;
        puzzleContainer.style.gap = "5px";
        puzzleContainer.style.border = "2px solid #ccc";
        puzzleContainer.style.padding = "5px";

        // Crear celdas del puzzle
        for (let i = 0; i < rows * cols; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.pos = i + 1;
            cell.dataset.correctPiece = i + 1;
            cell.style.width = `${pieceSize}px`;
            cell.style.height = `${pieceSize}px`;
            cell.style.border = "1px dashed #aaa";
            cell.style.display = "flex";
            cell.style.justifyContent = "center";
            cell.style.alignItems = "center";
            cell.style.backgroundColor = "#fafafa";

            // Drag and drop sobre el puzzle
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
                const draggedPiece = document.querySelector(`img[data-id='${pieceId}']`);
                if (!draggedPiece) return;

                // Si la celda ya tiene pieza, devolverla a la cesta
                if (cell.children.length > 0) {
                    const existingPiece = cell.firstChild;
                    basketContainer.appendChild(existingPiece);

                    // La pieza que regresa a la cesta vuelve a posición absoluta con coords originales
                    existingPiece.style.position = "absolute";
                    existingPiece.style.left = existingPiece.dataset.originalX + "px";
                    existingPiece.style.top = existingPiece.dataset.originalY + "px";
                    existingPiece.style.transform = `rotate(${existingPiece.dataset.rotation || 0}deg)`;
                    existingPiece.style.cursor = "grab";
                }

                // Colocar pieza en celda, posición estática para que quede fija
                cell.appendChild(draggedPiece);
                draggedPiece.style.position = "static";
                draggedPiece.style.left = "";
                draggedPiece.style.top = "";
                draggedPiece.style.cursor = "default";

                checkPuzzleCompletion();
            });

            puzzleContainer.appendChild(cell);
        }

        // Configurar cesta
        basketContainer.style.position = "relative";  // para posicionar absolutamente las piezas dentro
        basketContainer.style.height = `${rows * (pieceSize + 10)}px`; // altura suficiente para las piezas
        basketContainer.style.display = "block";
        basketContainer.style.border = "2px solid #ccc";
        basketContainer.style.borderRadius = "8px";
        basketContainer.style.maxWidth = `${cols * (pieceSize + 10)}px`;
        basketContainer.style.padding = "10px";

        // Permitir soltar piezas de vuelta en la cesta
        basketContainer.addEventListener('dragover', e => {
            e.preventDefault();
            basketContainer.style.backgroundColor = '#e6f7ff';
        });
        basketContainer.addEventListener('dragleave', e => {
            e.preventDefault();
            basketContainer.style.backgroundColor = '';
        });
        basketContainer.addEventListener('drop', e => {
            e.preventDefault();
            basketContainer.style.backgroundColor = '';

            const pieceId = e.dataTransfer.getData('text/plain');
            const draggedPiece = document.querySelector(`img[data-id='${pieceId}']`);

            if (draggedPiece) {
                if (draggedPiece.parentElement) {
                    draggedPiece.parentElement.removeChild(draggedPiece);
                }

                basketContainer.appendChild(draggedPiece);

                // Posición absoluta con coords originales
                draggedPiece.style.position = "absolute";
                draggedPiece.style.left = draggedPiece.dataset.originalX + "px";
                draggedPiece.style.top = draggedPiece.dataset.originalY + "px";
                draggedPiece.style.cursor = "grab";

                checkPuzzleCompletion();
            }
        });

        // Aplicar dificultad y agregar piezas desordenadas en basketContainer
        applyDifficulty(pieces, dificultad, basketContainer, pieceSize);
    };

    img.onerror = () => {
        puzzleContainer.textContent = "Error cargando la imagen.";
    };

    img.src = imgSrc;
}

// --- Aplicar configuración según dificultad ---
function applyDifficulty(pieces, dificultad, basketContainer, pieceSize) {
    const backImage = BACK_IMAGE;
    shuffleArray(pieces);

    // Para intermedio elegir 4 piezas para voltear boca abajo
    let flippedIndexes = [];
    if (dificultad.toLowerCase() === 'intermedio') {
        while (flippedIndexes.length < 4 && flippedIndexes.length < pieces.length) {
            const randIndex = Math.floor(Math.random() * pieces.length);
            if (!flippedIndexes.includes(randIndex)) {
                flippedIndexes.push(randIndex);
            }
        }
    }

    pieces.forEach((piece, index) => {
        const imgEl = document.createElement('img');
        imgEl.src = piece.src;
        imgEl.dataset.id = piece.id;
        imgEl.dataset.correctPos = piece.correctPos;
        imgEl.dataset.original = piece.src;
        imgEl.className = "puzzle-piece-img";
        imgEl.style.width = `${pieceSize}px`;
        imgEl.style.height = `${pieceSize}px`;
        imgEl.style.cursor = "grab";
        imgEl.draggable = true;

        // Posicionar aleatoriamente dentro del basketContainer
        imgEl.style.position = "absolute";
        const maxX = basketContainer.clientWidth - pieceSize;
        const maxY = basketContainer.clientHeight - pieceSize;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        imgEl.style.left = `${randomX}px`;
        imgEl.style.top = `${randomY}px`;

        // Guardar posición original para devolver pieza a su lugar
        imgEl.dataset.originalX = randomX;
        imgEl.dataset.originalY = randomY;

        if (dificultad.toLowerCase() !== 'novato') {
            switch (dificultad.toLowerCase()) {
                case 'intermedio':
                    if (flippedIndexes.includes(index)) {
                        imgEl.src = backImage;
                        imgEl.dataset.flipped = 'true';

                        imgEl.addEventListener('click', () => {
                            if (imgEl.dataset.flipped === 'true') {
                                imgEl.src = imgEl.dataset.original;
                                imgEl.dataset.flipped = 'false';
                            } else {
                                imgEl.src = backImage;
                                imgEl.dataset.flipped = 'true';
                            }
                            checkPuzzleCompletion();
                        });
                    } else {
                        imgEl.dataset.flipped = 'false';
                    }
                    break;

                case 'avanzado':
                    const rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
                    imgEl.style.transform = `rotate(${rotation}deg)`;
                    imgEl.dataset.rotation = rotation.toString();

                    imgEl.addEventListener('click', () => {
                        const currentRotation = parseInt(imgEl.dataset.rotation) || 0;
                        const newRotation = (currentRotation + 90) % 360;
                        imgEl.style.transform = `rotate(${newRotation}deg)`;
                        imgEl.dataset.rotation = newRotation.toString();
                        checkPuzzleCompletion();
                    });
                    break;
            }
        }

        imgEl.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', piece.id);
        });

        basketContainer.appendChild(imgEl);
    });
}

// --- Verificar si el puzzle está completo ---
function checkPuzzleCompletion() {
    const cells = document.querySelectorAll('.cell');
    let isComplete = true;

    cells.forEach(cell => {
        const correctPieceId = cell.dataset.correctPiece;
        const piece = cell.firstElementChild;
        
        if (!piece || piece.dataset.id !== correctPieceId) {
            isComplete = false;
            return;
        }

        if (piece.dataset.rotation && parseInt(piece.dataset.rotation) !== 0) {
            isComplete = false;
            return;
        }

        if (piece.dataset.flipped === 'true') {
            isComplete = false;
            return;
        }
    });

    if (isComplete) {
        showCelebration();
        launchConfetti(); // Lanzar confeti por completar el puzzle
    }
}

// --- Mostrar mensaje de felicitaciones ---
function showCelebration() {
    const celebrationMsg = document.createElement('div');
    celebrationMsg.style.position = 'fixed';
    celebrationMsg.style.top = '0';
    celebrationMsg.style.left = '0';
    celebrationMsg.style.width = '100%';
    celebrationMsg.style.height = '100%';
    celebrationMsg.style.backgroundColor = 'rgba(0,0,0,0.7)';
    celebrationMsg.style.display = 'flex';
    celebrationMsg.style.justifyContent = 'center';
    celebrationMsg.style.alignItems = 'center';
    celebrationMsg.style.zIndex = '1000';
    celebrationMsg.style.color = 'white';
    celebrationMsg.style.fontSize = '2rem';
    celebrationMsg.style.flexDirection = 'column';
    
    celebrationMsg.innerHTML = `
        <h2>¡Felicidades!</h2>
        <p>Has completado el puzzle correctamente.</p>
        <button id="closeCelebration" style="padding: 10px 20px; margin-top: 20px; font-size: 1rem;">
            Cerrar
        </button>
    `;
    
    document.body.appendChild(celebrationMsg);
    
    document.getElementById('closeCelebration').addEventListener('click', () => {
        document.body.removeChild(celebrationMsg);
    });
}

// --- Función para lanzar confeti ---
function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const confetti = [];

    // Crear partículas de confeti
    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 4 + 1,
            d: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngle: Math.random() * 0.1,
            tiltAngleIncrement: Math.random() * 0.07
        });
    }

    let animationFrame;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < confetti.length; i++) {
            const p = confetti[i];
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt, p.y);
            ctx.lineTo(p.x + p.tilt + p.r * 2, p.y);
            ctx.stroke();

            p.tiltAngle += p.tiltAngleIncrement;
            p.y += p.d;
            p.tilt = Math.sin(p.tiltAngle) * 15;

            if (p.y > canvas.height) {
                confetti[i] = {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height - canvas.height,
                    r: p.r,
                    d: p.d,
                    color: p.color,
                    tilt: p.tilt,
                    tiltAngle: p.tiltAngle,
                    tiltAngleIncrement: p.tiltAngleIncrement
                };
            }
        }

        animationFrame = requestAnimationFrame(animate);
    }

    animate();

    // Detener después de 3 segundos
    setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        document.body.removeChild(canvas);
    }, 3000);
}

// Fisher-Yates para mezclar arrays
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}