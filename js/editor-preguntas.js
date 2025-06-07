const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://constantly-top-goshawk.ngrok-free.app";

function mostrarFormulario() {
    const form = document.getElementById("formularioPregunta");
    form.style.display = form.style.display === "none" ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("preguntaForm");
    let imagePuzzleBase64 = "";

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario || !usuario._id) {
            alert("No se ha encontrado un usuario válido. Por favor, inicia sesión.");
            return;
        }

        const imagen = document.getElementById("imagenPuzzle").files[0];
        const formData = new FormData();
        formData.append("imagen", imagen);

        const resImg = await fetch(`${apiBaseUrl}/upload`, {
            method: "POST",
            body: formData
        });

        const pregunta = {
            nombre: document.getElementById("titulo").value.trim(),
            descripcion: document.getElementById("descripcion").value.trim(),
            dificultad: document.getElementById("dificultad").value,
            usuario_id: usuario._id,
            fecha_creacion: new Date().toISOString(),

            imagen: imagePuzzleBase64,
            opciones: [
                document.getElementById("opcion1").value.trim(),
                document.getElementById("opcion2").value.trim(),
                document.getElementById("opcion3").value.trim(),
                document.getElementById("opcion4").value.trim()
            ],
            respuesta_correcta: document.getElementById("respuestaCorrecta").value.trim(),
        };

        try {
            const res = await fetch(`${apiBaseUrl}/preguntas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pregunta)
            });

            if (res.ok) {
                window.location.href = "professor.html";
            } else {
                const error = await res.json();
                alert(`Error al crear el proyecto: ${error.error || "Error desconocido"}`);
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            alert("Ocurrió un error al enviar los datos.");
        }
    });

    document.getElementById("uploadInput").addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            imagenPuzzleBase64 = e.target.result;

            const preview = document.getElementById("imagePreview");
            preview.src = imagenPuzzleBase64;
            preview.style.display = "block";

            document.getElementById("uploadPlaceholder").style.display = "none";
            document.getElementById("uploadMessage").textContent = "Imagen subida correctamente.";
            document.getElementById("puzzlePreviewModes").style.display = "block";
            document.getElementById("confirmarPuzzleBtn").style.display = "block";
        };
        reader.readAsDataURL(file);
    });

});