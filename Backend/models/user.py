from dataclasses import dataclass, field, asdict
from typing import Optional


@dataclass
class UserProfile:
    """
    Built from the parsed resume + role selection on the frontend.
    Passed into the agent as the starting context for every run.
    """
    # From resume parser
    name:          str
    email:         str
    phone:         Optional[str]       = None
    linkedin:      Optional[str]       = None
    github:        Optional[str]       = None
    summary:       Optional[str]       = None
    skills:        list[str]           = field(default_factory=list)
    experience:    list[dict]          = field(default_factory=list)
    education:     list[dict]          = field(default_factory=list)
    projects:      list[dict]          = field(default_factory=list)
    certifications: list[str]          = field(default_factory=list)
    raw_resume_text: str               = ""

    # From role selector on frontend
    target_role:   str                 = ""
    # e.g. "Backend Intern", "ML Engineer", "Full Stack Developer"

    target_locations: list[str]        = field(default_factory=list)
    # e.g. ["Bangalore", "Remote"]

    match_threshold: float             = 60.0
    # minimum match % to auto-apply

    platforms:     list[str]           = field(
        default_factory=lambda: ["linkedin", "wellfound", "internshala", "indeed"]
    )

    def to_dict(self) -> dict:
        return asdict(self)

    def skills_set(self) -> set[str]:
        return {s.lower() for s in self.skills}

    @classmethod
    def from_parsed_resume(cls, parsed: dict, target_role: str,
                           target_locations: list[str] | None = None) -> "UserProfile":
        """
        Build a UserProfile directly from ParsedResume.to_dict() output.
        Called in resume_controller.py after parsing.
        """
        return cls(
            name             = parsed.get("name", ""),
            email            = parsed.get("email", ""),
            phone            = parsed.get("phone"),
            linkedin         = parsed.get("linkedin"),
            github           = parsed.get("github"),
            summary          = parsed.get("summary"),
            skills           = parsed.get("skills", []),
            experience       = parsed.get("experience", []),
            education        = parsed.get("education", []),
            projects         = parsed.get("projects", []),
            certifications   = parsed.get("certifications", []),
            raw_resume_text  = parsed.get("raw_text", ""),
            target_role      = target_role,
            target_locations = target_locations or ["Remote"],
        )