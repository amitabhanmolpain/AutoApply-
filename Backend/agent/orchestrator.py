from __future__ import annotations
from agent.state import AgentState
from agent.graph import build_graph
from models.user import UserProfile
from config import get_llm_config, validate_llm_config, ai_required_features


class Orchestrator:
    """
    Public entry point for the AutoApply agent.
    Called by job_controller.py (Flask route) or directly from CLI.

    Usage:
        orch   = Orchestrator()
        result = orch.run(user_profile)
        print(result["total_applied"])
    """

    def __init__(self):
        self.graph = build_graph()

    def run(self, user: UserProfile) -> dict:
        """
        Runs the full pipeline:
          scrape → score → apply → notify
        Returns a summary dict suitable for JSON response.
        """
        initial_state = AgentState(user=user)

        print(f"\n[AutoApply] Starting agent for: {user.name}")
        print(f"[AutoApply] Target role     : {user.target_role}")
        print(f"[AutoApply] Platforms       : {user.platforms}")
        print(f"[AutoApply] Match threshold : {user.match_threshold}%\n")

        llm_cfg = get_llm_config()
        llm_ok, llm_msg = validate_llm_config()
        print(f"[AutoApply] LLM provider    : {llm_cfg.provider}")
        print(f"[AutoApply] LLM enabled     : {llm_cfg.enabled}")
        print(f"[AutoApply] LLM config      : {llm_msg}")
        print("[AutoApply] AI-required features:")
        for feature, description in ai_required_features().items():
            print(f"  - {feature}: {description}")
        print()

        final_state = self.graph.invoke(initial_state)

        # Handle both dict and AgentState returns from graph.invoke()
        if isinstance(final_state, dict):
            print(f"\n[AutoApply] Run complete.")
            print(f"  Scraped : {final_state.get('total_scraped', 0)}")
            print(f"  Applied : {final_state.get('total_applied', 0)}")
            print(f"  Skipped : {final_state.get('total_skipped', 0)}")
            print(f"  Failed  : {final_state.get('total_failed', 0)}")
            
            # Convert applications to dicts if they're objects
            applications = final_state.get('applications', [])
            serialized_apps = [
                app.to_dict() if hasattr(app, 'to_dict') else app
                for app in applications
            ]
            
            # Ensure only JSON-serializable data is returned
            return {
                "status":        final_state.get('status', 'done'),
                "total_scraped": final_state.get('total_scraped', 0),
                "total_applied": final_state.get('total_applied', 0),
                "total_skipped": final_state.get('total_skipped', 0),
                "total_failed":  final_state.get('total_failed', 0),
                "errors":        final_state.get('errors', []),
                "applications":  serialized_apps,
            }
        else:
            print(f"\n[AutoApply] Run complete.")
            print(f"  Scraped : {final_state.total_scraped}")
            print(f"  Applied : {final_state.total_applied}")
            print(f"  Skipped : {final_state.total_skipped}")
            print(f"  Failed  : {final_state.total_failed}")
            return final_state.summary()