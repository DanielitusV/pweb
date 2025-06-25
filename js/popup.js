const apiBaseUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : window.API_BASE_URL;
  
document.addEventListener('DOMContentLoaded', () => {
    const btnProfesor = document.getElementById('btn-profesor');
    const popup = document.getElementById('popup-nombre');
    const inputNombre = document.getElementById('input-nombre');
    const inputPassword = document.getElementById('input-password');
    const inputPasswordRepeat = document.getElementById('input-password-repeat');
    const btnAccion = document.getElementById('btn-accion');
    const cerrarPopup = document.getElementById('cerrar-popup');
    const cambiarModo = document.getElementById('cambiar-modo');
    const popupTitulo = document.getElementById('popup-titulo');
    const textoCambiar = document.getElementById('texto-cambiar');
    const errorNombre = document.getElementById('error-nombre');

    let modo = 'ingresar';

    btnProfesor.onclick = () => {
        modo = 'ingresar';
        actualizarPopup();
        popup.style.display = 'flex';
        inputNombre.value = '';
        inputPassword.value = '';
        inputPasswordRepeat.value = '';
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
        inputPassword.value = '';
    };

    btnAccion.onclick = enviarDatos;

    inputNombre.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') enviarDatos();
    });
    inputPassword.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') enviarDatos();
    });
    inputPasswordRepeat.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && modo === 'registrar') enviarDatos();
    });

    function actualizarPopup() {
        if (modo === 'registrar') {
            popupTitulo.textContent = 'Registrarse';
            btnAccion.textContent = 'Registrarse';
            textoCambiar.innerHTML = '¿Ya tienes cuenta? <a href="#" id="cambiar-modo">Inicia sesión</a>';
            inputPasswordRepeat.style.display = '';
        } else {
            popupTitulo.textContent = 'Iniciar Sesión';
            btnAccion.textContent = 'Ingresar';
            textoCambiar.innerHTML = '¿No tienes cuenta? <a href="#" id="cambiar-modo">Regístrate</a>';
            inputPasswordRepeat.style.display = 'none';
        }

        document.getElementById('cambiar-modo').onclick = cambiarModo.onclick;
    }

    async function enviarDatos() {
        const nombre = inputNombre.value.trim();
        const password = inputPassword.value.trim();
        const passwordRepeat = inputPasswordRepeat.value.trim();
        errorNombre.textContent = '';
        errorNombre.classList.remove('activo');

        if (!nombre) {
            errorNombre.textContent = 'Debes ingresar un nombre.';
            errorNombre.classList.add('activo');
            inputNombre.focus();
            return;
        }
        if (!password) {
            errorNombre.textContent = 'Debes ingresar una contraseña.';
            errorNombre.classList.add('activo');
            inputPassword.focus();
            return;
        }

        if (modo === 'registrar') {
            if (!passwordRepeat) {
                errorNombre.textContent = 'Debes repetir la contraseña.';
                errorNombre.classList.add('activo');
                inputPasswordRepeat.focus();
                return;
            }
            if (password !== passwordRepeat) {
                errorNombre.textContent = 'Las contraseñas no coinciden.';
                errorNombre.classList.add('activo');
                inputPasswordRepeat.focus();
                return;
            }
        }

        const endpoint = modo === 'registrar' 
            ? `${apiBaseUrl}/usuarios/registrar` 
            : `${apiBaseUrl}/usuarios/ingresar`;

        const payload = modo === 'registrar'
            ? { nombre, password }
            : { nombre, password };

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            // Caso especial, usuario antiguo sin contraseña
            if (data.debe_actualizar_password) {
                errorNombre.classList.add('activo');
                errorNombre.textContent = '¡Este usuario no tiene contraseña! Ingresa una nueva para actualizarla.';
                await fetch(`${apiBaseUrl}/usuarios/cambiar_password`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        usuario_id: data.usuario_id,
                        password
                    })
                });
                window.location.reload();
                return;
            }

            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            window.location.href = 'views/professor.html';
        } else {
            errorNombre.classList.add('activo');
            errorNombre.textContent = data.error || 'Error en la operación.';
        }
    }
});
