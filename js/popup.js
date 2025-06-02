const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://constantly-top-goshawk.ngrok-free.app";
  
document.addEventListener('DOMContentLoaded', () => {
    const btnProfesor = document.getElementById('btn-profesor');
    const popup = document.getElementById('popup-nombre');
    const inputNombre = document.getElementById('input-nombre');
    const btnAccion = document.getElementById('btn-accion');
    const cerrarPopup = document.getElementById('cerrar-popup');
    const cambiarModo = document.getElementById('cambiar-modo');
    const popupTitulo = document.getElementById('popup-titulo');
    const textoCambiar = document.getElementById('texto-cambiar');
    const errorNombre = document.getElementById('error-nombre');

    let modo = 'registrar';

    btnProfesor.onclick = () => {
        modo = 'registrar';
        actualizarPopup();
        popup.style.display = 'flex';
        inputNombre.value = '';
        errorNombre.textContent = '';
        inputNombre.focus();
    };

    cerrarPopup.onclick = () => {
        popup.style.display = 'none';
    };

    cambiarModo.onclick = (e) => {
        e.preventDefault();
        modo = (modo === 'registrar') ? 'ingresar' : 'registrar';
        actualizarPopup();
        errorNombre.textContent = '';
        inputNombre.focus();
    };

    btnAccion.onclick = enviarNombre;

    inputNombre.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') enviarNombre();
    });

    function actualizarPopup() {
        if (modo === 'registrar') {
            popupTitulo.textContent = 'Registrarse';
            btnAccion.textContent = 'Registrarse';
            textoCambiar.innerHTML = '¿Ya tienes cuenta? <a href="#" id="cambiar-modo">Inicia sesión</a>';
        } else {
            popupTitulo.textContent = 'Iniciar Sesión';
            btnAccion.textContent = 'Ingresar';
            textoCambiar.innerHTML = '¿No tienes cuenta? <a href="#" id="cambiar-modo">Regístrate</a>';
        }

        document.getElementById('cambiar-modo').onclick = cambiarModo.onclick;
    }

    async function enviarNombre() {
        const nombre = inputNombre.value.trim();
        errorNombre.textContent = '';
        errorNombre.classList.remove('activo');

        if (!nombre) {
            errorNombre.textContent = 'Debes ingresar un nombre.';
            errorNombre.classList.add('activo');
            inputNombre.focus();
            return;
        }


        const endpoint = modo === 'registrar' 
            ? `${apiBaseUrl}/usuarios/registrar` 
            : `${apiBaseUrl}/usuarios/ingresar`;

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({nombre})
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            window.location.href = 'views/professor.html';
        } else {
            errorNombre.classList.add('activo');
            errorNombre.textContent = data.error || 'Error en la operación.';
        }
    }
});
