"""Routes for user settings"""
from flask import Blueprint, request, jsonify
from controllers.settings_controller import SettingsController

settings_bp = Blueprint('settings', __name__, url_prefix='/api/settings')


@settings_bp.route('', methods=['GET'])
def get_settings():
    """Get current settings"""
    settings = SettingsController.get_settings()
    return jsonify(settings), 200


@settings_bp.route('/api-key', methods=['POST'])
def set_api_key():
    """Set Gemini API key"""
    data = request.get_json()
    
    if not data or not data.get('api_key'):
        return jsonify({'error': 'API key is required'}), 400
    
    try:
        result = SettingsController.update_api_key(data['api_key'])
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@settings_bp.route('/resume', methods=['POST'])
def set_resume():
    """Set user resume"""
    data = request.get_json()
    
    if not data or not data.get('resume_text'):
        return jsonify({'error': 'Resume text is required'}), 400
    
    try:
        result = SettingsController.update_resume(data['resume_text'])
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@settings_bp.route('/cover-letter', methods=['POST'])
def set_cover_letter():
    """Set cover letter template"""
    data = request.get_json()
    
    if not data or not data.get('cover_letter_template'):
        return jsonify({'error': 'Cover letter template is required'}), 400
    
    try:
        result = SettingsController.update_cover_letter(data['cover_letter_template'])
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@settings_bp.route('/preferences', methods=['GET'])
def get_preferences():
    """Get user preferences"""
    preferences = SettingsController.get_preferences()
    return jsonify(preferences), 200


@settings_bp.route('/preferences', methods=['POST'])
def set_preferences():
    """Update user preferences"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Preferences data is required'}), 400
    
    try:
        result = SettingsController.update_preferences(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
