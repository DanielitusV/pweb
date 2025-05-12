const pieces = document.querySelectorAll('.piece');
const cells = document.querySelectorAll('.cell');
const container = document.querySelector('.pieces');
const maxX = container.clientWidth - 80;
const maxY = container.clientHeight - 80;

/* Asignar posiciones aleatorias dentro de la canasta*/
pieces.forEach(piece => {
    const offsetX = Math.floor(Math.random() * maxX);
    const offsetY = Math.floor(Math.random() * maxY);

    piece.style.left = `${offsetX}px`;
    piece.style.top = `${offsetY}px`;
    
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
            piece.style.position = 'static';
            piece.style.left = '';
            piece.style.top = '';
            cell.appendChild(piece);
            piece.classList.add('in-board');
        }
    });
});
