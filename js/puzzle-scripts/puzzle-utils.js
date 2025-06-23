import { initPieces } from './puzzle-init.js';
import { enableDrag } from './puzzle-drag.js';

export function reinicializarPiezas() {
    const nuevasPiezas = document.querySelectorAll('.piece');
    const celdas = document.querySelectorAll('.cell');
    const container = document.querySelector('.basket');
    initPieces(nuevasPiezas, container);
    enableDrag(nuevasPiezas, celdas, container);
}
