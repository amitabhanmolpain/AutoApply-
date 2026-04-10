"""Centralized LLM runtime configuration for AutoApply agents."""
import os
from dataclasses import dataclass


def _to_bool(value: str, default: bool = True) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


@dataclass
class LLMRuntimeConfig:
    provider: str
    enabled: bool
    model_general: str
    model_resume_parser: str
    model_cover_letter: str
    gemini_api_key: str
    openai_api_key: str
    anthropic_api_key: str
    google_application_credentials: str


def get_llm_config() -> LLMRuntimeConfig:
    provider = os.getenv("LLM_PROVIDER", "gemini").strip().lower()
    return LLMRuntimeConfig(
        provider=provider,
        enabled=_to_bool(os.getenv("LLM_ENABLED", "true"), True),
        model_general=os.getenv("LLM_MODEL_GENERAL", "gemini-1.5-flash"),
        model_resume_parser=os.getenv("LLM_MODEL_RESUME_PARSER", "gemini-1.5-flash"),
        model_cover_letter=os.getenv("LLM_MODEL_COVER_LETTER", "gemini-1.5-pro"),
        gemini_api_key=os.getenv("GEMINI_API_KEY", ""),
        openai_api_key=os.getenv("OPENAI_API_KEY", ""),
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY", ""),
        google_application_credentials=os.getenv("GOOGLE_APPLICATION_CREDENTIALS", ""),
    )


def ai_required_features() -> dict:
    """Where AI/LLM is required in this project."""
    return {
        "resume_parsing": "LLM-assisted extraction/cleanup from resume text",
        "cover_letter_generation": "Dynamic cover letter personalization",
        "application_reasoning": "Optional ranking/refinement before auto-apply",
    }


def validate_llm_config() -> tuple[bool, str]:
    cfg = get_llm_config()

    if not cfg.enabled:
        return True, "LLM is disabled (LLM_ENABLED=false)."

    if cfg.provider == "gemini":
        if cfg.gemini_api_key:
            return True, "Gemini key configured."
        return False, "Missing GEMINI_API_KEY for LLM_PROVIDER=gemini."

    if cfg.provider == "openai":
        if cfg.openai_api_key:
            return True, "OpenAI key configured."
        return False, "Missing OPENAI_API_KEY for LLM_PROVIDER=openai."

    if cfg.provider == "anthropic":
        if cfg.anthropic_api_key:
            return True, "Anthropic key configured."
        return False, "Missing ANTHROPIC_API_KEY for LLM_PROVIDER=anthropic."

    return False, f"Unsupported LLM_PROVIDER: {cfg.provider}. Use gemini, openai, or anthropic."
