import { initPieces } from './puzzle-scripts/puzzle-init.js';
import { enableDrag } from './puzzle-scripts/puzzle-drag.js';
import { resetPuzzle } from './puzzle-scripts/puzzle-reset.js';

const pieces = document.querySelectorAll('.piece');
const cells = document.querySelectorAll('.cell');
const container = document.querySelector('.basket');

initPieces(pieces, container);
enableDrag(pieces, cells, container);

document.getElementById("reset").addEventListener('click', () => {
    resetPuzzle(pieces, container);
});
