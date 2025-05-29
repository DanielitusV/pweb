import { showCelebration } from "./puzzle-celebration.js";

export async function isPuzzleCorrect(cells) {
    await new Promise(resolve => setTimeout(resolve, 300));

    for (let i = 0; i < cells.length; i++) {
        const piece = cells[i].firstElementChild;
        if (
            !piece ||
            piece.dataset.flipped !== "false" ||
            piece.getAttribute("data-piece") !== (i + 1).toString()
        ) {
            return false;
        }
    }

    showCelebration();
    return true;
}