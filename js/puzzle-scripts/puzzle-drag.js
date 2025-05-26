import { isPuzzleCorrect } from "./puzzle-check.js";

export function enableDrag(pieces, cells, container) {
    pieces.forEach(piece => {
        piece.addEventListener('mousedown', e => {
    e.preventDefault();

    const originCell = piece.classList.contains('in-board') ? piece.parentElement : null;
    const pieceRect = piece.getBoundingClientRect();

    // Usa coordenadas absolutas considerando el scroll
    const shiftX = e.pageX - (pieceRect.left + window.scrollX);
    const shiftY = e.pageY - (pieceRect.top + window.scrollY);

    const currentX = pieceRect.left + window.scrollX;
    const currentY = pieceRect.top + window.scrollY;

    document.body.appendChild(piece);
    piece.style.position = 'absolute';
    piece.style.left = `${currentX}px`;
    piece.style.top = `${currentY}px`;
    piece.classList.remove('in-board');
    piece.style.zIndex = '999';
    piece.classList.add('dragging');

    const moveAt = (pageX, pageY) => {
        piece.style.left = `${pageX - shiftX}px`;
        piece.style.top = `${pageY - shiftY}px`;
    };

    const onMouseMove = e => moveAt(e.pageX, e.pageY);
    document.addEventListener('mousemove', onMouseMove);

    const onMouseUp = e => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        let dropped = false;
        cells.forEach(async cell => {
            const rect = cell.getBoundingClientRect();
            const rectLeft = rect.left + window.scrollX;
            const rectRight = rect.right + window.scrollX;
            const rectTop = rect.top + window.scrollY;
            const rectBottom = rect.bottom + window.scrollY;

            const mouseX = e.pageX;
            const mouseY = e.pageY;

            if (
                mouseX >= rectLeft && mouseX <= rectRight &&
                mouseY >= rectTop  && mouseY <= rectBottom
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
                        old.style.top  = old.dataset.originalY + 'px';
                    }
                    cell.appendChild(piece);
                }
                piece.style.position = 'static';
                piece.style.left = piece.style.top = '';
                piece.style.zIndex = '';
                piece.classList.add('in-board');
                dropped = true;

                const correct = await isPuzzleCorrect(cells);
            }
        });

        if (!dropped) {
            const basketRect = container.getBoundingClientRect();
            const basketLeft = basketRect.left + window.scrollX;
            const basketRight = basketRect.right + window.scrollX;
            const basketTop = basketRect.top + window.scrollY;
            const basketBottom = basketRect.bottom + window.scrollY;

            const mouseX = e.pageX;
            const mouseY = e.pageY;

            if (
                mouseX >= basketLeft && mouseX <= basketRight &&
                mouseY >= basketTop  && mouseY <= basketBottom
            ) {
                let x = mouseX - shiftX - basketLeft;
                let y = mouseY - shiftY - basketTop;

                x = Math.max(0, Math.min(x, basketRect.width - piece.offsetWidth));
                y = Math.max(0, Math.min(y, basketRect.height - piece.offsetHeight));

                container.appendChild(piece);
                piece.style.position = 'absolute';
                piece.style.left = `${x}px`;
                piece.style.top  = `${y}px`;
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


        piece.addEventListener('dragstart', e => e.preventDefault());
    });
}
