# INTERAQUIZ - Editor de Preguntas Interactivas

## Versión 1.01

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
- Flask (Para ejecutar server.py)
- Ngrok (para exponer el sitio a internet)
- MongoDB Atlas (persistencia futura)

## Instrucciones para ejecutar el proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/DanielitusV/pweb.git
cd pweb
```

### 2. Levantar el servidor local
Es necesario tener **Python instalado** 

### Importante sobre el PATH:
Antes de instalas dependencias como **Flask** o **requests**, asegurarse de que la instalación de **Python** y **pip** estén correctamente añadidas al **PATH** del sistema. Si no está bien configurado, los comandos posteriores pueden fallar o instalarse en ubicaciones incorrectas

**Recomendaciones**:
- Verificar que al ejecutar `python --version` y `pip --version` en la terminal, ambos funcionen correctamente.
- Si muestra advertencias de que `pip` o `python` no se encuentran, revisa tu configuración de PATH o usa un entorno virtual.

- Luego, también se necesita instalar Flask (como complemento de Python) para manejar peticiones en el servidor como un backend básico

```bash
    pip install flask requests
```
- Para acceder a la configuración básica de backend del servidor, revisar el archivo `server.py`.

Luego de tener el instalado flask y el archivo del servidor configurados correctamente, ejecutamos el siguiente comando para arrancar el servidor local en Python.

```bash
    python server.py
```

Cabe resaltar, que es necesario que esta terminal se mantenga activa para tener el servidor abierto, los siguientes pasos deben realizarse en otra terminal desde la raíz del repositorio

### 3. Instalar y Configurar Ngrok

Para empezar se necesita instalar `ngrok` via Chocolatey con el siguiente comando

```bash
choco install ngrok
```

Ejecutar el siguiente comando para añadir el auto-token al archivo de configuración `ngrok.yml`. Las credenciales son generadas en base a una cuenta ya creada en `ngrok`.

```bash
    ngrok config add-authtoken 2wWYQoouQl7qMlsqFtX3qjtfFY7_2Qriqga9QZV5m2xm9zToJ
```


En otra terminal, desde la raiz del archivo, ejecutar:

```bash
    ngrok http --url=constantly-top-goshawk.ngrok-free.app 5000
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