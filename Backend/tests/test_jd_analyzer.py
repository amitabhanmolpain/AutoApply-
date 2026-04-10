"""
Quick test — run from Backend/ folder:
    python tests/test_jd_analyzer.py

Paste any job description as the JD_TEXT string below,
or pass a .txt file path as argument:
    python tests/test_jd_analyzer.py path/to/jd.txt
"""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from parsers.jd_analyzer import JDAnalyzer

# ── Paste a sample JD here to test ───────────────────────────────────────────
SAMPLE_JD = """
Backend Engineer Intern — Bangalore (Remote OK)

About Us
We are a fast-growing fintech startup building the next generation of payment infrastructure.

What You'll Do
- Design and develop scalable REST APIs using Python and FastAPI
- Build and deploy microservices on AWS using Docker and Kubernetes
- Integrate with PostgreSQL and Redis for data storage and caching
- Collaborate with frontend team and participate in code reviews
- Write unit tests and maintain CI/CD pipelines using GitHub Actions

Requirements (Must Have)
- Strong knowledge of Python and FastAPI or Flask
- Experience with REST API design and development
- Familiarity with Git and Linux
- Understanding of SQL and NoSQL databases

Preferred (Nice to Have)
- Experience with Docker and Kubernetes
- Knowledge of Redis or message queues
- Prior internship experience
- Exposure to cloud platforms (AWS / GCP)

We are looking for a fresher or intern with 0-1 years of experience.
Location: Bangalore / Remote
"""


def test(jd_text: str):
    analyzer = JDAnalyzer()
    result   = analyzer.analyze(jd_text)
    data     = result.to_dict()

    print("\n" + "=" * 55)
    print(f"  Title            : {data['job_title']}")
    print(f"  Company          : {data['company']}")
    print(f"  Location         : {data['location']}")
    print(f"  Remote           : {data['is_remote']}")
    print(f"  Experience level : {data['experience_level']}")
    print(f"  Role type        : {data['role_type']}")
    print(f"  Min years        : {data['min_experience_years']}")
    print(f"  Required skills  : {data['required_skills']}")
    print(f"  Preferred skills : {data['preferred_skills']}")
    print(f"  All skills       : {len(data['all_skills'])} found")
    print(f"  Keywords         : {len(data['keywords'])} found")
    print(f"  Responsibilities : {len(data['responsibilities'])} bullets")
    print("=" * 55)
    print("\nFull JSON:\n")
    print(json.dumps(data, indent=2))


if __name__ == "__main__":
    if len(sys.argv) > 1:
        path = sys.argv[1]
        jd_text = Path(path).read_text(encoding="utf-8")
    else:
        jd_text = SAMPLE_JD

    test(jd_text)