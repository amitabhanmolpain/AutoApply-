"""
Test scrapers individually.
Run from Backend/ folder:

    # Test Internshala (most reliable, start here)
    python tests/test_scraper.py internshala "backend developer" "bangalore"

    # Test Wellfound
    python tests/test_scraper.py wellfound "backend intern" "remote"

    # Test LinkedIn
    python tests/test_scraper.py linkedin "backend intern" "India"
"""
import sys
import json
import asyncio
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from scrappers import SCRAPER_MAP


async def test(platform: str, role: str, location: str):
    ScraperClass = SCRAPER_MAP.get(platform)
    if not ScraperClass:
        print(f"Unknown platform: {platform}")
        print(f"Available: {list(SCRAPER_MAP.keys())}")
        return

    print(f"\nScraping [{platform}] for '{role}' in '{location}'...")
    print("=" * 55)

    # Set headless=False so you can watch it work in the browser
    scraper = ScraperClass(headless=False)
    jobs    = await scraper.search(role=role, location=location, max_jobs=5)

    print(f"\nFound {len(jobs)} jobs:\n")
    for i, job in enumerate(jobs, 1):
        print(f"{i}. {job.title} @ {job.company}")
        print(f"   Platform : {job.platform}")
        print(f"   Location : {job.location}")
        print(f"   URL      : {job.url}")
        print(f"   JD length: {len(job.description)} chars")
        if job.description:
            preview = job.description[:200].replace("\n", " ")
            print(f"   JD preview: {preview}...")
        print()

    print(json.dumps([j.to_dict() for j in jobs], indent=2))


if __name__ == "__main__":
    platform = sys.argv[1] if len(sys.argv) > 1 else "internshala"
    role     = sys.argv[2] if len(sys.argv) > 2 else "backend developer"
    location = sys.argv[3] if len(sys.argv) > 3 else "bangalore"

    asyncio.run(test(platform, role, location))