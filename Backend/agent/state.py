from __future__ import annotations
from dataclasses import dataclass, field
from typing import Optional

from models.user import UserProfile
from models.job import Job
from models.application import Application


@dataclass
class AgentState:
    """
    Shared state object passed between every node in the LangGraph graph.
    Each node reads from it and writes back to it.

    Flow:
      START
        → scrape_jobs        (fills raw_jobs)
        → analyze_jobs       (fills analyzed_jobs via JDAnalyzer)
        → score_jobs         (fills scored_jobs, apply_list, skip_list)
        → apply_jobs         (fills applications)
        → send_summary       (sends Telegram notification)
      END
    """

    # ── Input (set before graph starts) ──────────────────────────────────────
    user:             UserProfile = field(default_factory=lambda: UserProfile(
        name="", email="", target_role=""
    ))

    # ── Scraping ──────────────────────────────────────────────────────────────
    raw_jobs:         list[Job]         = field(default_factory=list)
    # All jobs scraped from all platforms before scoring

    # ── Scoring ───────────────────────────────────────────────────────────────
    scored_jobs:      list[Job]         = field(default_factory=list)
    apply_list:       list[Job]         = field(default_factory=list)
    skip_list:        list[Job]         = field(default_factory=list)

    # ── Applications ──────────────────────────────────────────────────────────
    applications:     list[Application] = field(default_factory=list)

    # ── Run metadata ──────────────────────────────────────────────────────────
    current_platform: str               = ""
    errors:           list[str]         = field(default_factory=list)
    status:           str               = "idle"
    # idle → scraping → scoring → applying → notifying → done

    total_scraped:    int                = 0
    total_applied:    int                = 0
    total_skipped:    int                = 0
    total_failed:     int                = 0

    def log_error(self, msg: str) -> None:
        self.errors.append(msg)

    def summary(self) -> dict:
        return {
            "status":        self.status,
            "total_scraped": self.total_scraped,
            "total_applied": self.total_applied,
            "total_skipped": self.total_skipped,
            "total_failed":  self.total_failed,
            "errors":        self.errors,
            "applications":  [a.to_dict() for a in self.applications],
        }