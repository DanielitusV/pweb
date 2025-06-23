import { showCelebration } from "./puzzle-celebration.js";
import { modoDificultad } from "./puzzle-difficulty.js";

export async function isPuzzleCorrect(cells) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const mode = modoDificultad();
    console.log("Checking puzzle correctness in mode:", mode);

    for (let i = 0; i < cells.length; i++) {
        const piece = cells[i].firstElementChild;
        if (
            !piece ||
            piece.dataset.flipped !== "false" ||
            piece.getAttribute("data-piece") !== (i + 1).toString()
        ) {
            return false;
        }

        if (mode === 'advanced' && piece.dataset.rotation !== "0") {
            return false;
        }
    }

    showCelebration();
    return true;
}