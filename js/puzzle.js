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

    piece.addEventListener('mousedown', e => {
        e.preventDefault();

        const shiftX = e.clientX - piece.getBoundingClientRect().left;
        const shiftY = e.clientY - piece.getBoundingClientRect().top;

        piece.style.zIndex = '999';
        piece.style.position = 'absolute';
        piece.classList.add('dragging');

        const moveAt = (pageX, pageY) => {
            piece.style.left = `${pageX - shiftX - container.getBoundingClientRect().left}px`;
            piece.style.top = `${pageY - shiftY - container.getBoundingClientRect().top}px`;
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

            // Si no cayó en ninguna celda válida → vuelve a su lugar
            if (!dropped) {
                piece.style.left = `${piece.dataset.originalX}px`;
                piece.style.top = `${piece.dataset.originalY}px`;
            }

            piece.classList.remove('dragging');
        };

        document.addEventListener('mouseup', onMouseUp);
    });

    // Quitar el drag fantasma
    piece.addEventListener('dragstart', e => e.preventDefault());
});
