from __future__ import annotations
import asyncio
import re
from urllib.parse import quote

from scrappers.base import BaseScraper
from models.job import Job

WELLFOUND_BASE = "https://wellfound.com"


class WellfoundScraper(BaseScraper):
    """
    Scrapes wellfound.com (formerly AngelList Talent) for startup jobs.
    Good for AI/ML and backend internships at Indian startups.
    
    Note: Wellfound requires login for full JD access.
          This scraper gets public listing data without login.
    
    Uses broader CSS selectors and searches for job links in the page.
    """

    platform = "wellfound"

    async def search(self, role: str, location: str = "remote",
                     max_jobs: int = 10) -> list[Job]:
        await self.start()
        jobs: list[Job] = []

        try:
            url = self._build_url(role, location)
            print(f"  [wellfound] Searching: {url}")

            await self.page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await self.page.wait_for_load_state("networkidle")
            await self.page.wait_for_timeout(3000)
            await self.scroll_down(times=3, delay=1500)

            # DEBUG: Print page HTML to inspect structure
            page_content = await self.page.content()
            if '<h1' in page_content or 'job' in page_content.lower():
                print(f"  [wellfound] Page loaded, searching for job listings...")
            else:
                print(f"  [wellfound] WARNING: Page might not have loaded properly")

            # Try multiple selector strategies
            job_dicts = await self._extract_job_listings()
            print(f"  [wellfound] Found {len(job_dicts)} listings")

            for job_data in job_dicts[:max_jobs]:
                try:
                    job = Job(
                        title=job_data["title"],
                        company=job_data["company"],
                        location=job_data["location"],
                        url=job_data["url"],
                        platform=self.platform,
                        description=job_data.get("description", ""),
                        is_remote=job_data.get("is_remote", False),
                    )
                    jobs.append(job)
                    print(f"  [wellfound] ✓ {job.title} @ {job.company}")
                except Exception as e:
                    print(f"  [wellfound] Parse error: {e}")
                    continue

                await asyncio.sleep(0.5)

        except Exception as e:
            print(f"  [wellfound] Search failed: {e}")
        finally:
            await self.stop()

        return jobs

    def _build_url(self, role: str, location: str) -> str:
        """Build Wellfound search URL - uses role-based URL structure"""
        # Convert role to slug format
        role_slug = role.lower().replace(" ", "-")
        
        # Try role-based URL (more reliable than old API)
        if location.lower() in ("remote", "wfh", "work from home"):
            # Try the direct role URL with remote filter
            return f"{WELLFOUND_BASE}/role/r/{role_slug}"
        
        loc_slug = location.lower().replace(" ", "-")
        return f"{WELLFOUND_BASE}/role/r/{role_slug}?location={loc_slug}"

    async def _extract_job_listings(self) -> list[dict]:
        """Extract job listings using multiple selector strategies"""
        jobs = []

        # Strategy 1: Look for job links matching /jobs/ pattern
        all_links = await self.page.query_selector_all("a[href*='/jobs/']")
        print(f"  [wellfound] Found {len(all_links)} links with /jobs/ in href")

        for link in all_links:
            try:
                href = await link.get_attribute("href")
                if not href or "/jobs/" not in href:
                    continue
                
                # Extract job info from link and nearby elements
                job_data = await self._parse_job_link(link, href)
                if job_data and job_data not in jobs:  # Avoid duplicates
                    jobs.append(job_data)
            except Exception as e:
                continue

        # Strategy 2: Look for elements with job-related classes
        if not jobs:
            print(f"  [wellfound] Trying broader selectors...")
            cards = await self.page.query_selector_all("div[class*='job'], div[class*='startup']")
            print(f"  [wellfound] Found {len(cards)} divs with job/startup class patterns")
            
            for card in cards[:20]:
                try:
                    job_data = await self._parse_card(card)
                    if job_data and job_data not in jobs:
                        jobs.append(job_data)
                except Exception:
                    continue

        return jobs

    async def _parse_job_link(self, link_el, href: str) -> dict | None:
        """Parse a single job link and extract metadata"""
        try:
            # Get text from link
            title = (await link_el.inner_text()).strip()
            if not title or len(title) < 3:
                return None

            # Get parent card context for company/location
            parent = await link_el.evaluate_handle("el => el.closest('div')")
            
            # Try to find company name near the link
            company_text = ""
            try:
                company_el = await parent.query_selector("span[class*='company'], h3, p")
                if company_el:
                    company_text = (await company_el.inner_text()).strip()
            except:
                pass

            # Default company if not found
            company = company_text or "Startup"

            # Check if remote in href or title
            is_remote = "remote" in href.lower() or "remote" in title.lower()
            location = "Remote" if is_remote else "India"

            # Construct full URL
            if href.startswith("/"):
                url = f"{WELLFOUND_BASE}{href}"
            else:
                url = href

            return {
                "title": title,
                "company": company,
                "location": location,
                "url": url,
                "is_remote": is_remote,
                "description": "",
            }
        except Exception as e:
            return None

    async def _parse_card(self, card) -> dict | None:
        """Parse a job card element looking for title, company, location"""
        try:
            # Try multiple selectors for title
            title_selectors = [
                "a[href*='/jobs/']",
                "h2 a",
                "h3 a",
                "[data-test='job-title']",
            ]
            
            title = ""
            url = ""
            
            for selector in title_selectors:
                try:
                    title_el = await card.query_selector(selector)
                    if title_el:
                        title = (await title_el.inner_text()).strip()
                        href = await title_el.get_attribute("href")
                        if href:
                            url = href if href.startswith("http") else f"{WELLFOUND_BASE}{href}"
                        if title and url:
                            break
                except:
                    continue

            if not title or not url:
                return None

            # Try to find company
            company = ""
            comp_selectors = ["a[href*='/startups/']", "span[class*='company']", "h3", "p"]
            for sel in comp_selectors:
                try:
                    comp_el = await card.query_selector(sel)
                    if comp_el:
                        company = (await comp_el.inner_text()).strip()
                        if company and len(company) > 1:
                            break
                except:
                    continue

            # Try to find location
            location = "India"
            loc_selectors = ["span[class*='location']", "[data-test='location']", "p"]
            for sel in loc_selectors:
                try:
                    loc_el = await card.query_selector(sel)
                    if loc_el:
                        loc_text = (await loc_el.inner_text()).strip()
                        if loc_text and len(loc_text) < 30:
                            location = loc_text
                            break
                except:
                    continue

            # Check if remote
            is_remote = "remote" in location.lower() or "remote" in url.lower()

            return {
                "title": title,
                "company": company or "Startup",
                "location": location,
                "url": url,
                "is_remote": is_remote,
                "description": "",
            }
        except Exception as e:
            return None