export function initPieces(pieces, container) {
    pieces.forEach((piece, i) => {
        piece.dataset.flipped = "false";
        piece.setAttribute("data-piece", (i + 1).toString());
        setPieceRandomPosition(piece, container);
    });  
}

function setPieceRandomPosition (piece, container) {
    const maxX = container.clientWidth - piece.offsetWidth;
    const maxY = container.clientHeight - piece.offsetHeight;

    const offsetX = Math.floor(Math.random() * maxX);
    const offsetY = Math.floor(Math.random() * maxY);

    piece.style.left = `${offsetX}px`;
    piece.style.top = `${offsetY}px`;
    piece.dataset.originalX = offsetX;
    piece.dataset.originalY = offsetY;
    piece.style.position = 'absolute';
}