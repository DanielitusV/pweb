import { isPuzzleCorrect } from './puzzle-check.js';

export function setPieceImage(pieces, slices, mode, backImage) {
    let flippedIndexes = [];
    if (mode === 'intermediate') {
        const total = pieces.length;
        const nFlipped = Math.floor(total / 2);
        const indexes = [...Array(total).keys()];

        for (let i = indexes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
        }
        flippedIndexes = indexes.slice(0, nFlipped);
    }
    
    pieces.forEach((piece, i) => {
        piece.dataset.front = slices[i].toDataURL();
        piece.dataset.back = backImage;

        if (mode === 'intermediate') {
            if (flippedIndexes.includes(i)) {
                piece.style.backgroundImage = `url(${backImage})`;
                piece.dataset.flipped = "true";
            } else {
                piece.style.backgroundImage = `url(${slices[i].toDataURL()})`;
                piece.dataset.flipped = "false";
            }
            piece.onclick = async function(e) {
                if (piece.dataset.flipped === "true") {
                    piece.style.backgroundImage = `url(${piece.dataset.front})`;
                    piece.dataset.flipped = "false";
                } else {
                    piece.style.backgroundImage = `url(${piece.dataset.back})`;
                    piece.dataset.flipped = "true";
                }

                if (piece.classList.contains('in-board')) {
                    const cells = document.querySelectorAll('.cell');
                    isPuzzleCorrect(cells);
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
