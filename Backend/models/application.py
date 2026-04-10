from dataclasses import dataclass, field, asdict
from typing import Optional
from datetime import datetime


@dataclass
class Application:
    """
    A record of one job application attempt.
    Created by the orchestrator after apply/skip decision.
    Stored in memory (list) and sent via Telegram at end of day.
    """
    job_title:    str
    company:      str
    platform:     str
    url:          str
    match_score:  float

    status:       str          = "applied"
    # applied / skipped / failed

    skip_reason:  Optional[str] = None
    # e.g. "match score 42% below threshold 60%"
    # e.g. "missing skills: Kubernetes, Go"

    applied_at:   str          = field(
        default_factory=lambda: datetime.utcnow().isoformat()
    )

    def to_dict(self) -> dict:
        return asdict(self)

    def summary_line(self) -> str:
        """One-line string used in the Telegram daily summary."""
        if self.status == "applied":
            return f"✅ {self.job_title} @ {self.company} ({self.platform}) — {self.match_score:.0f}% match"
        elif self.status == "skipped":
            return f"❌ {self.job_title} @ {self.company} — skipped ({self.skip_reason})"
        else:
            return f"⚠️ {self.job_title} @ {self.company} — failed"


@dataclass
class Analytics:
    """Analytics and statistics for applications"""
    total_applications: int = 0
    accepted: int = 0
    rejected: int = 0
    interviews: int = 0
    applied: int = 0
    skipped: int = 0
    failed: int = 0

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class UserSettings:
    """User settings and preferences"""
    api_key: Optional[str] = None
    resume_text: Optional[str] = None
    cover_letter_template: Optional[str] = None
    preferences: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ApplicationBatch:
    """
    A batch of applications started from the extension.
    User selects position, uploads resume, and chooses platforms to apply to.
    """
    batch_id: str
    position: str
    resume_filename: str
    websites: list = field(default_factory=list)
    # websites: ['linkedin', 'indeed', 'glassdoor', 'internshala', 'wellfound', 'ziprecruiter']
    
    total_applications: int = 0
    completed_applications: int = 0
    failed_applications: int = 0
    
    status: str = "pending"
    # pending / in_progress / completed / failed
    
    created_at: str = field(
        default_factory=lambda: datetime.utcnow().isoformat()
    )
    started_at: Optional[str] = None
    completed_at: Optional[str] = None

    def to_dict(self) -> dict:
        return asdict(self)

    def summary(self) -> dict:
        """Get batch summary"""
        return {
            'batch_id': self.batch_id,
            'position': self.position,
            'websites': self.websites,
            'status': self.status,
            'total': self.total_applications,
            'completed': self.completed_applications,
            'failed': self.failed_applications,
            'created_at': self.created_at,
            'started_at': self.started_at,
            'completed_at': self.completed_at,
        }