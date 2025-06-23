export function modoDificultad() {
    let mode = 'easy';
    const dificultadSelect = document.getElementById('puzzlePreviewModes');
    const puzzleRadios = document.querySelector('input[name="puzzleMode"]:checked');
    if (!puzzleRadios) {
        mode = dificultadSelect.value === 'Novato' ? 'easy'
            : dificultadSelect.value === 'Intermedio' ? 'intermediate'
            : 'advanced';
    } else {
        mode = puzzleRadios.value;
    }
    return mode;
}
