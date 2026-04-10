from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# Enable CORS
CORS(app)

# Import routes
from routes.applications import applications_bp
from routes.dashboard import dashboard_bp
from routes.settings import settings_bp
from routes.analytics import analytics_bp
from routes.setup import setup_bp

# Register blueprints
app.register_blueprint(applications_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(settings_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(setup_bp)

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    return {'status': 'ok'}, 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return {'error': 'Not found'}, 404

@app.errorhandler(500)
def internal_error(error):
    return {'error': 'Internal server error'}, 500

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
