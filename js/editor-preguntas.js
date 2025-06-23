import { subirAImgbb } from "./puzzle-scripts/puzzle-imgbb.js";

const API_KEY_IMGBB = "4c5c9937ecf5372e5aa92076c7147fa7";
const apiBaseUrl = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://constantly-top-goshawk.ngrok-free.app";

const uploadInput = document.getElementById("uploadInput");
const difficult = document.getElementById("puzzlePreviewModes");
const confirmBtn = document.getElementById("confirmarPuzzleBtn");
const helpIcon = document.getElementById("puzzle-help");

let preguntaExistente = null;

// Habilitar/deshabilitar el botón según validez de campos
function checkConfirmarPuzzle() {
  const uploadedImage = uploadInput.files.length > 0;
  const validDifficult = difficult.value && difficult.value !== "" && difficult.value !== "Selecciona la dificultad";
  const shouldShowIcon = !(uploadedImage && validDifficult);

  confirmBtn.disabled = shouldShowIcon;
  helpIcon.hidden = !shouldShowIcon;
}

uploadInput.addEventListener("change", checkConfirmarPuzzle);
difficult.addEventListener("change", checkConfirmarPuzzle);

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("preguntaForm");

  // Iniciar Quill
  const quill = new Quill('#descripcion', {
    theme: 'snow',
    placeholder: 'Descripción de la Pregunta',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ]
    }
  });

  // Precargar si es edición
  const preguntaId = localStorage.getItem("pregunta_editar");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || !usuario._id) {
    alert("Por favor, inicia sesión.");
    return;
  }

  if (preguntaId) {
    try {
      const res = await fetch(`${apiBaseUrl}/preguntas/ver/${preguntaId}`);
      if (!res.ok) throw new Error("No se pudo cargar la pregunta");
      const data = await res.json();
      preguntaExistente = data;
      precargarFormulario(preguntaExistente, quill);
    } catch (error) {
      console.error("Error al cargar la pregunta:", error);
      alert("No se pudo cargar la pregunta a editar. Ver consola.");
    }
  }

  // Submit: creación y edición
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const imagen = uploadInput.files[0];
    let urlImg = preguntaExistente?.imagen || "";

    if (imagen) {
      try {
        urlImg = await subirAImgbb(imagen, API_KEY_IMGBB);
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        alert("Ocurrió un error al subir la imagen.");
        return;
      }
    } else if (!urlImg) {
      alert("Por favor, sube una imagen.");
      return;
    }

    const descripcionHTML = quill.root.innerHTML;
    if (!descripcionHTML || descripcionHTML.trim() === "<p><br></p>") {
      alert("La descripción no puede estar vacía.");
      return;
    }

    const pregunta = {
      nombre: document.getElementById("titulo").value.trim(),
      descripcion: descripcionHTML,
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
    };

    try {
      const method = preguntaId ? "PUT" : "POST";
      const endpoint = preguntaId
        ? `${apiBaseUrl}/preguntas/update/${preguntaId}`
        : `${apiBaseUrl}/preguntas`;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pregunta)
      });

      if (res.ok) {
        if (imagen) {
          const base64 = await fileToBase64(imagen);
        }
        alert("Pregunta guardada correctamente.");
        localStorage.removeItem("pregunta_editar");
        window.location.href = "professor.html";
      } else {
        const err = await res.json();
        alert("Error: " + (err.error || "Error desconocido al guardar la pregunta."));
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      alert("Error al enviar los datos.");
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
        preview.style.display = "block";
        placeholder.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
      preview.style.display = "none";
      placeholder.style.display = "block";
    }
  });
});

function precargarFormulario(p, quill) {
  document.getElementById("titulo").value = p.nombre || "";
  quill.root.innerHTML = p.descripcion || "";
  document.getElementById("puzzlePreviewModes").value = p.dificultad || "Selecciona la dificultad";
  const opciones = Array.isArray(p.opciones) ? p.opciones : [];
  document.getElementById("opcion1").value = opciones[0] || "";
  document.getElementById("opcion2").value = opciones[1] || "";
  document.getElementById("opcion3").value = opciones[2] || "";
  document.getElementById("opcion4").value = opciones[3] || "";
  document.getElementById("respuestaCorrecta").value = p.respuesta_correcta || "";

  if (p.imagen) {
    const preview = document.getElementById("imagePreview");
    const placeholder = document.getElementById("uploadPlaceholder");
    preview.src = p.imagen;
    preview.style.display = "block";
    placeholder.style.display = "none";
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
