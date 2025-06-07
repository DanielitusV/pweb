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

        const data = {
            nombre: document.getElementById("titulo").value.trim(),
            descripcion: document.getElementById("descripcion").value.trim(),
            dificultad: document.getElementById("dificultad").value,
            usuario_id: usuario._id,
            fecha_creacion: new Date().toISOString()
        };

        try {
            const res = await fetch(`${apiBaseUrl}/preguntas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
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
});