export function initPieces(pieces, container) {
    const maxX = container.clientWidth - 80;
    const maxY = container.clientHeight - 80;

    pieces.forEach(piece => {
        const offsetX = Math.floor(Math.random() * maxX);
        const offsetY = Math.floor(Math.random() * maxY);

        piece.style.left = `${offsetX}px`;
        piece.style.top = `${offsetY}px`;
        piece.dataset.originalX = offsetX;
        piece.dataset.originalY = offsetY;
        piece.style.position = 'absolute';
    });
}
