export function generarGrid(size) {
    const grid = document.querySelector(".grid");
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 1; i <= size * size; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.pos = i;
        grid.appendChild(cell);
    }
}
