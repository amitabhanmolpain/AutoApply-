"""Controller for managing job applications"""
import json
import uuid
from datetime import datetime
from models.application import Application, ApplicationBatch

# In-memory storage (replace with database for production)
applications_db = {}
batches_db = {}
app_counter = 0


class ApplicationController:
    """Controller for job application operations"""
    
    @staticmethod
    def create_application(data):
        """Create a new job application"""
        global app_counter
        app_counter += 1
        
        app = Application(
            job_title=data.get('job_title'),
            company=data.get('company'),
            platform=data.get('platform'),
            url=data.get('url'),
            match_score=data.get('match_score', 0.0),
            status=data.get('status', 'applied'),
            skip_reason=data.get('skip_reason')
        )
        
        applications_db[app_counter] = app
        return {'id': app_counter, **app.to_dict()}
    
    @staticmethod
    def get_all_applications():
        """Get all job applications"""
        return [{'id': app_id, **app.to_dict()} for app_id, app in applications_db.items()]
    
    @staticmethod
    def get_application(app_id):
        """Get a specific application by ID"""
        if app_id in applications_db:
            return {'id': app_id, **applications_db[app_id].to_dict()}
        return None
    
    @staticmethod
    def update_application(app_id, data):
        """Update an application"""
        if app_id not in applications_db:
            return None
        
        app = applications_db[app_id]
        app.job_title = data.get('job_title', app.job_title)
        app.company = data.get('company', app.company)
        app.platform = data.get('platform', app.platform)
        app.url = data.get('url', app.url)
        app.match_score = data.get('match_score', app.match_score)
        app.status = data.get('status', app.status)
        app.skip_reason = data.get('skip_reason', app.skip_reason)
        
        return {'id': app_id, **app.to_dict()}
    
    @staticmethod
    def delete_application(app_id):
        """Delete an application"""
        if app_id in applications_db:
            del applications_db[app_id]
            return True
        return False
    
    @staticmethod
    def get_applications_by_status(status):
        """Get applications filtered by status"""
        return [
            {'id': app_id, **app.to_dict()} 
            for app_id, app in applications_db.items() 
            if app.status == status
        ]
    
    # ==================== BATCH APPLICATIONS ====================
    
    @staticmethod
    def start_batch_apply(data):
        """Start a batch of applications from extension"""
        # Validate required fields
        position = data.get('position')
        resume_filename = data.get('fileName')
        websites = data.get('websites', [])
        
        if not position or not resume_filename or not websites:
            return {
                'success': False,
                'error': 'Missing required fields: position, fileName, websites'
            }
        
        # Create batch
        batch_id = str(uuid.uuid4())
        batch = ApplicationBatch(
            batch_id=batch_id,
            position=position,
            resume_filename=resume_filename,
            websites=websites,
            total_applications=len(websites),
            status='pending'
        )
        
        batches_db[batch_id] = batch
        
        return {
            'success': True,
            'batch_id': batch_id,
            'message': f'Batch apply started for {position} on {len(websites)} websites',
            'batch': batch.summary()
        }
    
    @staticmethod
    def get_batch(batch_id):
        """Get batch status"""
        if batch_id not in batches_db:
            return None
        
        batch = batches_db[batch_id]
        return {
            'batch_id': batch.batch_id,
            **batch.summary()
        }
    
    @staticmethod
    def update_batch_status(batch_id, status, started_at=None, completed_at=None):
        """Update batch status"""
        if batch_id not in batches_db:
            return None
        
        batch = batches_db[batch_id]
        batch.status = status
        if started_at:
            batch.started_at = started_at
        if completed_at:
            batch.completed_at = completed_at
        
        return batch.summary()
    
    @staticmethod
    def update_batch_application_count(batch_id, completed_count, failed_count):
        """Update completed/failed application counts"""
        if batch_id not in batches_db:
            return None
        
        batch = batches_db[batch_id]
        batch.completed_applications = completed_count
        batch.failed_applications = failed_count
        
        # Update status if all completed
        if completed_count + failed_count == batch.total_applications:
            batch.status = 'completed'
            batch.completed_at = datetime.utcnow().isoformat()
        
        return batch.summary()
    
    @staticmethod
    def get_all_batches():
        """Get all application batches"""
        return [
            {'batch_id': batch_id, **batch.summary()} 
            for batch_id, batch in batches_db.items()
        ]
    
    @staticmethod
    def get_recent_batches(limit=5):
        """Get recent application batches"""
        sorted_batches = sorted(
            batches_db.items(),
            key=lambda x: x[1].created_at,
            reverse=True
        )
        return [
            {'batch_id': batch_id, **batch.summary()}
            for batch_id, batch in sorted_batches[:limit]
        ]
