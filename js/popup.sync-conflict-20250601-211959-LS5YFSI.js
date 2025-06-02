const apiBaseUrl = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://constantly-top-goshawk.ngrok-free.app";

document.addEventListener('DOMContentLoaded', () => {
 
    const btnProfesor = document.getElementById('btn-profesor');
    const popup = document.getElementById('popup-nombre');
    const inputNombre = document.getElementById('input-nombre');
    const registrarNombre = document.getElementById('registrar-nombre');
    const ingresarNombre = document.getElementById('ingresar-nombre');
    const cerrarPopup = document.getElementById('cerrar-popup');
    const errorNombre = document.getElementById('error-nombre');

    if(btnProfesor) {
        btnProfesor.onclick = () => {
            inputNombre.value = '';
            errorNombre.textContent = '';
            popup.style.display = 'flex';
            inputNombre.focus();
        };
    }

    if(cerrarPopup) {
        cerrarPopup.onclick = () => {
            popup.style.display = 'none';
        };
    }

    if(registrarNombre) {
        registrarNombre.onclick = async () => {
            const nombre = inputNombre.value.trim();
            errorNombre.textContent = '';
            if(!nombre){
                errorNombre.textContent = 'Debes ingresar un nombre.';
                inputNombre.focus();
                return;
            }
            try {
                const res = await fetch(`${apiBaseUrl}/usuarios/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre })
                })
                
                const data = await res.json();

                if (res.ok) {
                    window.location.href = 'views/professor.html';
                } else {
                    errorNombre.textContent = data.error || 'Error al registrar el nombre.';
                }
            } catch (err) {
                errorNombre.textContent = 'Error de conexión al servidor.'
            }
        };
    }

    if(ingresarNombre) {
        ingresarNombre.onclick = async () => {
            const nombre = inputNombre.value.trim();
            errorNombre.textContent = '';
            if(!nombre){
                errorNombre.textContent = 'Debes ingresar un nombre.';
                inputNombre.focus();
                return;
            }
            try {
                const res = await fetch(`${apiBaseUrl}/usuarios/ingresar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre })
                });
                
                const data = await res.json();

                if (res.ok) {
                    window.location.href = 'views/professor.html';
                } else {
                    errorNombre.textContent = data.error || 'Error al ingresar el nombre.';
                }
            } catch (err) {
                errorNombre.textContent = 'Error de conexión al servidor.'
            }
        };
    }
});
