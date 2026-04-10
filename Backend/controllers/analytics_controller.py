"""Controller for analytics and statistics"""
from models.application import Analytics
from controllers.application_controller import applications_db, batches_db


class AnalyticsController:
    """Controller for analytics and metrics"""
    
    @staticmethod
    def get_analytics():
        """Get application analytics"""
        total = len(applications_db)
        accepted = sum(1 for app in applications_db.values() if app.status == 'accepted')
        rejected = sum(1 for app in applications_db.values() if app.status == 'rejected')
        interviews = sum(1 for app in applications_db.values() if app.status == 'interview')
        applied = sum(1 for app in applications_db.values() if app.status == 'applied')
        
        analytics = Analytics(
            total_applications=total,
            accepted=accepted,
            rejected=rejected,
            interviews=interviews,
            applied=applied
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
            key=lambda x: x[1].applied_at,
            reverse=True
        )
        return [{'id': app_id, **app.to_dict()} for app_id, app in sorted_apps[:limit]]
    
    # ==================== BATCH ANALYTICS ====================
    
    @staticmethod
    def get_batch_analytics():
        """Get batch application statistics"""
        total_batches = len(batches_db)
        pending = sum(1 for batch in batches_db.values() if batch.status == 'pending')
        in_progress = sum(1 for batch in batches_db.values() if batch.status == 'in_progress')
        completed = sum(1 for batch in batches_db.values() if batch.status == 'completed')
        failed = sum(1 for batch in batches_db.values() if batch.status == 'failed')
        
        total_website_applies = sum(batch.total_applications for batch in batches_db.values())
        total_completed_applies = sum(batch.completed_applications for batch in batches_db.values())
        total_failed_applies = sum(batch.failed_applications for batch in batches_db.values())
        
        return {
            'total_batches': total_batches,
            'batches_by_status': {
                'pending': pending,
                'in_progress': in_progress,
                'completed': completed,
                'failed': failed
            },
            'total_website_applications': total_website_applies,
            'completed_applications': total_completed_applies,
            'failed_applications': total_failed_applies,
            'success_rate': (
                f"{(total_completed_applies / total_website_applies) * 100:.1f}%" 
                if total_website_applies > 0 else "0%"
            )
        }
    
    @staticmethod
    def get_top_positions():
        """Get most common applied positions"""
        positions = {}
        for batch in batches_db.values():
            position = batch.position
            positions[position] = positions.get(position, 0) + batch.total_applications
        
        # Sort by count descending
        sorted_positions = sorted(
            positions.items(),
            key=lambda x: x[1],
            reverse=True
        )
        return [{'position': pos, 'applications': count} for pos, count in sorted_positions]
    
    @staticmethod
    def get_popular_websites():
        """Get most popular job websites for applications"""
        websites = {}
        for batch in batches_db.values():
            for website in batch.websites:
                websites[website] = websites.get(website, 0) + 1
        
        # Sort by count descending
        sorted_websites = sorted(
            websites.items(),
            key=lambda x: x[1],
            reverse=True
        )
        return [{'website': site, 'applications': count} for site, count in sorted_websites]
