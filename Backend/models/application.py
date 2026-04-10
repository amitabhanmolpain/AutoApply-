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