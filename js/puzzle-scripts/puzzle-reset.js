export function resetPuzzle(pieces, container) {
    pieces.forEach(piece => {
        if (piece.classList.contains('in-board')) {
            container.appendChild(piece);
            piece.classList.remove('in-board');
            piece.style.position = 'absolute';
        }

        const offsetX = Math.floor(Math.random() * (container.clientWidth - 80));
        const offsetY = Math.floor(Math.random() * (container.clientHeight - 80));

        piece.style.left = `${offsetX}px`;
        piece.style.top = `${offsetY}px`;
        piece.dataset.originalX = offsetX;
        piece.dataset.originalY = offsetY;
        piece.style.zIndex = '';
    });
}