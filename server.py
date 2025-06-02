from flask import Flask, send_from_directory
from flask_cors import CORS
from backend.usuarios import usuarios_bp
from backend.proyectos import proyectos_bp

app = Flask(__name__, static_folder='.')
CORS(app)

# Endpoints
app.register_blueprint(usuarios_bp)
app.register_blueprint(proyectos_bp)
#

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)