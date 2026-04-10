"""Routes for initial setup"""
from flask import Blueprint, request, jsonify
from controllers.settings_controller import SettingsController

setup_bp = Blueprint('setup', __name__, url_prefix='/api/setup')


@setup_bp.route('/status', methods=['GET'])
def get_setup_status():
    """Check if setup is complete"""
    is_complete = SettingsController.is_setup_complete()
    return jsonify({'setup_complete': is_complete}), 200


@setup_bp.route('/complete', methods=['POST'])
def complete_setup():
    """Complete initial setup with API key and resume"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Setup data is required'}), 400
    
    required_fields = ['api_key', 'resume_text']
    missing_fields = [field for field in required_fields if not data.get(field)]
    
    if missing_fields:
        return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
    
    try:
        SettingsController.update_api_key(data.get('api_key'))
        SettingsController.update_resume(data.get('resume_text'))
        
        if data.get('cover_letter_template'):
            SettingsController.update_cover_letter(data.get('cover_letter_template'))
        
        if data.get('preferences'):
            SettingsController.update_preferences(data.get('preferences'))
        
        return jsonify({'message': 'Setup completed successfully', 'setup_complete': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
