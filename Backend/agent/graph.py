from __future__ import annotations
import asyncio
import traceback
from langgraph.graph import StateGraph, END

from agent.state import AgentState
from models.job import Job
from models.application import Application
from scorers.match_scorer import MatchScorer


# ── Node functions ────────────────────────────────────────────────────────────
# Each node receives the full AgentState, mutates it, and returns it.
# LangGraph calls them in the order defined by add_edge() below.


def scrape_jobs(state: AgentState) -> AgentState:
    """
    Node 1 — Scrape jobs from all configured platforms in parallel.
    Currently uses mock data so the graph runs end-to-end without Playwright.
    Replace _scrape_platform() with real scraper calls when scrappers/ is ready.
    """
    state.status = "scraping"
    state.raw_jobs = []

    for platform in state.user.platforms:
        state.current_platform = platform
        try:
            jobs = _scrape_platform(platform, state.user.target_role,
                                    state.user.target_locations)
            state.raw_jobs.extend(jobs)
        except Exception as e:
            state.log_error(f"Scrape failed [{platform}]: {e}")

    state.total_scraped = len(state.raw_jobs)
    return state


def score_jobs(state: AgentState) -> AgentState:
    """
    Node 2 — Score every scraped job against the user's resume.
    Splits jobs into apply_list and skip_list based on match threshold.
    """
    state.status = "scoring"
    scorer = MatchScorer(threshold=state.user.match_threshold)

    scored_pairs = scorer.score_batch(state.user, state.raw_jobs)

    for job, result in scored_pairs:
        state.scored_jobs.append(job)
        if result.verdict == "apply":
            state.apply_list.append(job)
        else:
            job.status      = "skipped"
            job.skip_reason = result.skip_reason
            state.skip_list.append(job)

    state.total_skipped = len(state.skip_list)
    return state


def apply_jobs(state: AgentState) -> AgentState:
    """
    Node 3 — Attempt to apply to every job in apply_list.
    Currently logs a mock application.
    Replace _submit_application() with real Playwright filler when filler/ is ready.
    """
    state.status = "applying"

    for job in state.apply_list:
        try:
            success = _submit_application(job, state.user)
            if success:
                job.status = "applied"
                state.applications.append(Application(
                    job_title   = job.title,
                    company     = job.company,
                    platform    = job.platform,
                    url         = job.url,
                    match_score = job.match_score,
                    status      = "applied",
                ))
                state.total_applied += 1
            else:
                raise RuntimeError("Form submission returned False")

        except Exception as e:
            job.status      = "failed"
            job.skip_reason = str(e)
            state.total_failed += 1
            state.log_error(f"Apply failed [{job.title} @ {job.company}]: {e}")
            state.applications.append(Application(
                job_title   = job.title,
                company     = job.company,
                platform    = job.platform,
                url         = job.url,
                match_score = job.match_score,
                status      = "failed",
            ))

    # Add skip records to applications log for Telegram summary
    for job in state.skip_list:
        state.applications.append(Application(
            job_title   = job.title,
            company     = job.company,
            platform    = job.platform,
            url         = job.url,
            match_score = job.match_score,
            status      = "skipped",
            skip_reason = job.skip_reason,
        ))

    return state


def send_summary(state: AgentState) -> AgentState:
    """
    Node 4 — Send Telegram daily summary.
    Currently prints to console.
    Replace with real Telegram bot call when notifier/ is ready.
    """
    state.status = "notifying"

    lines = [
        f"AutoApply Daily Summary — {state.user.target_role}",
        f"{'─' * 40}",
        f"Jobs analyzed  : {state.total_scraped}",
        f"Applied        : {state.total_applied}",
        f"Skipped        : {state.total_skipped}",
        f"Failed         : {state.total_failed}",
        "",
        "Applications:",
    ]

    for app in state.applications:
        lines.append("  " + app.summary_line())

    if state.errors:
        lines.append("\nErrors:")
        for err in state.errors:
            lines.append(f"  ⚠️  {err}")

    summary_text = "\n".join(lines)

    # TODO: replace with telegram_bot.send(summary_text)
    print("\n" + summary_text)

    state.status = "done"
    return state


# ── Stub helpers (replace with real implementations later) ────────────────────

def _scrape_platform(platform: str, role: str, locations: list[str]) -> list[Job]:
    """
    Dispatches to the correct scraper for each platform.
    Runs the async scraper synchronously using asyncio.run().
    """
    from scrappers import SCRAPER_MAP

    ScraperClass = SCRAPER_MAP.get(platform)
    if not ScraperClass:
        print(f"  [graph] No scraper for platform: {platform}")
        return []

    location = locations[0] if locations else "Remote"

    async def _run():
        scraper = ScraperClass(headless=True)
        return await scraper.search(role=role, location=location, max_jobs=8)

    try:
        return asyncio.run(_run())
    except Exception as e:
        print(f"  [graph] Scraper error [{platform}]: {e}")
        return []


def _submit_application(job: Job, user) -> bool:
    """
    STUB — simulates a successful form submission.
    Replace with: from filler.form_filler import FormFiller
    """
    print(f"  [mock apply] {job.title} @ {job.company} ({job.platform})")
    return True


# ── Build the graph ───────────────────────────────────────────────────────────

def build_graph() -> StateGraph:
    graph = StateGraph(AgentState)

    graph.add_node("scrape_jobs",  scrape_jobs)
    graph.add_node("score_jobs",   score_jobs)
    graph.add_node("apply_jobs",   apply_jobs)
    graph.add_node("send_summary", send_summary)

    graph.set_entry_point("scrape_jobs")
    graph.add_edge("scrape_jobs",  "score_jobs")
    graph.add_edge("score_jobs",   "apply_jobs")
    graph.add_edge("apply_jobs",   "send_summary")
    graph.add_edge("send_summary", END)

    return graph.compile()