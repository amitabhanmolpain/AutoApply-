"""
Quick test — run from Backend/ folder:
    python tests/test_parser.py path/to/your_resume.pdf
"""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from parsers.resume_parser import ResumeParser


def test(file_path: str):
    parser = ResumeParser()
    result = parser.parse(file_path)
    data = result.to_dict()

    print("\n" + "=" * 50)
    print(f"  Name       : {data['name']}")
    print(f"  Email      : {data['email']}")
    print(f"  Phone      : {data['phone']}")
    print(f"  LinkedIn   : {data['linkedin']}")
    print(f"  GitHub     : {data['github']}")
    print(f"  Skills     : {len(data['skills'])} found")
    print(f"  Experience : {len(data['experience'])} roles")
    print(f"  Education  : {len(data['education'])} entries")
    print(f"  Projects   : {len(data['projects'])} projects")
    print("=" * 50)
    print("\nFull JSON output:\n")
    print(json.dumps(data, indent=2))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python tests/test_parser.py <path_to_resume.pdf>")
        sys.exit(1)
    test(sys.argv[1])