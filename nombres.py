from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["InteraquizDB"]

# Consulta para obtener solo el campo "nombre" de todos los documentos en "usuarios"
usuarios = db.usuarios.find({}, {"_id": 0, "nombre": 1})

print("Nombres en la colección usuarios:")
for usuario in usuarios:
    print(usuario["nombre"])
