from scrappers.internshala import IntershalaScraper
from scrappers.wellfound import WellfoundScraper
from scrappers.linkedin import LinkedInScraper

SCRAPER_MAP = {
    "internshala": IntershalaScraper,
    "wellfound":   WellfoundScraper,
    "linkedin":    LinkedInScraper,
}

__all__ = ["IntershalaScraper", "WellfoundScraper", "LinkedInScraper", "SCRAPER_MAP"]