import hashlib
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from backend.schemas.models import (
    ResumeAnalysisV2,
    ResumeVersionRecord,
    TailoredSummaryResponse,
    ImprovedBullet
)
from backend.services.ai_service import ai_service
from backend.api.auth import USER_PROFILES

logger = logging.getLogger(__name__)

class ResumeService:
    """
    Business logic layer for Resume Intelligence.
    Handles version control, caching, history tracking, and profile scoring synchronization.
    """

    def __init__(self):
        # In-memory session store: user_id -> List[ResumeAnalysisV2]
        self._user_analyses: Dict[str, List[ResumeAnalysisV2]] = {}
        # Content hash cache: hash(text + target_role + jd) -> ResumeAnalysisV2
        self._analysis_cache: Dict[str, ResumeAnalysisV2] = {}

    def _compute_hash(self, text: str, target_role: str, job_description: Optional[str]) -> str:
        payload = f"{text.strip()}|{target_role.strip()}|{(job_description or '').strip()}"
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    def get_user_history(self, user_id: str) -> List[ResumeVersionRecord]:
        analyses = self._user_analyses.get(user_id, [])
        return [
            ResumeVersionRecord(
                version_id=a.version_id,
                version_name=a.version_name,
                file_name=a.file_name,
                created_at=datetime.now().strftime("%b %d, %Y"),
                overall_score=a.overall_score,
                ats_score=a.detailed_scores.ats_compatibility.score,
                job_match_score=a.job_match.match_percentage if a.job_match.has_job_description else None,
                target_role=a.job_match.target_role
            )
            for a in analyses
        ]

    def analyze_resume(
        self,
        raw_text: str,
        filename: str = "resume.pdf",
        target_role: str = "Software Development Engineer",
        job_description: Optional[str] = None,
        user_id: str = "demo-user-123"
    ) -> ResumeAnalysisV2:
        cache_key = self._compute_hash(raw_text, target_role, job_description)

        # Check existing user history to determine version number
        existing_history = self._user_analyses.setdefault(user_id, [])
        version_num = len(existing_history) + 1
        version_id = f"v{version_num}-{cache_key[:8]}"
        version_name = f"Resume v{version_num}"

        # Check cache to avoid duplicate expensive AI runs
        if cache_key in self._analysis_cache:
            logger.info("Serving resume analysis from cache.")
            cached = self._analysis_cache[cache_key]
            # Return fresh view with updated history
            cached.score_history = self.get_user_history(user_id)
            return cached

        # Execute AI analysis
        analysis: ResumeAnalysisV2 = ai_service.analyze_resume_v2(
            raw_text=raw_text,
            filename=filename,
            target_role=target_role,
            job_description=job_description,
            version_id=version_id,
            version_name=version_name
        )

        # Record into history
        existing_history.append(analysis)
        self._analysis_cache[cache_key] = analysis

        # Update historical score tracking on the analysis
        analysis.score_history = self.get_user_history(user_id)

        # Synchronize user profile resume score & award XP
        if user_id in USER_PROFILES:
            profile = USER_PROFILES[user_id]
            profile["resume_score"] = analysis.detailed_scores.ats_compatibility.score
            # Recalculate overall readiness
            tech = profile.get("technical_score", 60)
            code = profile.get("coding_score", 60)
            comm = profile.get("communication_score", 70)
            hr = profile.get("hr_score", 75)
            res_sc = profile["resume_score"]
            ps = profile.get("problem_solving_score", 60)
            weighted = int(
                tech * 0.20 +
                code * 0.15 +
                comm * 0.15 +
                hr * 0.10 +
                res_sc * 0.15 +
                ps * 0.15 +
                10  # confidence & consistency
            )
            profile["readiness_score"] = min(99, max(40, weighted))
            profile["total_xp"] = profile.get("total_xp", 450) + 75

        return analysis

    def generate_summary(self, resume_text: str, target_role: str) -> TailoredSummaryResponse:
        return ai_service.generate_tailored_summary(resume_text, target_role)

    def rewrite_bullet(self, bullet: str, target_role: str, context: str = "") -> ImprovedBullet:
        return ai_service.rewrite_bullet_v2(bullet, target_role, context)

resume_service = ResumeService()
