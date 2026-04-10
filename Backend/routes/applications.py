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


# ==================== BATCH APPLICATIONS ====================

@applications_bp.route('/batch/start', methods=['POST'])
def start_batch_apply():
    """Start a batch of applications"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        result = ApplicationController.start_batch_apply(data)
        
        if not result.get('success'):
            return jsonify(result), 400
        
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@applications_bp.route('/batch/<batch_id>', methods=['GET'])
def get_batch(batch_id):
    """Get batch status"""
    try:
        batch = ApplicationController.get_batch(batch_id)
        
        if not batch:
            return jsonify({'error': 'Batch not found'}), 404
        
        return jsonify(batch), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@applications_bp.route('/batch', methods=['GET'])
def get_all_batches():
    """Get all application batches"""
    try:
        batches = ApplicationController.get_all_batches()
        return jsonify({'batches': batches, 'total': len(batches)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@applications_bp.route('/batch/<batch_id>', methods=['PUT'])
def update_batch(batch_id):
    """Update batch status"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        status = data.get('status')
        started_at = data.get('started_at')
        completed_at = data.get('completed_at')
        
        if status:
            batch = ApplicationController.update_batch_status(
                batch_id, status, started_at, completed_at
            )
        else:
            # Update application counts
            completed = data.get('completed_applications', 0)
            failed = data.get('failed_applications', 0)
            batch = ApplicationController.update_batch_application_count(
                batch_id, completed, failed
            )
        
        if not batch:
            return jsonify({'error': 'Batch not found'}), 404
        
        return jsonify(batch), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
