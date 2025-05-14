export function setupImageUpload(inputId, previewId, messageId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const message = document.getElementById(messageId);

    input.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
                message.textContent = '✅ Imagen subida correctamente';
                message.style.color = 'green';
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
            message.textContent = '❌ Error: El archivo no pudo subirse o no es valido';
            message.style.color = 'red';
        }
    });
}