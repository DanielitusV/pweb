import { sliceImage } from './puzzle-image-slicer.js';

export function setupImageUpload(inputId, previewId, messageId, onSliced) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const message = document.getElementById(messageId);
    const placeholder = document.getElementById("uploadPlaceholder");
    const puzzlePreviewGrid = document.getElementById("puzzlePreviewGrid");
    const confirmarBtn = document.getElementById("confirmarPuzzleBtn");
    
    input.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
                if (placeholder) placeholder.style.display = 'none';
                message.textContent = '✅ Imagen subida correctamente';
                message.style.color = 'green';

                preview.onload = () => {
                    puzzlePreviewGrid.innerHTML = '';
                    const pieces = sliceImage(preview, 3);
                    puzzlePreviewGrid.style.display = 'grid';
                    puzzlePreviewGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                    puzzlePreviewGrid.style.gap = '2px';
                    
                    pieces.forEach(canvas => {
                        canvas.style.width = "70px";
                        canvas.style.height = "70px";
                        canvas.style.border = "1px solid #bbb";
                        puzzlePreviewGrid.appendChild(canvas);
                    });

                    confirmarBtn.style.display = 'inline-block';

                    if (onSliced) onSliced(pieces);
                }
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
            if (placeholder) placeholder.style.display = 'block';
            message.textContent = '❌ Error: El archivo no pudo subirse o no es valido';
            message.style.color = 'red';
            puzzlePreviewGrid.innerHTML = '';
            puzzlePreviewGrid.style.display = 'none';
        }
    });
}