from __future__ import annotations
import asyncio
from urllib.parse import quote

from scrappers.base import BaseScraper
from models.job import Job

INTERNSHALA_BASE = "https://internshala.com"


class IntershalaScraper(BaseScraper):
    """
    Scrapes internshala.com for internship/job listings.
    Internshala is the most scraper-friendly platform —
    no login required for listing pages, minimal bot detection.
    """

    platform = "internshala"

    async def search(self, role: str, location: str = "work-from-home",
                     max_jobs: int = 10) -> list[Job]:
        """
        Search Internshala for internships matching role + location.
        Returns up to max_jobs Job objects with full descriptions.
        """
        await self.start()
        jobs: list[Job] = []

        try:
            url = self._build_url(role, location)
            print(f"  [internshala] Searching: {url}")

            await self.page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await self.page.wait_for_timeout(2000)
            await self.scroll_down(times=2)

            # Grab all internship cards on the listing page
            cards = await self.page.query_selector_all(".internship_meta")
            print(f"  [internshala] Found {len(cards)} listings")

            for card in cards[:max_jobs]:
                try:
                    job = await self._parse_card(card)
                    if job:
                        # Visit individual page to get full JD
                        job.description = await self._fetch_description(job.url)
                        jobs.append(job)
                        print(f"  [internshala] ✓ {job.title} @ {job.company}")
                        await asyncio.sleep(1)   # polite delay
                except Exception as e:
                    print(f"  [internshala] ✗ card error: {e}")
                    continue

        except Exception as e:
            print(f"  [internshala] Search failed: {e}")
        finally:
            await self.stop()

        return jobs

    # ── URL builder ───────────────────────────────────────────────────────────

    def _build_url(self, role: str, location: str) -> str:
        """
        Internshala URL format:
        /internships/keywords-{role}/location-{location}
        Falls back to work-from-home for Remote.
        """
        role_slug = quote(role.lower().replace(" ", "-"))

        if location.lower() in ("remote", "work from home", "wfh", "work-from-home"):
            return f"{INTERNSHALA_BASE}/internships/keywords-{role_slug}/work-from-home"

        location_slug = quote(location.lower().replace(" ", "-"))
        return f"{INTERNSHALA_BASE}/internships/keywords-{role_slug}/in-{location_slug}"

    # ── Card parser ───────────────────────────────────────────────────────────

    async def _parse_card(self, card) -> Job | None:
        """Extract basic info from a listing card element."""
        try:
            # Title
            title_el = await card.query_selector(".profile")
            title    = (await title_el.inner_text()).strip() if title_el else ""

            # Company
            company_el = await card.query_selector(".company_name")
            company    = (await company_el.inner_text()).strip() if company_el else ""

            # Location
            location_el = await card.query_selector(".location_link")
            location    = (await location_el.inner_text()).strip() if location_el else "Remote"

            # URL — grab from the title anchor
            link_el = await card.query_selector("a.view_detail_button")
            if not link_el:
                link_el = await card.query_selector("a[href*='/internship/detail']")
            href    = await link_el.get_attribute("href") if link_el else ""
            url     = f"{INTERNSHALA_BASE}{href}" if href.startswith("/") else href

            if not title or not url:
                return None

            return Job(
                title    = title,
                company  = company.strip("- "),
                location = location,
                url      = url,
                platform = self.platform,
            )
        except Exception as e:
            print(f"  [internshala] _parse_card error: {e}")
            return None

    # ── Description fetcher ───────────────────────────────────────────────────

    async def _fetch_description(self, url: str) -> str:
        """
        Visit the individual job page and extract the full description text.
        Internshala's JD is inside .internship_details or .about_company sections.
        """
        if not url:
            return ""

        try:
            await self.page.goto(url, wait_until="domcontentloaded", timeout=20000)
            await self.page.wait_for_timeout(1500)

            sections: list[str] = []

            # About the internship
            about = await self.page.query_selector("#about_internship")
            if about:
                sections.append(await about.inner_text())

            # Skills required
            skills = await self.page.query_selector(".round_tabs_container")
            if skills:
                sections.append("Skills required:\n" + await skills.inner_text())

            # Who can apply
            who = await self.page.query_selector("#who_can_apply")
            if who:
                sections.append(await who.inner_text())

            return "\n\n".join(s.strip() for s in sections if s.strip())

        except Exception as e:
            print(f"  [internshala] description fetch error: {e}")
            return ""