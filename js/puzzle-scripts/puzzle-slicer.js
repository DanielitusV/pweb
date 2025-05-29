export function sliceImage(img, gridSize = 3) {
    const pieces = [];
    const minSize = Math.min(img.naturalWidth, img.naturalHeight);
    const offsetX = img.naturalWidth > img.naturalHeight
        ? (img.naturalWidth - img.naturalHeight) / 2
        : 0;
    const offsetY = img.naturalHeight > img.naturalWidth
        ? (img.naturalHeight - img.naturalWidth) / 2
        : 0;

    const pieceSize = Math.floor(minSize / gridSize);

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const canvas = document.createElement('canvas');
            canvas.width = pieceSize;
            canvas.height = pieceSize;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(
                img,
                offsetX + col * pieceSize,
                offsetY + row * pieceSize,
                pieceSize,
                pieceSize,
                0,
                0,
                pieceSize,
                pieceSize
            );
            pieces.push(canvas);
        }
    }
    return pieces;
}
