const pieces = document.querySelectorAll('.piece');
const cells = document.querySelectorAll('.cell');

/* Evento de arrastrar inicio */
pieces.forEach(piece => {
    piece.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', piece.dataset.piece);
    });
});

/* Evento de solcar en cada celda */
cells.forEach(cell => {
    cell.addEventListener('dragover', e => {
        e.preventDefault();
    });

    cell.addEventListener('drop', e => {
        e.preventDefault();
        const pieceNumber = e.dataTransfer.getData('text/plain');
        const piece = document.querySelector(`.piece[data-piece='${pieceNumber}']`);

        if (!cell.hasChildNodes()) {
            cell.appendChild(piece);
        }
    });
});
