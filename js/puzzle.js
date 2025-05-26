import { initPieces } from './puzzle-scripts/puzzle-init.js';
import { enableDrag } from './puzzle-scripts/puzzle-drag.js';
import { resetPuzzle } from './puzzle-scripts/puzzle-reset.js';
import { setupImageUpload } from './puzzle-scripts/puzzle-image.js';
import { setPieceImage } from './puzzle-scripts/puzzle-piece-image.js';

const pieces = document.querySelectorAll('.piece');
const cells = document.querySelectorAll('.cell');
const container = document.querySelector('.basket');
const BACK_IMAGE = "../assets/icons/back-card.png";
let slices = [];

initPieces(pieces, container);
enableDrag(pieces, cells, container);

document.getElementById("reset").addEventListener('click', () => {
    resetPuzzle(pieces, container);
});

setupImageUpload('uploadInput', 'imagePreview', 'uploadMessage', (cutSlices) => {
    slices = cutSlices;
    document.getElementById("confirmarPuzzleBtn").onclick = function() {
        const mode = document.querySelector('input[name="puzzleMode"]:checked').value;
        setPieceImage(pieces, slices, mode, BACK_IMAGE);
    }
});

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("loader").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("loader").style.display = "none";
        }, 400); 
    }, 400);
});