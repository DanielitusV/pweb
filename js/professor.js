const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://constantly-top-goshawk.ngrok-free.app";

document.addEventListener('DOMContentLoaded', async() => {
    const contenedor = document.querySelector('.proyectos-container');
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
        const res = await fetch(`${apiBaseUrl}/proyectos/${usuario._id}`);
        const proyectos = await res.json();

        if (!Array.isArray(proyectos) || proyectos.length === 0) {
            const sinProyectos = document.createElement('div');
            sinProyectos.className = 'no-proyectos';
            sinProyectos.innerHTML = `
                <h2>No hay proyectos disponibles</h2>
                <p>Actualmente no tienes proyectos creados.</p>
            `;
            contenedor.appendChild(sinProyectos);
            return;
        }

        proyectos.forEach(p => {
            const card = document.createElement('section');
            card.className = 'project-card';
            card.innerHTML = `
                <p><strong>Nombre del Proyecto:</strong> ${p.nombre}</p>
                <p><strong>Número de Preguntas:</strong> ${p.total_preguntas || 0}</p>
                <p><strong>Última Edición:</strong> ${formatearFecha(p.fecha_creacion)}</p>
                <div class="buttons-row">
                    <button class="edit" onclick="editarProyecto('${p._id}')">Editar</button>
                    <button class="delete" onclick="eliminarProyecto('${p._id}')">Borrar</button>
                </div>
            `;
            contenedor.insertBefore(card, document.querySelector('.add-project'));
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
        minute: '2-digit'
    });
}

function editarProyecto(id) {
    localStorage.setItem('proyecto_editar', id);
    window.location.href = 'views/editar_proyecto.html';
}

function eliminarProyecto(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return;

    fetch(`${apiBaseUrl}/profesor/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Proyecto eliminado correctamente.');
            window.location.reload();
        } else {
            alert('Error al eliminar el proyecto: ' + (data.error || 'Error desconocido.'));
        }
    })
    .catch(error => {
        console.error('Error al eliminar el proyecto:', error);
        alert('Error al eliminar el proyecto. Inténtalo de nuevo más tarde.');
    });
}