document.addEventListener("DOMContentLoaded", () => {
    console.log("INTERAQUIZ cargado");
});

document.getElementById('menuToggle').addEventListener('click', () => {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
});
