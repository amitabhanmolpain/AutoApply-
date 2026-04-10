from __future__ import annotations
import asyncio
from urllib.parse import quote

from scrappers.base import BaseScraper
from models.job import Job

LINKEDIN_BASE = "https://www.linkedin.com"


class LinkedInScraper(BaseScraper):
    """
    Scrapes LinkedIn public job search — no login required.
    LinkedIn's public search at /jobs/search is accessible without auth
    and shows title, company, location, and partial description.

    IMPORTANT: Collects all job metadata FIRST, then visits each URL separately
    to avoid stale element references after page navigation.

    Note: LinkedIn is aggressive with bot detection.
    Use headless=False during development if you get blocked.
    """

    platform = "linkedin"

    async def search(self, role: str, location: str = "India",
                     max_jobs: int = 10) -> list[Job]:
        await self.start()
        jobs: list[Job] = []

        try:
            url = self._build_url(role, location)
            print(f"  [linkedin] Searching: {url}")

            # Set extra headers to bypass bot detection
            await self.page.set_extra_http_headers({
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.linkedin.com/",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            })

            # Increase timeout and use more lenient wait strategy
            try:
                await self.page.goto(url, wait_until="load", timeout=60000)
            except Exception as e:
                print(f"  [linkedin] Initial load timeout, retrying with longer wait...")
                try:
                    await self.page.goto(url, wait_until="domcontentloaded", timeout=60000)
                except:
                    print(f"  [linkedin] Failed to load page after retries")
                    return []

            # Wait for job cards to appear
            print(f"  [linkedin] Waiting for job listings to load...")
            try:
                await self.page.wait_for_selector(
                    ".jobs-search__results-list li, .base-card",
                    timeout=15000
                )
            except Exception as e:
                print(f"  [linkedin] Page loaded but job cards not found: {e}")

            await self.page.wait_for_timeout(3000)
            await self.scroll_down(times=5, delay=2000)

            # STEP 1: Collect ALL job metadata into plain dicts FIRST
            cards = await self.page.query_selector_all(
                ".jobs-search__results-list li, .base-card"
            )
            print(f"  [linkedin] Found {len(cards)} listings")

            if len(cards) == 0:
                print(f"  [linkedin] No cards found - checking page structure...")
                content = await self.page.content()
                if "Sign in" in content or "login" in content.lower():
                    print(f"  [linkedin] Page requires login - try different approach")
                return []

            job_dicts = []
            for i, card in enumerate(cards[:max_jobs]):
                try:
                    job_data = await self._extract_card_data(card)
                    if job_data:
                        job_dicts.append(job_data)
                        print(f"  [linkedin] Extracted card {i+1}: {job_data.get('title', 'Unknown')}")
                except Exception as e:
                    print(f"  [linkedin] Card {i} error: {e}")
                    continue

            print(f"  [linkedin] Successfully extracted {len(job_dicts)} job cards")

            # STEP 2: Visit each URL separately to fetch full description
            for idx, job_data in enumerate(job_dicts):
                try:
                    print(f"  [linkedin] Fetching description for job {idx+1}/{len(job_dicts)}...")
                    description = await self._fetch_description(job_data["url"])
                    job = Job(
                        title=job_data["title"],
                        company=job_data["company"],
                        location=job_data["location"],
                        url=job_data["url"],
                        platform=self.platform,
                        description=description,
                    )
                    jobs.append(job)
                    print(f"  [linkedin] ✓ {job.title} @ {job.company}")
                    await self.page.wait_for_timeout(2000)  # LinkedIn rate limiting
                except Exception as e:
                    print(f"  [linkedin] Fetch description error for job {idx+1}: {e}")
                    continue

        except Exception as e:
            print(f"  [linkedin] Search failed: {e}")
            import traceback
            traceback.print_exc()
        finally:
            await self.stop()

        return jobs

    def _build_url(self, role: str, location: str) -> str:
        r = quote(role)
        l = quote(location)
        # f=TPT → filter for internships only
        return (
            f"{LINKEDIN_BASE}/jobs/search"
            f"?keywords={r}&location={l}"
            f"&f_TPR=r604800"   # posted in last 7 days
            f"&f_JT=I"          # I = Internship
            f"&sortBy=DD"       # newest first
        )

    async def _extract_card_data(self, card) -> dict | None:
        """Extract job metadata from a card (title, company, location, url)
        WITHOUT navigating away. Returns plain dict, not Job object."""
        try:
            title_el = await card.query_selector(
                ".base-search-card__title, h3.base-search-card__title"
            )
            company_el = await card.query_selector(
                ".base-search-card__subtitle, h4.base-search-card__subtitle"
            )
            loc_el = await card.query_selector(
                ".job-search-card__location, span.job-search-card__location"
            )
            link_el = await card.query_selector("a.base-card__full-link")

            title = (await title_el.inner_text()).strip() if title_el else ""
            company = (await company_el.inner_text()).strip() if company_el else ""
            loc = (await loc_el.inner_text()).strip() if loc_el else "India"
            url = await link_el.get_attribute("href") if link_el else ""

            if not title or not url:
                return None

            return {
                "title": title,
                "company": company,
                "location": loc,
                "url": url.split("?")[0],  # clean tracking params
            }
        except Exception as e:
            print(f"  [linkedin] _extract_card_data error: {e}")
            return None

    async def _fetch_description(self, url: str) -> str:
        if not url:
            return ""
        try:
            # Use longer timeout for individual job pages
            try:
                await self.page.goto(url, wait_until="load", timeout=45000)
            except:
                await self.page.goto(url, wait_until="domcontentloaded", timeout=45000)
            
            await self.page.wait_for_timeout(2500)

            # Try to expand the "Show more" button if present
            try:
                btn = await self.page.query_selector(
                    "button.show-more-less-html__button--more, button[aria-label*='more']"
                )
                if btn:
                    await btn.click()
                    await self.page.wait_for_timeout(1000)
            except Exception:
                pass

            # Try multiple selectors for description
            desc_selectors = [
                ".show-more-less-html__markup",
                ".description__text",
                ".show-more-less-html",
                "div[data-sanitization-level]",
            ]
            
            for selector in desc_selectors:
                try:
                    desc_el = await self.page.query_selector(selector)
                    if desc_el:
                        text = await desc_el.inner_text()
                        if text and len(text.strip()) > 10:
                            return text.strip()
                except:
                    continue

            return ""

        except Exception as e:
            print(f"  [linkedin] Description fetch error: {e}")
            return ""