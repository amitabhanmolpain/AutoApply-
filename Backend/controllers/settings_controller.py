"""Controller for managing user settings"""
from models.application import UserSettings

# In-memory storage (replace with database for production)
user_settings = UserSettings()


class SettingsController:
    """Controller for user settings and preferences"""
    
    @staticmethod
    def get_settings():
        """Get current user settings"""
        return user_settings.to_dict()
    
    @staticmethod
    def update_api_key(api_key):
        """Update API key for Gemini"""
        user_settings.api_key = api_key
        return {'message': 'API key updated'}
    
    @staticmethod
    def update_resume(resume_text):
        """Update user's resume"""
        user_settings.resume_text = resume_text
        return {'message': 'Resume updated'}
    
    @staticmethod
    def update_cover_letter(cover_letter_template):
        """Update cover letter template"""
        user_settings.cover_letter_template = cover_letter_template
        return {'message': 'Cover letter template updated'}
    
    @staticmethod
    def update_preferences(preferences):
        """Update user preferences"""
        user_settings.preferences = preferences
        return {'message': 'Preferences updated', 'preferences': preferences}
    
    @staticmethod
    def get_preferences():
        """Get user preferences"""
        return user_settings.preferences
    
    @staticmethod
    def is_setup_complete():
        """Check if initial setup is complete"""
        return bool(user_settings.api_key and user_settings.resume_text)
