import { generarGrid } from './puzzle-scripts/puzzle-grid.js';
import { generarPiezas } from './puzzle-scripts/puzzle-pieces.js';
import { reinicializarPiezas } from './puzzle-scripts/puzzle-utils.js';
import { modoDificultad } from './puzzle-scripts/puzzle-difficulty.js';
import { resetPuzzle } from './puzzle-scripts/puzzle-reset.js';
import { setupImageUpload } from './puzzle-scripts/puzzle-image.js';
import { setPieceImage } from './puzzle-scripts/puzzle-piece-image.js';

const container = document.querySelector('.basket');
const BACK_IMAGE = "../assets/icons/back-card.png";
let slices = [];

const puzzleSizeSelector = document.getElementById("puzzleSize");
const headerTitle = document.getElementById("headerTitle");

if (puzzleSizeSelector) {
    puzzleSizeSelector.addEventListener("change", (e) => {
        const size = parseInt(e.target.value);
        headerTitle.textContent = `Rompecabezas ${size}x${size}`;
        generarGrid(size);
        generarPiezas(size);
        reinicializarPiezas();
    });
}

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

    let size = 3;
    if (puzzleSizeSelector && puzzleSizeSelector.value) {
        size = parseInt(puzzleSizeSelector.value);
    }
    generarGrid(size);
    generarPiezas(size);
    reinicializarPiezas();
});
