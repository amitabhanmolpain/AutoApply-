"""
Full end-to-end agent test.
Run from Backend/ folder:
    python tests/test_agent.py

Runs the complete pipeline with mock scrapers:
  scrape (mock) → score → apply (mock) → summary
"""
import sys, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from models.user import UserProfile
from agent.orchestrator import Orchestrator


SAMPLE_USER = UserProfile(
    name             = "Amitabh Anmol Pain",
    email            = "amitabhanmolpain888@gmail.com",
    phone            = "9380303071",
    github           = "https://github.com/amitabhanmolpain",
    target_role      = "Backend Intern",
    target_locations = ["Bangalore", "Remote"],
    match_threshold  = 60.0,
    platforms        = ["linkedin", "wellfound", "internshala", "indeed"],
    skills           = [
        "Python", "FastAPI", "Flask", "Node.js", "React",
        "MongoDB", "Redis", "Docker", "GitHub Actions", "CI/CD",
        "LangChain", "LangGraph", "RAG", "LLM", "Gemini",
        "JavaScript", "Git", "Linux", "REST API", "SQL", "Pandas", "NumPy",
    ],
    raw_resume_text  = """
        Amitabh Anmol Pain — Backend & AI Engineer
        Skills: Python, FastAPI, Flask, Node.js, React, MongoDB, Redis,
        Docker, LangChain, LangGraph, RAG, LLM, Gemini, GitHub Actions,
        JavaScript, Git, Linux, REST API, SQL, Pandas, NumPy.
        Projects: PolicyAgentX LangGraph agentic AI policy simulator.
        Real Estate Platform Flask MongoDB REST API.
        EcoFinds Docker GitHub Actions CI/CD.
    """,
)


if __name__ == "__main__":
    orch   = Orchestrator()
    result = orch.run(SAMPLE_USER)

    print("\n── Final summary JSON ──────────────────────────")
    print(json.dumps(result, indent=2))