const pieces = document.querySelectorAll('.piece');
const cells = document.querySelectorAll('.cell');
const container = document.querySelector('.pieces');
const maxX = container.clientWidth - 80;
const maxY = container.clientHeight - 80;

/* Asignar posiciones aleatorias dentro de la canasta */
pieces.forEach(piece => {
    const offsetX = Math.floor(Math.random() * maxX);
    const offsetY = Math.floor(Math.random() * maxY);

    piece.style.left = `${offsetX}px`;
    piece.style.top = `${offsetY}px`;
    piece.dataset.originalX = offsetX;
    piece.dataset.originalY = offsetY;
    piece.style.position = 'absolute';

    piece.addEventListener('mousedown', e => {
        e.preventDefault();

        const isInBoard = piece.classList.contains('in-board');
        const pieceRect = piece.getBoundingClientRect();
        const shiftX = e.clientX - pieceRect.left;
        const shiftY = e.clientY - pieceRect.top;

        if (isInBoard) {
            const currentX = pieceRect.left + window.scrollX;
            const currentY = pieceRect.top + window.scrollY;

            document.body.appendChild(piece); // Sacar del .cell al body
            piece.style.left = `${currentX}px`;
            piece.style.top = `${currentY}px`;
            piece.style.position = 'absolute';
            piece.classList.remove('in-board');
        }

        piece.style.zIndex = '999';
        piece.classList.add('dragging');

        const moveAt = (pageX, pageY) => {
            if (isInBoard) {
                piece.style.left = `${pageX - shiftX}px`;
                piece.style.top = `${pageY - shiftY}px`;
            } else {
                piece.style.left = `${pageX - shiftX - container.getBoundingClientRect().left}px`;
                piece.style.top = `${pageY - shiftY - container.getBoundingClientRect().top}px`;
            }
        };

        const onMouseMove = e => moveAt(e.pageX, e.pageY);
        document.addEventListener('mousemove', onMouseMove);

        const onMouseUp = e => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // Verificamos si soltaste sobre una celda válida
            let dropped = false;
            cells.forEach(cell => {
                const rect = cell.getBoundingClientRect();
                if (
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom
                ) {
                    if (!cell.hasChildNodes()) {
                        piece.style.position = 'static';
                        piece.style.left = '';
                        piece.style.top = '';
                        piece.style.zIndex = '';
                        cell.appendChild(piece);
                        piece.classList.add('in-board');
                        dropped = true;
                    }
                }
            });

            // Si no cayó en ninguna celda → vuelve a la canasta
            if (!dropped) {
                piece.style.left = `${piece.dataset.originalX}px`;
                piece.style.top = `${piece.dataset.originalY}px`;
            }

            piece.classList.remove('dragging');
        };

        document.addEventListener('mouseup', onMouseUp);
    });

    // Evitar drag fantasma
    piece.addEventListener('dragstart', e => e.preventDefault());
});
