"""Controller for user profile data"""
from db import get_collection
from datetime import datetime
from bson import ObjectId


class UserProfileController:
    """Controller for managing user profile (resume, position, etc)"""
    
    @staticmethod
    def get_or_create_profile():
        """Get user profile or create if doesn't exist"""
        print('[UserProfile] Getting or creating default user profile')
        collection = get_collection('user_profiles')
        if collection is None:
            print('[UserProfile] ERROR: Could not get collection')
            return {'error': 'Database connection failed'}
        
        # For now, we have one default user (no auth)
        # In production, this would be user-specific
        profile = collection.find_one({'_id': 'default_user'})
        
        if not profile:
            print('[UserProfile] Creating new default user profile')
            # Create default profile
            profile = {
                '_id': 'default_user',
                'position': None,
                'resume_text': None,
                'resume_filename': None,
                'resume_uploaded_at': None,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
            }
            collection.insert_one(profile)
            print('[UserProfile] Created default user profile')
        else:
            print('[UserProfile] Found existing default user profile')
        
        return profile
    
    @staticmethod
    def update_position(position):
        """Update user's target position"""
        print(f'[UserProfile] Updating position to: {position}')
        collection = get_collection('user_profiles')
        if collection is None:
            print('[UserProfile] ERROR: Could not get collection')
            return {'error': 'Database connection failed'}
        
        print('[UserProfile] Executing update_one on MongoDB')
        result = collection.update_one(
            {'_id': 'default_user'},
            {
                '$set': {
                    'position': position,
                    'updated_at': datetime.utcnow(),
                }
            },
            upsert=True
        )
        
        print(f'[UserProfile] Update result - modified_count: {result.modified_count}, upserted_id: {result.upserted_id}')
        return {
            'success': True,
            'position': position,
            'modified_count': result.modified_count or result.upserted_id is not None
        }
    
    @staticmethod
    def update_resume(resume_text, filename):
        """Update user's resume"""
        print(f'[UserProfile] Updating resume - filename: {filename}, size: {len(resume_text)} bytes')
        collection = get_collection('user_profiles')
        if collection is None:
            print('[UserProfile] ERROR: Could not get collection')
            return {'error': 'Database connection failed'}
        
        print('[UserProfile] Executing update_one on MongoDB')
        result = collection.update_one(
            {'_id': 'default_user'},
            {
                '$set': {
                    'resume_text': resume_text,
                    'resume_filename': filename,
                    'resume_uploaded_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow(),
                }
            },
            upsert=True
        )
        
        print(f'[UserProfile] Update result - modified_count: {result.modified_count}, upserted_id: {result.upserted_id}')
        return {
            'success': True,
            'filename': filename,
            'resume_size': len(resume_text),
            'modified_count': result.modified_count or result.upserted_id is not None
        }
    
    @staticmethod
    def get_profile():
        """Get user profile"""
        print('[UserProfile] Getting user profile')
        profile = UserProfileController.get_or_create_profile()
        
        if isinstance(profile, dict) and 'error' in profile:
            print(f'[UserProfile] ERROR: {profile}')
            return profile
        
        print('[UserProfile] Profile found, returning safe response')
        # Return profile data needed by frontend pages
        return {
            'position': profile.get('position'),
            'resume_text': profile.get('resume_text'),
            'resume_filename': profile.get('resume_filename'),
            'resume_uploaded_at': profile.get('resume_uploaded_at'),
            'has_resume': bool(profile.get('resume_text')),
            'created_at': profile.get('created_at'),
            'updated_at': profile.get('updated_at'),
        }
    
    @staticmethod
    def get_resume_text():
        """Get user's resume text"""
        collection = get_collection('user_profiles')
        if collection is None:
            return None
        
        profile = collection.find_one({'_id': 'default_user'})
        return profile.get('resume_text') if profile else None
    
    @staticmethod
    def clear_profile():
        """Clear user profile data"""
        collection = get_collection('user_profiles')
        if collection is None:
            return {'error': 'Database connection failed'}
        
        result = collection.update_one(
            {'_id': 'default_user'},
            {
                '$set': {
                    'position': None,
                    'resume_text': None,
                    'resume_filename': None,
                    'resume_uploaded_at': None,
                    'updated_at': datetime.utcnow(),
                }
            }
        )
        
        return {
            'success': True,
            'message': 'Profile cleared',
            'modified_count': result.modified_count
        }
