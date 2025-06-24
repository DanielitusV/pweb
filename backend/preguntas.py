from flask import Blueprint, jsonify, request

#quí db es la conexión a la base de datos MongoDB
from backend.db import db
from bson import ObjectId
# TOOOOODOOO ESTO SI ES UNA API PLASK  ES COMO EL BACKEND AQUI SE ENCARGARA DE CONECTAR CON EL MONGOD DB
proyectos_bp = Blueprint('preguntas', __name__)  # Define un módulo de rutas llamado 'preguntas' OSEA EN LA RUTA SI O SI TENDRA AL INCIAO PREGUNTA 

proyectos_col = db['preguntas']    # Aquí estás "apuntando" a la colección 'preguntas'

#Obtener todas las preguntas de un usuario
@proyectos_bp.route('/preguntas/<usuario_id>', methods=['GET'])
def obtener_proyectos(usuario_id):
    try:
        proyectos = list(proyectos_col.find({"usuario_id": ObjectId(usuario_id)}))
        for p in proyectos:
            p['_id'] = str(p['_id'])
            p['usuario_id'] = str(p['usuario_id'])    
        return jsonify(proyectos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# CREA UNA NUEVA PREGUNTA
@proyectos_bp.route('/preguntas', methods=['POST'])
def crear_proyecto():
    try:
        data = request.get_json()
        pregunta = {
            "nombre": data.get("nombre"),
            "descripcion": data.get("descripcion"),
            "dificultad": data.get("dificultad"),
            "imagen": data.get("imagen"),
            "opciones": data.get("opciones"),  # lista
            "respuesta_correcta": data.get("respuesta_correcta"),
            "usuario_id": ObjectId(data.get("usuario_id")),
            "fecha_creacion": data.get("fecha_creacion")
}
        result = proyectos_col.insert_one(pregunta)
        return jsonify({"mensaje": "Pregunta creada", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#ELIMINA UNA PREGUNTA
@proyectos_bp.route('/preguntas/del/<proyecto_id>', methods=['DELETE'])
def eliminar_proyecto(proyecto_id):
    try:
        result = proyectos_col.delete_one({"_id": ObjectId(proyecto_id)})
        if result.deleted_count == 1:
            return jsonify({"mensaje": "Pregunta eliminada"}), 200
        else:
            return jsonify({"error": "Pregunta no encontrada"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# ✅ Actualizar una pregunta existente
@proyectos_bp.route('/preguntas/update/<pregunta_id>', methods=['PUT'])
def actualizar_pregunta(pregunta_id):
    try:
        data = request.get_json()
        nueva_data = {
            "nombre": data.get("nombre"),
            "descripcion": data.get("descripcion"),
            "dificultad": data.get("dificultad"),
            "imagen": data.get("imagen"),
            "opciones": data.get("opciones"),
            "respuesta_correcta": data.get("respuesta_correcta"),
            "usuario_id": ObjectId(data.get("usuario_id")),
            "fecha_creacion": data.get("fecha_creacion"),
        }

        result = proyectos_col.update_one(
            {"_id": ObjectId(pregunta_id)},
            {"$set": nueva_data}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Pregunta no encontrada"}), 404

        return jsonify({"mensaje": "Pregunta actualizada correctamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500










#VER UNA PREGUNTA ESPECIFICA
@proyectos_bp.route('/preguntas/ver/<pregunta_id>', methods=['GET'])
def obtener_pregunta(pregunta_id):
    try:
        pregunta = proyectos_col.find_one({"_id": ObjectId(pregunta_id)})
        if not pregunta:
            return jsonify({"error": "Pregunta no encontrada"}), 404
        pregunta['_id'] = str(pregunta['_id'])
        pregunta['usuario_id'] = str(pregunta['usuario_id'])
        return jsonify(pregunta), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500