from flask import Blueprint, request, jsonify
from backend.db import db
from bson import ObjectId
import bcrypt

usuarios_bp = Blueprint('usuarios_bp', __name__)
usuarios_col = db['usuarios']

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

# Función para registar un usuario
@usuarios_bp.route('/usuarios/registrar', methods=['POST'])
def registrar_usuario():
    data = request.get_json()
    nombre = data.get('nombre')
    password = data.get('password')

    if not nombre or not password:
        return jsonify({'error': 'Es obligatorio colocar un nombre y contraseña'}), 400

    if usuarios_col.find_one({'nombre': nombre, 'rol': 'profesor'}):
        return jsonify({'error': 'El nombre ya fue registrado'}), 409

    hashed_password = hash_password(password)
    usuario = {
        'nombre': nombre, 
        'rol': 'profesor',
        'password': hashed_password
    }
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

# Función para ingresar un usuario
@usuarios_bp.route('/usuarios/ingresar', methods=['POST'])
def ingresar_usuario():
    data = request.get_json()
    nombre = data.get('nombre')
    password = data.get('password')

    if not nombre:
        return jsonify({'error': 'Nombre requerido'}), 400

    usuario = usuarios_col.find_one({'nombre': nombre, 'rol': 'profesor'})
    if not usuario:
        return jsonify({'error': 'Este usuario no existe'}), 404

    if 'password' not in usuario or not usuario['password']:
        return jsonify({
            'usuario_id': str(usuario['_id']),
            'debe_actualizar_password': True,
            'mensaje': 'Debe actualizar su contraseña'
        }), 200

    if not password:
        return jsonify({'error': 'Contraseña requerida'}), 400
    
    if check_password(password, usuario['password']):
        return jsonify({'mensaje': 'Usuario ingresado correctamente',
                        'usuario': {
                            '_id': str(usuario['_id']),
                            'nombre': usuario['nombre'],
                            'rol': usuario['rol']
                        }
                    }), 200
    else:
        return jsonify({'error': 'Usuario o Contraseña Incorrectos'}), 401
    
# Función para actualizar la contraseña de un usuario
@usuarios_bp.route('/usuarios/cambiar_password', methods=['POST'])
def cambiar_password():
    data = request.get_json()
    usuario_id = data.get('usuario_id')
    password = data.get('password')

    if not usuario_id or not password:
        return jsonify({'error': 'ID de usuario y contraseña requerida'}), 400

    hashed_pw = hash_password(password)
    result = usuarios_col.update_one(
        {'_id': ObjectId(usuario_id)},
        {'$set': {'password': hashed_pw}}
    )

    if result.modified_count == 1:
        return jsonify({'mensaje': 'Contraseña actualizada exitosamente'}), 200
    else:
        return jsonify({'error': 'No se pudo actualizar la contraseña'}), 500