"""Controller for managing job applications"""
import json
from models.application import JobApplication

# In-memory storage (replace with database for production)
applications_db = {}
app_counter = 0


class ApplicationController:
    """Controller for job application operations"""
    
    @staticmethod
    def create_application(data):
        """Create a new job application"""
        global app_counter
        app_counter += 1
        
        app = JobApplication(
            title=data.get('title'),
            company=data.get('company'),
            status=data.get('status', 'applied'),
            link=data.get('link'),
            notes=data.get('notes')
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
        app.title = data.get('title', app.title)
        app.company = data.get('company', app.company)
        app.status = data.get('status', app.status)
        app.link = data.get('link', app.link)
        app.notes = data.get('notes', app.notes)
        
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
