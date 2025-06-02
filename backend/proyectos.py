from flask import Blueprint, jsonify, request
from backend.db import db
from bson import ObjectId

proyectos_bp = Blueprint('proyectos', __name__)
proyectos_col = db['proyectos']

@proyectos_bp.route('/proyectos/<usuario_id>', methods=['GET'])
def obtener_proyectos(usuario_id):
    try:
        proyectos = list(proyectos_col.find({"usuario_id": ObjectId(usuario_id)}))
        for p in proyectos:
            p['_id'] = str(p['_id'])
            p['usuario_id'] = str(p['usuario_id'])    
        return jsonify(proyectos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@proyectos_bp.route('/proyectos', methods=['POST'])
def crear_proyecto():
    try:
        data = request.get_json()
        proyecto = {
            "nombre": data.get("nombre"),
            "descripcion": data.get("descripcion"),
            "dificultad": data.get("dificultad"),
            "usuario_id": ObjectId(data.get("usuario_id")),
            "fecha_creacion": data.get("fecha_creacion"),
        }
        result = proyectos_col.insert_one(proyecto)
        return jsonify({"mensaje": "Proyecto creado", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@proyectos_bp.route('/proyectos/del/<proyecto_id>', methods=['DELETE'])
def eliminar_proyecto(proyecto_id):
    try:
        result = proyectos_col.delete_one({"_id": ObjectId(proyecto_id)})
        if result.deleted_count == 1:
            return jsonify({"mensaje": "Proyecto eliminado"}), 200
        else:
            return jsonify({"error": "Proyecto no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500