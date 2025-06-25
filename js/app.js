window.API_BASE_URL = "https://constantly-top-goshawk.ngrok-free.app";

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
