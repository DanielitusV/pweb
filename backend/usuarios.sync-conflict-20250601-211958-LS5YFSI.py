from flask import Blueprint, request, jsonify
from backend.db import db

usuarios_bp = Blueprint('usuarios_bp', __name__)
usuarios_col = db['usuarios']

@usuarios_bp.route('/usuarios/registrar', methods=['POST'])
def registrar_usuario():
    data = request.get_json()
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'Es obligatorio colocar un nombre'}), 400

    if usuarios_col.find_one({'nombre': nombre, 'rol': 'profesor'}):
        return jsonify({'error': 'El nombre ya fue registrado'}), 409

    usuario = {'nombre': nombre, 'rol': 'profesor'}
    result = usuarios_col.insert_one(usuario)

    response_usuario = {
        '_id': str(result.inserted_id),
        'nombre': usuario['nombre'],
        'rol': usuario['rol']
    }

    return jsonify({
        'mensaje': 'Usuario registrado',
        'usuario': response_usuario
    }), 200

@usuarios_bp.route('/usuarios/ingresar', methods=['POST'])
def ingresar_usuario():
    data = request.get_json()
    nombre = data.get('nombre')

    if not nombre:
        return jsonify({'error': 'Nombre requerido'}), 400

    usuario = usuarios_col.find_one({'nombre': nombre, 'rol': 'profesor'})
    if usuario:
        return jsonify({'mensaje': 'Usuario encontrado', 'usuario': {'nombre': usuario['nombre'], 'rol': usuario['rol']}}), 200
    else:
        return jsonify({'error': 'Nombre no registrado'}), 404

