import re
from typing import Optional
from dataclasses import dataclass, field, asdict


# ── Experience level keywords ─────────────────────────────────────────────────
EXPERIENCE_LEVELS = {
    "intern":     ["intern", "internship", "fresher", "trainee", "apprentice"],
    "junior":     ["junior", "entry level", "entry-level", "0-2 years", "1-2 years", "graduate"],
    "mid":        ["mid level", "mid-level", "2-4 years", "3-5 years", "2+ years", "3+ years"],
    "senior":     ["senior", "sr.", "5+ years", "lead", "5-8 years", "experienced"],
}

# ── Role type keywords ────────────────────────────────────────────────────────
ROLE_TYPES = {
    "backend":    ["backend", "back-end", "back end", "server", "api", "django", "flask", "fastapi", "node"],
    "frontend":   ["frontend", "front-end", "front end", "ui", "react", "vue", "angular", "nextjs"],
    "fullstack":  ["full stack", "fullstack", "full-stack", "mern", "mean", "end-to-end"],
    "ml":         ["machine learning", "ml engineer", "deep learning", "nlp", "computer vision", "data scientist"],
    "devops":     ["devops", "sre", "cloud", "infrastructure", "kubernetes", "docker", "ci/cd", "platform"],
    "data":       ["data engineer", "data analyst", "etl", "pipeline", "spark", "hadoop", "sql analyst"],
    "mobile":     ["android", "ios", "flutter", "react native", "mobile developer"],
    "ai":         ["ai engineer", "llm", "generative ai", "prompt engineer", "rag", "langchain"],
}

# ── Must-have signal words ────────────────────────────────────────────────────
REQUIRED_SIGNALS   = ["required", "must have", "must-have", "mandatory", "essential",
                       "you will need", "you must", "minimum requirement", "we require"]
PREFERRED_SIGNALS  = ["preferred", "nice to have", "bonus", "plus", "good to have",
                       "advantageous", "desirable", "ideally"]

# ── Tech skill keyword list (same as resume parser, used to scan JD) ──────────
TECH_KEYWORDS = [
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "kotlin", "swift",
    "react", "next.js", "nextjs", "vue", "angular", "node.js", "express", "fastapi", "flask", "django",
    "mongodb", "postgresql", "mysql", "redis", "sqlite", "firebase", "cassandra", "elasticsearch",
    "docker", "kubernetes", "aws", "gcp", "azure", "jenkins", "github actions", "ci/cd", "terraform",
    "git", "linux", "bash", "nginx", "gunicorn", "kafka", "rabbitmq",
    "langchain", "langgraph", "huggingface", "pytorch", "tensorflow", "scikit-learn", "keras",
    "pandas", "numpy", "opencv", "rag", "llm", "openai", "gemini", "claude", "ollama",
    "playwright", "selenium", "rest api", "graphql", "websockets", "grpc",
    "html", "css", "tailwind", "sass", "webpack", "vite",
    "spring", "hibernate", "maven", "gradle",
    "celery", "airflow", "spark", "hadoop",
    "sql", "nosql", "orm", "prisma",
]


@dataclass
class AnalyzedJD:
    raw_text:         str
    job_title:        str
    company:          Optional[str]
    location:         Optional[str]
    experience_level: str                      # intern / junior / mid / senior / unknown
    role_type:        str                      # backend / frontend / fullstack / ml / etc.
    required_skills:  list[str] = field(default_factory=list)
    preferred_skills: list[str] = field(default_factory=list)
    all_skills:       list[str] = field(default_factory=list)
    responsibilities: list[str] = field(default_factory=list)
    keywords:         list[str] = field(default_factory=list)   # for resume tailoring
    is_remote:        bool = False
    min_experience_years: int = 0

    def to_dict(self) -> dict:
        return asdict(self)

    def skills_set(self) -> set[str]:
        return {s.lower() for s in self.all_skills}


