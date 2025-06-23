const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://constantly-top-goshawk.ngrok-free.app";

document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const divNombre = document.getElementById('nombreProfesor');

    if (usuario && usuario.nombre) {
        divNombre.textContent = `👤 ${usuario.nombre}`;
    } else {
        divNombre.textContent = '👤 Invitado';
    }

    localStorage.removeItem('pregunta_editar');
    localStorage.removeItem('pregunta_ver');
});

document.addEventListener('DOMContentLoaded', async() => {
    const contenedor = document.querySelector('.questions-container');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario || !usuario.nombre) {
        contenedor.innerHTML = `
            <div class="error">
                <h2>Error</h2>
                <p>No se ha encontrado un nombre de usuario. Por favor, regístrate o inicia sesión.</p>
            </div>
        `;
        return;
    }

    try {
        const res = await fetch(`${apiBaseUrl}/preguntas/${usuario._id}`);
        const preguntas = await res.json();

        if (!Array.isArray(preguntas) || preguntas.length === 0) {
            contenedor.classList.add('no-preguntas-center');
            const sinPreguntas = document.createElement('div');
            sinPreguntas.className = 'no-preguntas';
            sinPreguntas.innerHTML = `
                <h2 style="margin-bottom:0.5rem;">No hay preguntas disponibles</h2>
                <p>Actualmente no tienes preguntas creadas.</p>
            `;
            contenedor.appendChild(sinPreguntas);
            return;
        }

        preguntas.forEach(p => {
            const card = document.createElement('section');
            card.className = 'questions-card';
            card.innerHTML = `
                <div class="card-top">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; font-size: 1.2rem;">
                            <b>Título:</b>
                            <span style="margin-left: 2rem; font-weight: bold; text-align: right; flex: 1;">${p.nombre}</span>
                        </div>
                        <div class="info-row"><b>Dificultad:</b> ${p.dificultad || '-'}</div>
                        <div class="info-row"><b>Última Edición:</b> ${formatearFecha(p.fecha_creacion)}</div>
                    </div>
                </div>
                <div class="info-row">
                    <b>Opciones:</b>
                    <ul>
                        ${p.opciones && Array.isArray(p.opciones) ? p.opciones.map((op, i) => `<li><b>${String.fromCharCode(65+i)}:</b> ${op}</li>`).join('') : ''}
                    </ul>
                </div>
                <div class="info-row"><b>Respuesta Correcta:</b> <span>${p.respuesta_correcta || '-'}</span></div>
                <div class="buttons-row">
                    <button class="view" onclick="verPregunta('${p._id}')">Ver</button>
                    <button class="edit" onclick="editarPregunta('${p._id}')">Editar</button>
                    <button class="delete" onclick="eliminarPregunta('${p._id}')">Borrar</button>
                </div>
            `;

            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar el contenido del profesor:', error);
        contenedor.innerHTML = `
            <div class="error">
                <h2>Error</h2>
                <p>No se pudo cargar el contenido del profesor. Inténtalo de nuevo más tarde.</p>
            </div>
        `;
    }
    
});

function formatearFecha(fechaISO) {
    if (!fechaISO) return 'Fecha Desconocida';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-BO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

function editarPregunta(id) {
    localStorage.setItem('pregunta_editar', id);
    window.location.href = 'editor-preguntas.html';
}

function eliminarPregunta(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) return;

    fetch(`${apiBaseUrl}/preguntas/del/${id}`, {
        method: 'DELETE'
    })
    .then(async res => {
        const data = await res.json();
        if (res.ok || data.success) {
            alert('Pregunta eliminada correctamente.');
            window.location.reload();
        } else {
            console.error('Error desde el backend:', data);
            alert('Error al eliminar la pregunta: ' + (data.error || 'Error desconocido.'));
        }
    })
    .catch(error => {
        console.error('Error al eliminar la pregunta:', error);
        alert('Error al eliminar la pregunta. Inténtalo de nuevo más tarde.');
    });
}

function verPregunta(id) {
    localStorage.setItem('pregunta_ver', id);
    window.location.href = 'ver-preguntas.html';
}