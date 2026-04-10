from __future__ import annotations
from dataclasses import dataclass, asdict

from models.user import UserProfile
from models.job import Job
from parsers.jd_analyzer import JDAnalyzer, AnalyzedJD
from scorers.embeddings import encode, cosine_similarity


@dataclass
class ScoreResult:
    """Full breakdown of one resume-vs-JD match."""
    overall_score:    float          # 0–100  (weighted final score)
    skill_score:      float          # 0–100  (keyword overlap)
    semantic_score:   float          # 0–100  (embedding similarity)
    matched_skills:   list[str]
    missing_skills:   list[str]
    matched_preferred: list[str]
    verdict:          str            # "apply" / "skip"
    skip_reason:      str | None

    def to_dict(self) -> dict:
        return asdict(self)


# Weights — tweak these to change how much each signal matters
SKILL_WEIGHT    = 0.55   # keyword overlap (fast, reliable)
SEMANTIC_WEIGHT = 0.45   # embedding similarity (catches synonyms)

# Score below this → skip the job
APPLY_THRESHOLD = 60.0


class MatchScorer:
    """
    Computes a fit score (0–100) between a UserProfile and a Job.

    Two-signal approach:
    1. Skill overlap  — exact / case-insensitive keyword match
    2. Semantic score — cosine similarity of resume text vs JD text

    Final = 0.55 × skill_score + 0.45 × semantic_score
    """

    def __init__(self, threshold: float = APPLY_THRESHOLD):
        self.threshold  = threshold
        self.jd_analyzer = JDAnalyzer()

    def score(self, user: UserProfile, job: Job) -> ScoreResult:
        """
        Main entry point.
        Analyzes the job description, then scores against the user profile.
        Attaches matched/missing skills back onto the Job object.
        """
        # 1. Parse the JD
        analyzed: AnalyzedJD = self.jd_analyzer.analyze(
            jd_text   = job.description,
            job_title = job.title,
            company   = job.company,
        )

        # 2. Skill overlap score
        skill_score, matched, missing, matched_pref = self._skill_score(user, analyzed)

        # 3. Semantic score
        semantic_score = self._semantic_score(user, analyzed)

        # 4. Weighted final
        overall = round(
            SKILL_WEIGHT * skill_score + SEMANTIC_WEIGHT * semantic_score, 1
        )

        # 5. Verdict
        verdict, skip_reason = self._verdict(overall, missing)

        # 6. Write results back onto the Job object
        job.match_score     = overall
        job.matched_skills  = matched
        job.missing_skills  = missing
        job.status          = "scored"

        return ScoreResult(
            overall_score     = overall,
            skill_score       = round(skill_score, 1),
            semantic_score    = round(semantic_score, 1),
            matched_skills    = matched,
            missing_skills    = missing,
            matched_preferred = matched_pref,
            verdict           = verdict,
            skip_reason       = skip_reason,
        )

    # ── Skill overlap ─────────────────────────────────────────────────────────

    def _skill_score(
        self, user: UserProfile, jd: AnalyzedJD
    ) -> tuple[float, list[str], list[str], list[str]]:
        """
        Compares user.skills_set() against jd.required_skills + preferred_skills.

        Score formula:
          required matches carry full weight (1.0 each)
          preferred matches carry half weight (0.5 each)
          score = (req_matched + 0.5 * pref_matched) / (total_required + 0.5 * total_preferred)
        """
        user_skills = user.skills_set()   # lowercase set

        req_skills  = [s.lower() for s in jd.required_skills]
        pref_skills = [s.lower() for s in jd.preferred_skills]

        matched_req  = [s for s in req_skills  if s in user_skills]
        missing_req  = [s for s in req_skills  if s not in user_skills]
        matched_pref = [s for s in pref_skills if s in user_skills]

        total_weight  = len(req_skills) + 0.5 * len(pref_skills)
        earned_weight = len(matched_req) + 0.5 * len(matched_pref)

        score = (earned_weight / total_weight * 100) if total_weight > 0 else 50.0
        # 50 default when JD has no explicit skills listed

        return score, matched_req, missing_req, matched_pref

    # ── Semantic similarity ───────────────────────────────────────────────────

    def _semantic_score(self, user: UserProfile, jd: AnalyzedJD) -> float:
        """
        Encode resume text and JD text as sentence embeddings,
        compute cosine similarity, scale to 0–100.
        """
        try:
            resume_text = user.raw_resume_text or " ".join(user.skills)
            jd_text     = jd.raw_text or jd.job_title

            resume_vec = encode(resume_text)[0]
            jd_vec     = encode(jd_text)[0]

            similarity = cosine_similarity(resume_vec, jd_vec)
            # cosine similarity is 0–1 for normalized vectors → scale to 0–100
            return max(0.0, min(100.0, similarity * 100))

        except Exception:
            # If embeddings fail (no model), fall back to 50
            return 50.0

    # ── Verdict ───────────────────────────────────────────────────────────────

    def _verdict(
        self, overall: float, missing: list[str]
    ) -> tuple[str, str | None]:
        if overall >= self.threshold:
            return "apply", None

        reason_parts = [f"match score {overall:.0f}% below threshold {self.threshold:.0f}%"]
        if missing:
            top_missing = ", ".join(missing[:3])
            reason_parts.append(f"missing skills: {top_missing}")

        return "skip", " — ".join(reason_parts)

    # ── Batch scoring ─────────────────────────────────────────────────────────

    def score_batch(
        self, user: UserProfile, jobs: list[Job]
    ) -> list[tuple[Job, ScoreResult]]:
        """
        Score a list of jobs and return (job, result) pairs sorted by score desc.
        Used by the orchestrator to process a full scrape batch.
        """
        results = []
        for job in jobs:
            try:
                result = self.score(user, job)
                results.append((job, result))
            except Exception as e:
                job.status = "failed"
                job.skip_reason = str(e)

        results.sort(key=lambda x: x[1].overall_score, reverse=True)
        return results