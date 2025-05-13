export async function isPuzzleCorrect(cells) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    for (let i = 0; i < cells.length; i++) {
        const piece = cells[i].firstElementChild;
        if (!piece || piece.textContent !== (i + 1).toString()) {
            return false;
        }
    }
    return true;
}