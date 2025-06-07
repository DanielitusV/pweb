from flask import Blueprint, jsonify, request
from backend.db import db
from bson import ObjectId

proyectos_bp = Blueprint('preguntas', __name__)
proyectos_col = db['preguntas']

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