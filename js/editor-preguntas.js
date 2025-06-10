import { subirAImgbb } from "./puzzle-scripts/puzzle-imgbb.js";

const API_KEY_IMGBB = "4c5c9937ecf5372e5aa92076c7147fa7";
const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://constantly-top-goshawk.ngrok-free.app";

const uploadInput = document.getElementById("uploadInput");
const difficult = document.getElementById("puzzlePreviewModes");
const confirmBtn = document.getElementById("confirmarPuzzleBtn");
const helpIcon = document.getElementById("puzzle-help");

function checkConfirmarPuzzle() {
    const uploadedImage = uploadInput.files.length > 0;
    const validDifficult = difficult.value && difficult.value !== "" && difficult.value !== "Selecciona la dificultad";

    const shouldShowIcon = !(uploadedImage && validDifficult);
    confirmBtn.disabled = shouldShowIcon;
    helpIcon.hidden = !shouldShowIcon;
}

uploadInput.addEventListener("change", checkConfirmarPuzzle);
difficult.addEventListener("change", checkConfirmarPuzzle);

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("preguntaForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const validImage = uploadInput.files.length > 0;
        const validDifficult = difficult.value && difficult.value !== "";
        const isRightAnswer = document.getElementById("respuestaCorrecta").value;
        const usuario = JSON.parse(localStorage.getItem("usuario"));

        if (!usuario || !usuario._id) {
            alert("No se ha encontrado un usuario válido. Por favor, inicia sesión.");
            return;
        }

        if (!validImage) {
            alert("Por favor, sube una imagen antes de enviar el formulario.");
            return;
        }

        if (!validDifficult || validDifficult === "Selecciona la dificultad") {
            alert("Por favor, selecciona una dificultad válida.");
            return;
        }

        if (!isRightAnswer || isRightAnswer === "Selecciona la respuesta correcta") {
            alert("Por favor, selecciona una respuesta correcta.");
            return;
        }

        const imagen = uploadInput.files[0];
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

        const base64 = await fileToBase64(imagen);

        const pregunta = {
            nombre: document.getElementById("titulo").value.trim(),
            descripcion: document.getElementById("descripcion").value.trim(),
            dificultad: difficult.value,
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
            tiempo: document.getElementById("tiempoSeleccionado").value.trim() || null // 👈 Aquí se agrega correctamente
        };

        try {
            const res = await fetch(`${apiBaseUrl}/preguntas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pregunta)
            });

            if (res.ok) {
                const data = await res.json();
                const idPregunta = data._id;
                localStorage.setItem(`img_${idPregunta}`, base64);
                window.location.href = "professor.html";
            } else {
                const error = await res.json();
                alert(`Error al crear la pregunta: ${error.error || "Error desconocido"}`);
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            alert("Ocurrió un error al enviar los datos.");
        }
    });

    uploadInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        const preview = document.getElementById("imagePreview");
        const placeholder = document.getElementById("uploadPlaceholder");

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';

                if (difficult.value && difficult.value !== "Selecciona la dificultad") {
                    confirmBtn.disabled = false;
                }
            };
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
            preview.style.display = 'none';
            placeholder.style.display = 'block';
            confirmBtn.disabled = true;
        }
    });
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// 🎯 Mostrar/Ocultar opciones de tiempo
const btnAgregarTiempo = document.getElementById("btnAgregarTiempo");
const timeOptions = document.getElementById("timeOptions");
const tiempoSeleccionadoInput = document.getElementById("tiempoSeleccionado");
const tiempoBtns = timeOptions.querySelectorAll(".tiempo-btn");

btnAgregarTiempo.addEventListener("click", () => {
    const visible = timeOptions.style.display === "flex";
    timeOptions.style.display = visible ? "none" : "flex";
    btnAgregarTiempo.textContent = visible ? "Agregar tiempo" : "Ocultar opciones de tiempo";

    if (!visible) {
        // Reset selección anterior al mostrar
        tiempoBtns.forEach(btn => btn.classList.remove("selected"));
        tiempoSeleccionadoInput.value = "";
    }
});

tiempoBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        tiempoBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        tiempoSeleccionadoInput.value = btn.getAttribute("data-time");
    });
});


/*import { subirAImgbb } from "./puzzle-scripts/puzzle-imgbb.js";

const API_KEY_IMGBB = "4c5c9937ecf5372e5aa92076c7147fa7";
const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://constantly-top-goshawk.ngrok-free.app";

const uploadInput = document.getElementById("uploadInput");
const difficult = document.getElementById("puzzlePreviewModes");
const confirmBtn = document.getElementById("confirmarPuzzleBtn");
const helpIcon=  document.getElementById("puzzle-help");

function checkConfirmarPuzzle() {
    const uploadedImage = uploadInput.files.length > 0;
    const validDifficult = difficult.value && difficult.value !== "" && difficult.value !== "Selecciona la dificultad";
    const shouldShowIcon = !(uploadedImage && validDifficult);
    
    confirmBtn.disabled = shouldShowIcon;
    helpIcon.hidden = !shouldShowIcon;
}

uploadInput.addEventListener("change", checkConfirmarPuzzle);
difficult.addEventListener("change", checkConfirmarPuzzle);

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("preguntaForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const validImage = uploadInput.files.length > 0;
        const validDifficult = difficult.value && difficult.value !== "";
        const isRightAnswer = document.getElementById("respuestaCorrecta").value;
        const usuario = JSON.parse(localStorage.getItem("usuario"));

        if (!usuario || !usuario._id) {
            alert("No se ha encontrado un usuario válido. Por favor, inicia sesión.");
            return;
        }

        if (!validImage) {
            alert("Por favor, sube una imagen antes de enviar el formulario.");
            return;
        }

        if (!validDifficult || validDifficult === "Selecciona la dificultad") {
            alert("Por favor, selecciona una dificultad válida.");
            return;
        }

        if (!isRightAnswer || isRightAnswer === "Selecciona la respuesta correcta") {
            alert("Por favor, selecciona una respuesta correcta.");
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
        const base64 = await fileToBase64(imagen);
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
                const data = await res.json();
                const idPregunta = data._id;
                localStorage.setItem(`img_${idPregunta}`, base64);
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
        const confirmarBtn = document.getElementById('confirmarPuzzleBtn');

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
                if (difficult.value && difficult.value !== "Selecciona la dificultad") {
                    confirmarBtn.disabled = false
                }
                
            };
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
            preview.style.display = 'none';
            placeholder.style.display = 'block';
            confirmarBtn.disabled = true;
        }
    });
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}



//IGUAL AGREGUE ESTO PARA EL TIUEMPO


const tiempoBtns = document.querySelectorAll(".tiempo-btn");
const tiempoSeleccionadoInput = document.getElementById("tiempoSeleccionado");

tiempoBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Eliminar selección anterior
        tiempoBtns.forEach(b => b.classList.remove("active"));
        // Activar el seleccionado
        btn.classList.add("active");
        // Guardar el tiempo
        tiempoSeleccionadoInput.value = btn.getAttribute("data-tiempo");
    });
});

*/