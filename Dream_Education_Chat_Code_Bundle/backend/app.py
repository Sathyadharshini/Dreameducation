from flask import Flask, jsonify
from flask_cors import CORS
from database.database import initialize_database
from routes.subjects import subjects_bp
from routes.progress import progress_bp
from routes.auth import auth_bp
from routes.courses import courses_bp

app = Flask(__name__)
CORS(app)
app.register_blueprint(auth_bp)
app.register_blueprint(courses_bp)
app.register_blueprint(subjects_bp)
app.register_blueprint(progress_bp)
initialize_database()

@app.route('/')
def home():
    return jsonify({'message': 'Dream Education Backend is running!', 'status': 'success'})

@app.route('/api/health')
def health():
    return jsonify({'application': 'Dream Education', 'backend': 'Flask', 'database': 'SQLite', 'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
