from dataclasses import dataclass, field, asdict
from typing import Optional


@dataclass
class Education:
    degree: str
    institution: str
    year: str = ""
    gpa: str = ""

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class Experience:
    title: str
    company: str
    duration: str = ""
    bullets: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class Project:
    name: str
    description: str = ""
    tech_stack: list[str] = field(default_factory=list)
    bullets: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ParsedResume:
    raw_text: str
    name: str
    email: Optional[str]
    phone: Optional[str]
    linkedin: Optional[str]
    github: Optional[str]
    summary: Optional[str]
    skills: list[str]
    experience: list[Experience]
    education: list[Education]
    projects: list[Project]
    certifications: list[str]

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "linkedin": self.linkedin,
            "github": self.github,
            "summary": self.summary,
            "skills": self.skills,
            "experience": [e.to_dict() for e in self.experience],
            "education": [e.to_dict() for e in self.education],
            "projects": [p.to_dict() for p in self.projects],
            "certifications": self.certifications,
        }

    def skills_set(self) -> set[str]:
        """Lowercase set of skills — used by match scorer."""
        return {s.lower() for s in self.skills}

    def all_text(self) -> str:
        """
        Full flattened text of the resume — fed to the embeddings model
        for semantic matching against job descriptions.
        """
        parts = [self.raw_text]
        if self.summary:
            parts.append(self.summary)
        for exp in self.experience:
            parts.append(f"{exp.title} at {exp.company}")
            parts.extend(exp.bullets)
        for proj in self.projects:
            parts.append(proj.name)
            parts.extend(proj.bullets)
            parts.extend(proj.tech_stack)
        return " ".join(parts)