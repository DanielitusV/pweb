import { isPuzzleCorrect } from './puzzle-check.js';

export function setPieceImage(pieces, slices, mode, backImage) {
    let flippedIndexes = [];

    if (mode === 'intermediate' || mode === 'advanced') {
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
        piece.style.backgroundSize = "cover";
        piece.textContent = "";

        if (mode === 'intermediate') {
            piece.style.setProperty('--rot', '0deg');
            if (flippedIndexes.includes(i)) {
                piece.style.backgroundImage = `url(${backImage})`;
                piece.dataset.flipped = "true";
            } else {
                piece.style.backgroundImage = `url(${slices[i].toDataURL()})`;
                piece.dataset.flipped = "false";
            }

            piece.onclick = () => {
                piece.classList.add('flipping');
                setTimeout(() => {
                    if (piece.dataset.flipped === "true") {
                        piece.style.backgroundImage = `url(${piece.dataset.front})`;
                        piece.dataset.flipped = "false";
                    } else {
                        piece.style.backgroundImage = `url(${piece.dataset.back})`;
                        piece.dataset.flipped = "true";
                    }
                    piece.classList.remove('flipping');
                }, 250);

                if (piece.classList.contains('in-board')) {
                    const cells = document.querySelectorAll('.cell');
                    isPuzzleCorrect(cells);
                }
            };

        } else if (mode === 'advanced') {
            // Rotación aleatoria al inicio
            const rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
            piece.dataset.rotation = rotation;
            piece.style.transform = `rotate(${rotation}deg)`;
            piece.dataset.flipped = "false"; // No se voltea, solo rota
            piece.style.backgroundImage = `url(${slices[i].toDataURL()})`;

            piece.onclick = (e) => {
                e.preventDefault();

                // ROTAR 90° SIEMPRE, esté o no en el grid
                let current = parseInt(piece.dataset.rotation || '0');
                current = (current + 90) % 360;
                piece.dataset.rotation = current;
                piece.style.transform = `rotate(${current}deg)`;

                // Solo chequea si está en el grid
                if (piece.classList.contains('in-board')) {
                    const cells = document.querySelectorAll('.cell');
                    isPuzzleCorrect(cells);
                }
            };

        } else {
            // Modo fácil
            piece.style.backgroundImage = `url(${slices[i].toDataURL()})`;
            piece.dataset.flipped = "false";
            piece.onclick = null;
            piece.style.transform = `rotate(0deg)`;
        }

        piece.oncontextmenu = (e) => e.preventDefault();
    });
}



/*function habilitarRotacion(piece) {
    piece.oncontextmenu = (e) => {
        e.preventDefault();
        piece.classList.add('rotating');

        let current = parseInt(piece.dataset.rotation || '0');

        if (e.shiftKey) {
            current = current - 90;
        } else {
            current = current + 90;
        }

        piece.dataset.rotation = current;
        piece.style.transform = `rotate(${current}deg)`;

        setTimeout(() => {
            piece.classList.remove('rotating');
        }, 250);

        if (piece.classList.contains('in-board')) {
            const cells = document.querySelectorAll('.cell');
            isPuzzleCorrect(cells);
        }

        return false;
    };
}*/
