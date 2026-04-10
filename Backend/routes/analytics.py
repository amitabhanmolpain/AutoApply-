"""Routes for analytics and statistics"""
from flask import Blueprint, jsonify
from controllers.analytics_controller import AnalyticsController

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')


@analytics_bp.route('', methods=['GET'])
def get_analytics():
    """Get overall analytics"""
    analytics = AnalyticsController.get_analytics()
    return jsonify(analytics), 200


@analytics_bp.route('/status-breakdown', methods=['GET'])
def get_status_breakdown():
    """Get breakdown by application status"""
    breakdown = AnalyticsController.get_status_breakdown()
    return jsonify(breakdown), 200


@analytics_bp.route('/companies-breakdown', methods=['GET'])
def get_companies_breakdown():
    """Get breakdown by company"""
    companies = AnalyticsController.get_companies_breakdown()
    return jsonify(companies), 200


@analytics_bp.route('/recent', methods=['GET'])
def get_recent_applications():
    """Get recent applications"""
    limit = request.args.get('limit', 5, type=int)
    recent = AnalyticsController.get_recent_applications(limit)
    return jsonify(recent), 200
