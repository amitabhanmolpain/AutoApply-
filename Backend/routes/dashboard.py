"""Routes for dashboard"""
from flask import Blueprint, jsonify
from controllers.analytics_controller import AnalyticsController
from controllers.application_controller import ApplicationController

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')


@dashboard_bp.route('', methods=['GET'])
def get_dashboard_data():
    """Get dashboard overview data"""
    analytics = AnalyticsController.get_analytics()
    recent = AnalyticsController.get_recent_applications(5)
    status_breakdown = AnalyticsController.get_status_breakdown()
    
    return jsonify({
        'analytics': analytics,
        'recent_applications': recent,
        'status_breakdown': status_breakdown
    }), 200


@dashboard_bp.route('/summary', methods=['GET'])
def get_summary():
    """Get summary statistics"""
    analytics = AnalyticsController.get_analytics()
    
    return jsonify({
        'total_applications': analytics['total_applications'],
        'accepted': analytics['accepted'],
        'success_rate': analytics['success_rate']
    }), 200
