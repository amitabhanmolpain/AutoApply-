"""Routes for managing job applications"""
from flask import Blueprint, request, jsonify
from controllers.application_controller import ApplicationController

applications_bp = Blueprint('applications', __name__, url_prefix='/api/applications')


@applications_bp.route('', methods=['GET'])
def get_applications():
    """Get all applications or filter by status"""
    status = request.args.get('status')
    
    if status:
        applications = ApplicationController.get_applications_by_status(status)
    else:
        applications = ApplicationController.get_all_applications()
    
    return jsonify(applications), 200


@applications_bp.route('/<int:app_id>', methods=['GET'])
def get_application(app_id):
    """Get a specific application"""
    application = ApplicationController.get_application(app_id)
    
    if not application:
        return jsonify({'error': 'Application not found'}), 404
    
    return jsonify(application), 200


@applications_bp.route('', methods=['POST'])
def create_application():
    """Create a new application"""
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('company'):
        return jsonify({'error': 'Missing required fields: title, company'}), 400
    
    try:
        application = ApplicationController.create_application(data)
        return jsonify(application), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@applications_bp.route('/<int:app_id>', methods=['PUT'])
def update_application(app_id):
    """Update an application"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        application = ApplicationController.update_application(app_id, data)
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        return jsonify(application), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@applications_bp.route('/<int:app_id>', methods=['DELETE'])
def delete_application(app_id):
    """Delete an application"""
    try:
        if ApplicationController.delete_application(app_id):
            return jsonify({'message': 'Application deleted'}), 200
        else:
            return jsonify({'error': 'Application not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
