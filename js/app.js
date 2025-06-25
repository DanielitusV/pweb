window.API_BASE_URL = "https://<colocar-link-ngrok-aqui>";

document.addEventListener("DOMContentLoaded", () => {
    console.log("INTERAQUIZ cargado");

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});
