import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')
if not MONGO_URI:
    raise ValueError("ERROR: No se encontró la variable MONGO_URI en el archivo .env")

client = MongoClient(MONGO_URI)
db = client.get_database()

colecciones = {
    "usuarios" : "docs/InteraquizDB.usuarios.json",
    "preguntas" : "docs/InteraquizDB.preguntas.json"
}

for coleccion, archivo in colecciones.items():
    ruta = os.path.join(os.path.dirname(__file__), archivo)
    if not os.path.exists(ruta):
        print(f"ERROR: El archivo {archivo} no encontrado. Saltando {coleccion}...")
        continue

    with open(ruta, 'r', encoding='utf-8') as f:
        datos = json.load(f)

        if not isinstance(datos, list):
            datos = [datos]

        for d in datos:
            if '_id' in d:
                del d['_id']

    db[coleccion].delete_many({})

    if datos:
        db[coleccion].insert_many(datos)
        print(f"Se importaron {len(datos)} documentos en la colección '{coleccion}'.")
    else:
        print(f"No hay datos para importar en {coleccion}")

print("Importación finalizada.")