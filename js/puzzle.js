import { initPieces } from './puzzle-scripts/puzzle-init.js';
import { enableDrag } from './puzzle-scripts/puzzle-drag.js';
import { resetPuzzle } from './puzzle-scripts/puzzle-reset.js';
import { setupImageUpload } from './puzzle-scripts/puzzle-image.js';
import { setPieceImage } from './puzzle-scripts/puzzle-piece-image.js';

const pieces = document.querySelectorAll('.piece');
const cells = document.querySelectorAll('.cell');
const container = document.querySelector('.basket');
let slices = [];

initPieces(pieces, container);
enableDrag(pieces, cells, container);

document.getElementById("reset").addEventListener('click', () => {
    resetPuzzle(pieces, container);
});

setupImageUpload('uploadInput', 'imagePreview', 'uploadMessage', (cutSlices) => {
    slices = cutSlices;
    document.getElementById("confirmarPuzzleBtn").onclick = function() {
        setPieceImage(pieces, slices);
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