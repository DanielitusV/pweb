export function setPieceImage(pieces, slices) {
    pieces.forEach((piece, i) => {
        piece.style.backgroundImage = `url(${slices[i].toDataURL()})`;
        piece.style.backgroundSize = "cover";
        piece.style.backgroundPosition = "center";
        piece.textContent = "";
    });
}
