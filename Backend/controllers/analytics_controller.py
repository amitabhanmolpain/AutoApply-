"""Controller for analytics and statistics"""
from models.application import Analytics
from controllers.application_controller import applications_db


class AnalyticsController:
    """Controller for analytics and metrics"""
    
    @staticmethod
    def get_analytics():
        """Get application analytics"""
        total = len(applications_db)
        accepted = sum(1 for app in applications_db.values() if app.status == 'accepted')
        rejected = sum(1 for app in applications_db.values() if app.status == 'rejected')
        interviews = sum(1 for app in applications_db.values() if app.status == 'interview')
        
        analytics = Analytics(
            total_applications=total,
            accepted=accepted,
            rejected=rejected,
            interviews=interviews
        )
        return analytics.to_dict()
    
    @staticmethod
    def get_status_breakdown():
        """Get breakdown by application status"""
        breakdown = {}
        for app in applications_db.values():
            status = app.status
            breakdown[status] = breakdown.get(status, 0) + 1
        return breakdown
    
    @staticmethod
    def get_companies_breakdown():
        """Get breakdown by company"""
        companies = {}
        for app in applications_db.values():
            company = app.company
            companies[company] = companies.get(company, 0) + 1
        return companies
    
    @staticmethod
    def get_recent_applications(limit=5):
        """Get recent applications"""
        from datetime import datetime
        sorted_apps = sorted(
            applications_db.items(),
            key=lambda x: x[1].date_applied,
            reverse=True
        )
        return [{'id': app_id, **app.to_dict()} for app_id, app in sorted_apps[:limit]]
