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
            p[usuario_id] = str(p['usuario_id'])    
        return jsonify(proyectos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500