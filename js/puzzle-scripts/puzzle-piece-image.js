export function setPieceImage(pieces, slices, mode, backImage) {
    pieces.forEach((piece, i) => {
        piece.dataset.front = slices[i].toDataURL();
        piece.dataset.back = backImage;

        if (mode === 'intermediate') {
            if (i % 2 === 1) {
                piece.style.backgroundImage = `url(${backImage})`;
                piece.dataset.flipped = "true";
            } else {
                piece.style.backgroundImage = `url(${slices[i].toDataURL()})`;
                piece.dataset.flipped = "false";
            }
            piece.onclick = function(e) {
                if (piece.dataset.flipped === "true") {
                    piece.style.backgroundImage = `url(${piece.dataset.front})`;
                    piece.dataset.flipped = "false";
                } else {
                    piece.style.backgroundImage = `url(${piece.dataset.back})`;
                    piece.dataset.flipped = "true";
                }
            };
            
        } else {
            piece.style.backgroundImage = `url(${slices[i].toDataURL()})`;
            piece.dataset.flipped = "false";
            piece.onclick = null;
        }
        piece.style.backgroundSize = "cover";
        piece.textContent = "";
    });
}
