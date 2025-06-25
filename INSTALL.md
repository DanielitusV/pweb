# Instalación del Proyecto "Interaquiz" - Programación Web (UNIX)

&nbsp;

# Requisitos Previos
- Tener instalado Python 3.12.3 o superior
- `git` y `curl` instalados.

En caso de no tener esos programas, instalar con:
```bash
sudo apt update
sudo apt upgrade
sudo apt install python3.12-venv git curl
```

&nbsp;

# Clonar el Proyecto

1. Crear una carpeta para clonar el proyecto
```bash
mkdir Proyectos
cd Proyectos
```

2. Clonar el repositorio
```bash
git clone https://github.com/DanielitusV/pweb.git
cd pweb
```

&nbsp;

# Crear y Activar el Entorno Virtual
```bash
sudo apt install python3.12-venv
python3 -m venv interaquiz-venv
```

Es necesario que todas las terminales que se vayan a utilizar (mínimo dos) tengan activas el entorno virtual, caso contrario, los siguientes pasos fallarán.
```bash
source interaquiz-venv/bin/activate
```

&nbsp;

# Instalar Dependencias en el Entorno Virtual
Recomendable actualizar pip y luego instalar los paquetes requeridos:
```bash
python3 -m pip install --upgrade pip
pip install flask flask_cors pymongo python-dotenv bcrypt
```

&nbsp;

# Crear y Configurar la Base de Datos en MongoDB Atlas

1. #### Registro y Creación de Proyecto:
    - Registrarse en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
    - Crear un nuevo proyecto (**New Project**), asignar un nombre y continuar.

2. #### Crear un Cluster Gratuito:
    - Clic en **Create** dentro del recuadro "Create a cluster"
    - Selecciona la opción **Free**, elegir proveedor y región (recomendado Amazon y región Brasil), y hacer clic en "Create Deployment" - No es necesaria revisar las configuraciones avanzadas.

3. #### Conectar a Cluster:
    1. **Añadir una conexion por dirección ip (sección IP Address)**: Este paso se hace automáticamente, MongoDB detecta la IP pública actual del dispositivo y permite conexiones a la BD desde esa IP. Posteriormente se puede añadir más IPs como conexiones permitidas (Ejemplo: 0.0.0.0 para permitir cualquier ingreso a la BD - no recomendado en producción)
    2. **Crear las bases de usuario por defecto**: Agregar un nombre de usaurio y una contraseña para completar la creación de la conexión. **Importante guardar estos datos**.

4. #### Administrar con MongoDB Compass (GUI recomendada):
    - Ingresar a [MongoDB Compass](https://mongodb.com/try/download/compass) para descargar la aplicación.
    - Buscar la herramienta **"Mongo DB Compass DownloadGUI"**.
    - Descargar la versión para el sistema operativo correspondiente.


    #### Se pueden omitir los pasos superiores si ya se tiene instalado la herramienta de MongoDB Compass

    - En Atlas (navegador - luego de asignar un usuario y contraseña al cluster), elegir la opción **I have MongoDB Compass Installed** y copiar la URI de conexión de la ventana, por ejemplo:
    ```bash
    mongodb+srv://<usuario>:<contraseña>@<idcluster>.mongodb.net/
    ```
    - Abrir Compass, seleccionar **New Connection**, pegar la URI y conectarse al cluster.
    - Crear una base de datos con nombre reconocible, por ejemplo: **InteraquizDB**.
    - Dentro de la base de datos, crear las dos colecciones principales para el sistema: **preguntas** y **usuarios**.


5. #### Configurar Variables de Entorno:
    - En la raíz del proyecto, crear el archivo `.env`:
    ```bash
    nano .env
    ```
    - Agrega la siguiente línea (ajustar con los datos reales):
    ```bash
    MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<idcluster>.mongodb.net/<nombre-base-de-datos>?retryWrites=true&w=majority
    ```

6. #### Importar Datos de Ejemplo:
    - Descargar los archivos.json (comprimidos en .zip) desde: [Google Drive - Interaquiz-db.zip](https://drive.google.com/drive/folders/1w5fDT-D7iW_SJlblBd_UKpxxAzPVvkq7?usp=sharing)
    - Descomprimir el archivo.

    #### Ahora se tienen dos opciones para poder importar los datos
    1. **Modo Manual**: En Compass, dentro de cada colección (**usuarios** y **preguntas**), clic en el menú desplegable, en la esquina superior izquierda de la aplicación, ... > **Import Data** y seleccionar el archivo .json correspondiente.

    &nbsp;

    2. **Modo Automático**:
        - Copiar los archivos .json dentro de la carpeta raíz del proyecto: `/pweb/docs`
        - Dentro de una consola con el **venv** activo ejecutar el script: `import-mongo-db.py` con el comando:
        ```bash
        python import-mongo-db.py
        ```
        - Este comando importará automáticamente los archivos a la base de datos, siempre y cuando el `.env` esté bien configurado y los archivos .json de importación se mantengan con el nombre original y se encuentren en `pweb/docs`.

7. #### Levantar el Servidor
- Dentro del entorno virtual y carpeta raíz del proyecto, ejecutar el siguiente comando:
```bash
python server.py
```
- El servidor quedará accesible en [`http://localhost:5000`](http://localhost:5000)

8. #### (Opcional) Exponer el servidor con Ngrok
