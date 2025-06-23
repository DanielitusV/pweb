export function generarPiezas(size) {
    const basket = document.querySelector(".basket");
    basket.innerHTML = "";

    for (let i = 1; i <= size * size; i++) {
        const piece = document.createElement("div");
        piece.className = "piece";
        piece.draggable = true;
        piece.dataset.piece = i;
        piece.textContent = i;
        basket.appendChild(piece);
    }
}
