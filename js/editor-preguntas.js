import { subirAImgbb } from "./puzzle-scripts/puzzle-imgbb.js";

const API_KEY_IMGBB = "4c5c9937ecf5372e5aa92076c7147fa7";
const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://constantly-top-goshawk.ngrok-free.app";

function mostrarFormulario() {
    const form = document.getElementById("formularioPregunta");
    form.style.display = form.style.display === "none" ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("preguntaForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario || !usuario._id) {
            alert("No se ha encontrado un usuario válido. Por favor, inicia sesión.");
            return;
        }

        const imagen = document.getElementById("uploadInput").files[0];
        let urlImg = "";

        if (imagen) {
            try {
                urlImg = await subirAImgbb(imagen, API_KEY_IMGBB);
            } catch (error) {
                console.error("Error al subir la imagen:", error);
                alert("Ocurrió un error al subir la imagen. Por favor, inténtalo de nuevo.");
                return;
            }
        }

        const pregunta = {
            nombre: document.getElementById("titulo").value.trim(),
            descripcion: document.getElementById("descripcion").value.trim(),
            dificultad: document.getElementById("puzzlePreviewModes").value,
            usuario_id: usuario._id,
            fecha_creacion: new Date().toISOString(),

            imagen: urlImg,
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

    document.getElementById('uploadInput').addEventListener('change', function (e) {
        const file = e.target.files[0];
        const preview = document.getElementById('imagePreview');
        const placeholder = document.getElementById('uploadPlaceholder');

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
            preview.style.display = 'none';
            placeholder.style.display = 'block';
        }
    });
});