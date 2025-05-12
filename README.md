# INTERAQUIZ - Editor de Preguntas Interactivas

## Descripción
Aplicación web responsiva que permite a profesores crear proyectos de preguntas interactivas. Por el momento, se enfoca en un solo tipo de pregunta: rompecabezas a partir de una imagen.

El deployado del proyecto está pensado para ejecutar en Windows 11, las siguientes indicaciones están planteado para ser ejecutadas en dicho sistema operativo. 

La aplicación luego será accesible desde cualquier dispositivo a través de la URL generada por Ngrok.

### Tecnologías usadas:
- Windows 11
- HTML
- CSS
- JavaScript
- Python (Para levantar servidor local)
- Ngrok (para exponer el sitio a internet)
- MongoDB Atlas (persistencia futura)

## Instrucciones para ejecutar el proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/DanielitusV/pweb.git
cd pweb
```

### 2. Levantar el servidor local
Es necesario tener **Python instalado**- Luego, ejecutar este comando desde la raíz del proyecto:

```bash
python -m http.server 3000
```

Cabe resaltar, que es necesario que esta terminal se mantenga activa para tener el servidor abierto, los siguientes pasos deben realizarse en otra terminal desde la raíz del repositorio

### 3. Instalar y Configurar Ngrok

Para empezar se necesita instalar `ngrok` via Chocolatey con el siguiente comando (en terminal con permisos de administrador)

```bash
choco install ngrok
```

Ejecutar el siguiente comando para añadir el auto-token al archivo de configuración `ngrok.yml`. Las credenciales son generadas en base a una cuenta ya creada en `ngrok`.

```bash
    ngrok config add-authtoken 2wWYQoouQl7qMlsqFtX3qjtfFY7_2Qriqga9QZV5m2xm9zToJ
```


En otra terminal, desde la raiz del archivo, ejecutar:

```bash
    ngrok http --url=constantly-top-goshawk.ngrok-free.app 3000
```

Cuando ambas terminales estén ejecutandose (el de Python y el de Ngrok), será posible acceder a la aplicación desde:

http://constantly-top-goshawk.ngrok-free.app

## 3. Estructura del Proyecto

```Proyecto

/PWEB/
├── assets/
│ ├── icons/
│ └── images/
├── css/
│ └── main.css
├── docs/
├── js/
│ ├── app.js
│ ├── rompecabezas.js
│ └── ui.js
├── views/
│ ├── home.html
│ ├── editor.html
│ ├── admin.html
│ └── config.html
├── index.html
├── install.txt
└── README.md

```