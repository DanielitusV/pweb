const pieces = document.querySelectorAll('.piece');
const cells = document.querySelectorAll('.cell');
const container = document.querySelector('.basket');
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

        const originCell = piece.classList.contains('in-board') ? piece.parentElement : null;

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
                piece.style.left = (pageX - shiftX) + 'px';
                piece.style.top  = (pageY - shiftY) + 'px';
            } else {
                piece.style.left = (pageX - shiftX - container.getBoundingClientRect().left) + 'px';
                piece.style.top = (pageY - shiftY - container.getBoundingClientRect().top) + 'px';
            }
        };

        const onMouseMove = e => moveAt(e.pageX, e.pageY);
        document.addEventListener('mousemove', onMouseMove);

        const onMouseUp = e => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            let dropped = false;
            cells.forEach(cell => {
                const rect = cell.getBoundingClientRect();
                if (
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom
                ) {
                    if (!cell.firstElementChild) {
                        cell.appendChild(piece);
                    } else {

                        const old = cell.firstElementChild;
                        if (originCell) {
                            originCell.appendChild(old);
                            old.classList.add('in-board');
                        } else {
                            container.appendChild(old);
                            old.classList.remove('in-board');
                            old.style.position = 'absolute';
                            old.style.left = old.dataset.originalX + 'px';
                            old.style.top = old.dataset.originalY + 'px';
                        }
                        cell.appendChild(piece);
                    }
                    piece.style.position = 'static';
                    piece.style.left = piece.style.top = '';
                    piece.style.zIndex = '';
                    piece.classList.add('in-board');

                    dropped = true;
                }
            });

            if (!dropped) {
                const basketRect = container.getBoundingClientRect();
                if (
                    e.clientX >= basketRect.left &&
                    e.clientX <= basketRect.right &&
                    e.clientY >= basketRect.top &&
                    e.clientY <= basketRect.bottom
                ) {
                    let x = e.pageX - shiftX - basketRect.left;
                    let y = e.pageY - shiftY - basketRect.top;

                    x = Math.max(0, Math.min(x, basketRect.width - piece.offsetWidth));
                    y = Math.max(0, Math.min(y, basketRect.height - piece.offsetHeight));

                    container.appendChild(piece);
                    piece.style.position = 'absolute';
                    piece.style.left = `${x}px`;
                    piece.style.top = `${y}px`;
                    piece.dataset.originalX = x;
                    piece.dataset.originalY = y;
                    dropped = true;
                }
            }

            if (!dropped) {
                piece.style.left = piece.dataset.originalX + 'px';
                piece.style.top  = piece.dataset.originalY + 'px';
                piece.classList.remove('in-board');
                container.appendChild(piece);
            }

            piece.classList.remove('dragging');
        };

        document.addEventListener('mouseup', onMouseUp);
    });

    /* Evitar drag fantasma */
    piece.addEventListener('dragstart', e => e.preventDefault());
});