class JDAnalyzer:
    """
    Parses a raw job description string into a structured AnalyzedJD object.
    Extracts: title, company, location, skills (required vs preferred),
    experience level, role type, responsibilities, and keywords.
    """

    def analyze(self, jd_text: str, job_title: str = "", company: str = "") -> AnalyzedJD:
        lines   = [l.strip() for l in jd_text.splitlines() if l.strip()]
        text_lc = jd_text.lower()

        title    = job_title or self._extract_title(lines)
        company  = company   or self._extract_company(lines, jd_text)
        location = self._extract_location(jd_text)

        required_skills, preferred_skills = self._extract_skills_by_type(jd_text, lines)
        all_skills = self._dedupe([*required_skills, *preferred_skills,
                                   *self._keyword_scan(text_lc)])

        return AnalyzedJD(
            raw_text              = jd_text,
            job_title             = title,
            company               = company,
            location              = location,
            experience_level      = self._detect_experience_level(text_lc),
            role_type             = self._detect_role_type(text_lc, title),
            required_skills       = required_skills,
            preferred_skills      = preferred_skills,
            all_skills            = all_skills,
            responsibilities      = self._extract_responsibilities(lines),
            keywords              = self._extract_keywords(jd_text, all_skills),
            is_remote             = self._detect_remote(text_lc),
            min_experience_years  = self._extract_min_years(text_lc),
        )

    # ── Title + company ───────────────────────────────────────────────────────

    def _extract_title(self, lines: list[str]) -> str:
        """First short line is usually the job title."""
        role_hints = ["engineer", "developer", "intern", "analyst", "scientist",
                      "manager", "designer", "architect", "lead", "consultant"]
        for line in lines[:8]:
            if any(h in line.lower() for h in role_hints) and len(line) < 80:
                return line.strip()
        return lines[0] if lines else "Unknown Role"

    def _extract_company(self, lines: list[str], text: str) -> Optional[str]:
        patterns = [
            r"(?:at|@|company[:\s]+|employer[:\s]+)\s*([A-Z][A-Za-z0-9\s&.,'-]{2,40})",
            r"([A-Z][A-Za-z0-9]+(?:\s[A-Z][A-Za-z0-9]+){0,3})\s+is\s+(?:hiring|looking|seeking)",
            r"About\s+([A-Z][A-Za-z0-9\s&.]{2,40})",
        ]
        for p in patterns:
            m = re.search(p, text)
            if m:
                return m.group(1).strip()
        return None

    def _extract_location(self, text: str) -> Optional[str]:
        patterns = [
            r"(?:location|based in|office)[:\s]+([A-Za-z\s,]+?)(?:\n|\.|\|)",
            r"\b(Bangalore|Bengaluru|Mumbai|Delhi|Hyderabad|Chennai|Pune|Remote|Hybrid)\b",
        ]
        for p in patterns:
            m = re.search(p, text, re.IGNORECASE)
            if m:
                return m.group(1).strip()
        return None

    # ── Skills ────────────────────────────────────────────────────────────────

    def _extract_skills_by_type(
        self, text: str, lines: list[str]
    ) -> tuple[list[str], list[str]]:
        """
        Walk through sections — if a line signals 'required', collect skills
        under it as required. If it signals 'preferred', collect as preferred.
        Falls back to keyword scan for anything not in a labelled section.
        """
        required:  list[str] = []
        preferred: list[str] = []
        mode = "required"   # default — assume skills are required unless stated

        for line in lines:
            ll = line.lower()

            if any(s in ll for s in REQUIRED_SIGNALS):
                mode = "required"
                continue
            if any(s in ll for s in PREFERRED_SIGNALS):
                mode = "preferred"
                continue

            # Extract skills from this line
            skills_in_line = self._skills_from_line(line)
            if mode == "required":
                required.extend(skills_in_line)
            else:
                preferred.extend(skills_in_line)

        return self._dedupe(required), self._dedupe(preferred)

    def _skills_from_line(self, line: str) -> list[str]:
        """Extract tech skills mentioned in a single line."""
        found = []
        ll = line.lower()
        for kw in TECH_KEYWORDS:
            if re.search(r'\b' + re.escape(kw) + r'\b', ll):
                found.append(kw)
        return found

    def _keyword_scan(self, text_lc: str) -> list[str]:
        """Scan full JD text for any tech keyword mentions."""
        return [kw for kw in TECH_KEYWORDS
                if re.search(r'\b' + re.escape(kw) + r'\b', text_lc)]

    # ── Experience level + role type ──────────────────────────────────────────

    def _detect_experience_level(self, text_lc: str) -> str:
        for level, keywords in EXPERIENCE_LEVELS.items():
            if any(k in text_lc for k in keywords):
                return level
        return "unknown"

    def _detect_role_type(self, text_lc: str, title: str) -> str:
        title_lc = title.lower()
        combined = text_lc + " " + title_lc
        scores: dict[str, int] = {}
        for role, keywords in ROLE_TYPES.items():
            scores[role] = sum(1 for k in keywords if k in combined)
        best = max(scores, key=lambda r: scores[r])
        return best if scores[best] > 0 else "unknown"

    def _extract_min_years(self, text_lc: str) -> int:
        """Pull out the minimum years of experience mentioned."""
        match = re.search(r"(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?experience", text_lc)
        if match:
            return int(match.group(1))
        return 0

    # ── Responsibilities ──────────────────────────────────────────────────────

    def _extract_responsibilities(self, lines: list[str]) -> list[str]:
        """
        Collect bullet points from the responsibilities / what you'll do section.
        """
        resp: list[str] = []
        in_section = False
        resp_headers = ["responsibilities", "what you'll do", "what you will do",
                        "role", "duties", "your role", "job description", "about the role"]

        for line in lines:
            ll = line.lower().strip(":-– ")
            if any(h in ll for h in resp_headers):
                in_section = True
                continue
            # Stop collecting when hitting another major section
            if in_section and any(h in ll for h in
                    ["requirement", "qualif", "skill", "benefit", "about us", "who we"]):
                in_section = False
            if in_section and line.startswith(("•", "-", "*", "–")):
                resp.append(line.lstrip("•-*– ").strip())
            elif in_section and len(line) > 20 and not line.endswith(":"):
                resp.append(line)

        return resp[:10]   # cap at 10 bullets

    # ── Keywords for resume tailoring ─────────────────────────────────────────

    def _extract_keywords(self, text: str, skills: list[str]) -> list[str]:
        """
        Returns a deduplicated keyword list used by resume_tailor.py
        to inject matching terms into the resume.
        Includes: skills + action verbs + domain nouns from the JD.
        """
        keywords: set[str] = set(s.lower() for s in skills)

        # Action verbs commonly used in JDs — signal what the role does
        action_verbs = [
            "design", "develop", "build", "deploy", "optimize", "architect",
            "integrate", "implement", "scale", "automate", "collaborate",
            "debug", "test", "monitor", "maintain", "lead", "mentor",
        ]
        text_lc = text.lower()
        for verb in action_verbs:
            if verb in text_lc:
                keywords.add(verb)

        # Domain nouns
        domain_nouns = [
            "microservices", "distributed systems", "cloud native", "scalability",
            "high availability", "rest api", "agile", "scrum", "open source",
            "production", "real-time", "data pipeline", "machine learning pipeline",
        ]
        for noun in domain_nouns:
            if noun in text_lc:
                keywords.add(noun)

        return sorted(keywords)

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _detect_remote(self, text_lc: str) -> bool:
        return any(w in text_lc for w in ["remote", "work from home", "wfh", "distributed team"])

    def _dedupe(self, items: list[str]) -> list[str]:
        seen: set[str] = set()
        out:  list[str] = []
        for item in items:
            key = item.lower()
            if key not in seen:
                seen.add(key)
                out.append(item)
        return out