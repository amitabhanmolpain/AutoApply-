from dataclasses import dataclass, field, asdict
from typing import Optional
from datetime import datetime


@dataclass
class Job:
    """
    Represents a single job posting scraped from any platform.
    Populated by scrappers/, scored by scorers/, applied via filler/.
    """
    title:        str
    company:      str
    location:     str                  = ""
    url:          str                  = ""
    platform:     str                  = ""   
    description:  str                  = ""
    is_remote:    bool                 = False

    match_score:  float                = 0.0  # 0.0 – 100.0
    matched_skills:   list[str]        = field(default_factory=list)
    missing_skills:   list[str]        = field(default_factory=list)
 
    # Set by orchestrator after decision
    status:       str                  = "pending"
    # pending → scored → applied / skipped / failed
    skip_reason:  Optional[str]        = None
 
    scraped_at:   str                  = field(
        default_factory=lambda: datetime.utcnow().isoformat()
    )
 
    def to_dict(self) -> dict:
        return asdict(self)
 
    def is_good_fit(self, threshold: float = 60.0) -> bool:
        return self.match_score >= threshold
 