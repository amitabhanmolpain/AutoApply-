"""Resume parsing agent for extracting structured candidate profile fields."""
from __future__ import annotations

import re
from typing import Any

from parsers.resume_parser import ResumeParser


class ResumeProfileAgent:
    """Agent that parses resume text into structured fields for autofill."""

    def __init__(self) -> None:
        self.parser = ResumeParser()

    def parse_resume_text(self, resume_text: str) -> dict[str, Any]:
        if not resume_text or not resume_text.strip():
            raise ValueError("Resume text is empty")

        # Reuse existing parser logic to keep extraction consistent across backend.
        parsed = self.parser._parse_text(resume_text)
        parsed_dict = parsed.to_dict()

        name = parsed_dict.get("name") or ""
        first_name, last_name = self._split_name(name)

        profile = {
            "full_name": name,
            "first_name": first_name,
            "last_name": last_name,
            "email": parsed_dict.get("email"),
            "phone": parsed_dict.get("phone"),
            "linkedin": parsed_dict.get("linkedin"),
            "github": parsed_dict.get("github"),
            "portfolio": self._extract_portfolio(resume_text),
            "location": self._extract_location(resume_text),
            "summary": parsed_dict.get("summary"),
            "skills": parsed_dict.get("skills", []),
            "experience": parsed_dict.get("experience", []),
            "education": parsed_dict.get("education", []),
            "projects": parsed_dict.get("projects", []),
            "certifications": parsed_dict.get("certifications", []),
            "current_title": self._extract_current_title(parsed_dict.get("experience", [])),
        }

        profile["completeness"] = {
            "required": ["full_name", "email", "phone"],
            "filled": [k for k in ["full_name", "email", "phone"] if profile.get(k)],
        }

        return profile

    @staticmethod
    def _split_name(full_name: str) -> tuple[str, str]:
        parts = [p for p in full_name.split() if p]
        if not parts:
            return "", ""
        if len(parts) == 1:
            return parts[0], ""
        return parts[0], " ".join(parts[1:])

    @staticmethod
    def _extract_portfolio(text: str) -> str | None:
        patterns = [
            r"(https?://(?:www\.)?portfolio\.[^\s]+)",
            r"(https?://(?:www\.)?behance\.net/[^\s]+)",
            r"(https?://(?:www\.)?dribbble\.com/[^\s]+)",
            r"(https?://(?:www\.)?[a-zA-Z0-9-]+\.(?:dev|me|io)/?[^\s]*)",
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        return None

    @staticmethod
    def _extract_location(text: str) -> str | None:
        # Light heuristic: looks for "City, State" or "City, Country" near the top of resume.
        first_chunk = "\n".join(text.splitlines()[:12])
        match = re.search(r"\b([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?),\s([A-Z][a-zA-Z]+)\b", first_chunk)
        if match:
            return f"{match.group(1)}, {match.group(2)}"
        return None

    @staticmethod
    def _extract_current_title(experience: list[dict[str, Any]]) -> str | None:
        if not experience:
            return None
        first = experience[0]
        return first.get("title") if isinstance(first, dict) else None
