"""Models for AutoApply application"""
from datetime import datetime

class JobApplication:
    """Model for job applications"""
    def __init__(self, title, company, status='applied', link=None, date_applied=None, notes=None):
        self.title = title
        self.company = company
        self.status = status  # applied, interview, rejected, accepted, pending
        self.link = link
        self.date_applied = date_applied or datetime.now().isoformat()
        self.notes = notes or ''
    
    def to_dict(self):
        return {
            'title': self.title,
            'company': self.company,
            'status': self.status,
            'link': self.link,
            'date_applied': self.date_applied,
            'notes': self.notes
        }


class UserSettings:
    """Model for user settings"""
    def __init__(self, api_key=None, resume_text=None, cover_letter_template=None, preferences=None):
        self.api_key = api_key or ''
        self.resume_text = resume_text or ''
        self.cover_letter_template = cover_letter_template or ''
        self.preferences = preferences or {}
    
    def to_dict(self):
        return {
            'api_key': bool(self.api_key),  # Don't expose actual key
            'resume_text': bool(self.resume_text),
            'cover_letter_template': bool(self.cover_letter_template),
            'preferences': self.preferences
        }


class Analytics:
    """Model for analytics data"""
    def __init__(self, total_applications=0, accepted=0, rejected=0, interviews=0):
        self.total_applications = total_applications
        self.accepted = accepted
        self.rejected = rejected
        self.interviews = interviews
    
    def to_dict(self):
        success_rate = (self.accepted / self.total_applications * 100) if self.total_applications > 0 else 0
        return {
            'total_applications': self.total_applications,
            'accepted': self.accepted,
            'rejected': self.rejected,
            'interviews': self.interviews,
            'success_rate': round(success_rate, 2)
        }
