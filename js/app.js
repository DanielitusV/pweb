document.addEventListener("DOMContentLoaded", () => {
    console.log("INTERAQUIZ cargado");

    const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        if(menuToggle && navLinks){
            menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
  }

});

document.getElementById('menuToggle').addEventListener('click', () => {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
});
