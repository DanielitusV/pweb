import { initPieces } from './puzzle-scripts/puzzle-init.js';
import { enableDrag } from './puzzle-scripts/puzzle-drag.js';
import { resetPuzzle } from './puzzle-scripts/puzzle-reset.js';
import { setupImageUpload } from './puzzle-scripts/puzzle-image.js';
import { setPieceImage } from './puzzle-scripts/puzzle-piece-image.js';

const container = document.querySelector('.basket');
const BACK_IMAGE = "../assets/icons/back-card.png";
let slices = [];

function generarGrid(size) {
    const grid = document.querySelector(".grid");
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 1; i <= size * size; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.pos = i;
        grid.appendChild(cell);
    }
}

function generarPiezas(size) {
    const basket = document.querySelector(".basket");
    basket.innerHTML = "";

    for (let i = 1; i <= size * size; i++) {
        const piece = document.createElement("div");
        piece.className = "piece";
        piece.draggable = true;
        piece.dataset.piece = i;
        piece.textContent = i;
        basket.appendChild(piece);
    }
}

function reinicializarPiezas() {
    const nuevasPiezas = document.querySelectorAll('.piece');
    const celdas = document.querySelectorAll('.cell');
    initPieces(nuevasPiezas, container);
    enableDrag(nuevasPiezas, celdas, container);
}

const puzzleSizeSelector = document.getElementById("puzzleSize");
const headerTitle = document.getElementById("headerTitle");

function modoDificultad() {
    let mode = 'easy';
    const dificultadSelect = document.getElementById('puzzlePreviewModes');
    const puzzleRadios = document.querySelector('input[name="puzzleMode"]:checked');
    if (!puzzleRadios) {
        mode = dificultadSelect.value === 'Novato' ? 'easy'
            : dificultadSelect.value === 'Intermedio' ? 'intermediate'
            : 'advanced';
    } else {
        mode = puzzleRadios.value;
    }
    return mode;
}

puzzleSizeSelector.addEventListener("change", (e) => {
    const size = parseInt(e.target.value);
    headerTitle.textContent = `Rompecabezas ${size}x${size}`;
    generarGrid(size);
    generarPiezas(size);
    reinicializarPiezas();
});

document.getElementById("reset").addEventListener('click', () => {
    const piezas = document.querySelectorAll('.piece');
    resetPuzzle(piezas, container);
});

setupImageUpload('uploadInput', 'imagePreview', 'uploadMessage', (cutSlices) => {
    slices = cutSlices;
    document.getElementById("confirmarPuzzleBtn").onclick = function() {
        const piezas = document.querySelectorAll('.piece');
        const mode = modoDificultad();
        setPieceImage(piezas, slices, mode, BACK_IMAGE);
    }
});

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loader").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
    }, 400);

    const size = parseInt(puzzleSizeSelector.value);
    generarGrid(size);
    generarPiezas(size);
    reinicializarPiezas();
});
