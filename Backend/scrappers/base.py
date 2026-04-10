from __future__ import annotations
from abc import ABC, abstractmethod
from playwright.async_api import async_playwright, Browser, Page
from models.job import Job
import shutil


class BaseScraper(ABC):
    """
    Abstract base class for all job platform scrapers.
    Every scraper must implement search() which returns a list of Job objects.

    Uses Playwright in headless mode by default.
    Set headless=False during development to watch the browser.
    """

    def __init__(self, headless: bool = True):
        self.headless  = headless
        self.browser: Browser | None = None
        self.page:    Page    | None = None
        self.brave_path = self._find_brave_executable()

    # ── Lifecycle ─────────────────────────────────────────────────────────────

    def _find_brave_executable(self) -> str | None:
        """Find Brave browser executable path."""
        # Windows paths
        brave_paths = [
            r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe",
            r"C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe",
        ]
        # Try using shutil.which first (if Brave is in PATH)
        brave_in_path = shutil.which("brave")
        if brave_in_path:
            return brave_in_path
        # Check standard Windows installation paths
        for path in brave_paths:
            try:
                from pathlib import Path
                if Path(path).exists():
                    return path
            except:
                pass
        return None

    async def start(self):
        """Launch browser and open a blank page."""
        self._pw = await async_playwright().start()
        
        # Determine browser launch parameters
        if self.brave_path:
            print(f"[Scraper] Using Brave: {self.brave_path}")
            self.browser = await self._pw.chromium.launch(
                executable_path=self.brave_path,
                headless=self.headless,
                args=[
                    "--no-sandbox",
                    "--disable-blink-features=AutomationControlled",
                    "--disable-dev-shm-usage",
                ]
            )
        else:
            print("[Scraper] Brave not found, falling back to Chromium")
            self.browser = await self._pw.chromium.launch(
                headless=self.headless,
                args=[
                    "--no-sandbox",
                    "--disable-blink-features=AutomationControlled",
                    "--disable-dev-shm-usage",
                ]
            )
        
        context = await self.browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1920, "height": 1080},
            locale="en-US",
            timezone_id="Asia/Kolkata",
        )
        self.page = await context.new_page()

        # Comprehensive anti-bot detection bypass
        await self.page.add_init_script(
            """
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
            Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']});
            window.chrome = {runtime: {}};
            """
        )

    async def stop(self):
        """Close browser cleanly."""
        if self.browser:
            await self.browser.close()
        if hasattr(self, "_pw"):
            await self._pw.stop()

    # ── Interface ─────────────────────────────────────────────────────────────

    @abstractmethod
    async def search(self, role: str, location: str, max_jobs: int = 10) -> list[Job]:
        """
        Search for jobs matching role + location.
        Returns a list of Job objects with at minimum:
          title, company, location, url, platform, description
        """
        ...

    # ── Shared helpers ────────────────────────────────────────────────────────

    async def safe_text(self, selector: str, default: str = "") -> str:
        """Get inner text of a selector, return default if not found."""
        try:
            el = await self.page.query_selector(selector)
            return (await el.inner_text()).strip() if el else default
        except Exception:
            return default

    async def safe_attr(self, selector: str, attr: str, default: str = "") -> str:
        """Get an attribute value of a selector, return default if not found."""
        try:
            el = await self.page.query_selector(selector)
            val = await el.get_attribute(attr) if el else None
            return val.strip() if val else default
        except Exception:
            return default

    async def scroll_down(self, times: int = 3, delay: int = 1000):
        """Scroll down the page to trigger lazy-loaded content."""
        for i in range(times):
            await self.page.evaluate("window.scrollBy(0, window.innerHeight)")
            print(f"    [scroll] {i+1}/{times}")
            await self.page.wait_for_timeout(delay)