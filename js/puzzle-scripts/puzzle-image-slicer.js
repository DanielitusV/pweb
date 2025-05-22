export function sliceImage(img, gridSize = 3) {
    const pieces = [];
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const pieceW = Math.floor(w / gridSize);
    const pieceH = Math.floor(h / gridSize);
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const canvas = document.createElement('canvas');
            canvas.width = pieceW;
            canvas.height = pieceH;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(
                img,
                col * pieceW, row * pieceH, pieceW, pieceH,
                0, 0, pieceW, pieceH
            );
            pieces.push(canvas);
        }
    }
    return pieces;
}