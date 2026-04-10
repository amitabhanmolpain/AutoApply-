"""Routes for user profile management"""
from flask import Blueprint, request, jsonify
from controllers.user_profile_controller import UserProfileController
import traceback

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')


@profile_bp.route('', methods=['GET'])
def get_profile():
    """Get user profile"""
    try:
        print('[Profile] GET /api/profile request received')
        profile = UserProfileController.get_profile()
        if isinstance(profile, dict) and 'error' in profile:
            print(f'[Profile] ERROR from controller: {profile}')
            return jsonify(profile), 500
        print(f'[Profile] Response: {profile}')
        return jsonify(profile), 200
    except Exception as e:
        print(f'[Profile] ERROR in get_profile: {type(e).__name__}: {e}')
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@profile_bp.route('/position', methods=['POST'])
def update_position():
    """Update user's target position"""
    data = request.get_json()
    print(f'[Profile] POST /api/profile/position - data: {data}')
    
    if not data or not data.get('position'):
        print('[Profile] ERROR: Missing position field')
        return jsonify({'error': 'Missing position field'}), 400
    
    try:
        print(f'[Profile] Calling UserProfileController.update_position("{data.get("position")}")')
        result = UserProfileController.update_position(data.get('position'))
        print(f'[Profile] Controller result: {result}')
        
        if 'error' in result:
            print(f'[Profile] ERROR from controller: {result}')
            return jsonify(result), 500
        
        print(f'[Profile] Success: {result}')
        return jsonify(result), 200
    except Exception as e:
        print(f'[Profile] EXCEPTION in update_position: {type(e).__name__}: {e}')
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@profile_bp.route('/resume', methods=['POST'])
def update_resume():
    """Update user's resume"""
    data = request.get_json()
    resume_preview = data.get('resume_text', '')[:50] + '...' if data and data.get('resume_text') else 'None'
    filename = data.get('filename', 'None') if data else 'No data'
    print(f'[Profile] POST /api/profile/resume - filename: {filename}, preview: {resume_preview}')
    
    if not data or not data.get('resume_text') or not data.get('filename'):
        print('[Profile] ERROR: Missing resume_text or filename')
        return jsonify({'error': 'Missing resume_text or filename'}), 400
    
    try:
        print(f'[Profile] Resume size: {len(data.get("resume_text"))} bytes')
        result = UserProfileController.update_resume(
            data.get('resume_text'),
            data.get('filename')
        )
        print(f'[Profile] Controller result: {result}')
        
        if 'error' in result:
            print(f'[Profile] ERROR from controller: {result}')
            return jsonify(result), 500
        
        print(f'[Profile] Success: {result}')
        return jsonify(result), 200
    except Exception as e:
        print(f'[Profile] EXCEPTION in update_resume: {type(e).__name__}: {e}')
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@profile_bp.route('/resume/upload', methods=['POST'])
def upload_resume_file():
    """Upload resume file and parse structured profile fields."""
    print('[Profile] POST /api/profile/resume/upload request received')

    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'Missing resume file'}), 400

        resume_file = request.files['resume']
        if not resume_file or not resume_file.filename:
            return jsonify({'error': 'Invalid resume file'}), 400

        file_bytes = resume_file.read()
        result = UserProfileController.upload_resume_file(file_bytes, resume_file.filename)

        if 'error' in result:
            print(f'[Profile] ERROR from controller: {result}')
            return jsonify(result), 400

        return jsonify(result), 200
    except Exception as e:
        print(f'[Profile] EXCEPTION in upload_resume_file: {type(e).__name__}: {e}')
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@profile_bp.route('/clear', methods=['POST'])
def clear_profile():
    """Clear user profile data"""
    print('[Profile] POST /api/profile/clear request received')
    try:
        result = UserProfileController.clear_profile()
        print(f'[Profile] Clear result: {result}')
        
        if 'error' in result:
            print(f'[Profile] ERROR from controller: {result}')
            return jsonify(result), 500
        
        print(f'[Profile] Profile cleared successfully')
        return jsonify(result), 200
    except Exception as e:
        print(f'[Profile] EXCEPTION in clear_profile: {type(e).__name__}: {e}')
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@profile_bp.route('/parsed', methods=['GET'])
def get_parsed_profile():
    """Get parsed resume profile fields for extension autofill."""
    print('[Profile] GET /api/profile/parsed request received')
    try:
        result = UserProfileController.get_parsed_resume_profile()
        if 'error' in result:
            print(f'[Profile] ERROR from controller: {result}')
            return jsonify(result), 400

        return jsonify(result), 200
    except Exception as e:
        print(f'[Profile] EXCEPTION in get_parsed_profile: {type(e).__name__}: {e}')
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
