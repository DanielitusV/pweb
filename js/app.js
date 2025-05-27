document.addEventListener("DOMContentLoaded", () => {
    console.log("INTERAQUIZ cargado");

    // Cargar Header
    fetch('./components/header.html')
        .then(res => res.text())
        .then(data => {
            document.querySelector('header.header').innerHTML = data;
        })
        .catch(error => console.error('Error al cargar el header:', error));

    // Cargar Footer (opcional, si también lo tienes)
    fetch('./components/footer.html')
        .then(res => res.text())
        .then(data => {
            document.querySelector('footer.footer').innerHTML = data;
        })
        .catch(error => console.error('Error al cargar el footer:', error));
});
