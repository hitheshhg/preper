from typing import Dict, Any, Tuple
from backend.core.config import settings
from backend.schemas.models import ReadinessBreakdown

class ReadinessEngine:
    """
    Transparent, configurable readiness calculation engine.
    Computes overall placement readiness score and provides clear attribution
    for changes based on verifiable performance dimensions.
    """

    @classmethod
    def calculate_readiness(
        cls,
        technical: int,
        coding: int,
        communication: int,
        hr: int,
        resume: int,
        problem_solving: int,
        confidence: int,
        previous_score: int = None
    ) -> Tuple[int, str]:
        """
        Calculates weighted placement readiness score (0-100) and produces
        a human-understandable explanation.
        """
        # Weighted calculation
        overall = (
            technical * settings.WEIGHT_TECHNICAL +
            coding * settings.WEIGHT_CODING +
            communication * settings.WEIGHT_COMMUNICATION +
            hr * settings.WEIGHT_HR +
            resume * settings.WEIGHT_RESUME +
            problem_solving * settings.WEIGHT_PROBLEM_SOLVING +
            confidence * settings.WEIGHT_CONSISTENCY
        )
        final_score = int(round(min(100, max(0, overall))))

        # Generate transparent attribution
        if previous_score is None:
            explanation = (
                f"Your baseline readiness is {final_score}/100 based on your onboarding assessment. "
                f"Boost this by taking mock interviews, optimizing your resume, and completing daily quests."
            )
        else:
            diff = final_score - previous_score
            if diff > 0:
                explanation = (
                    f"Your readiness increased by +{diff} points ({previous_score} → {final_score}) "
                    f"due to recent improvements in technical assessments and consistent daily activity."
                )
            elif diff < 0:
                explanation = (
                    f"Your readiness adjusted by {diff} points ({previous_score} → {final_score}). "
                    f"Take a short mock interview today to reinforce your streak and recall."
                )
            else:
                explanation = f"Your readiness score is steady at {final_score}/100. Complete today's quests to level up!"

        return final_score, explanation

    @classmethod
    def get_breakdown(cls, profile_dict: Dict[str, Any]) -> ReadinessBreakdown:
        tech = profile_dict.get("technical_score", 60)
        coding = profile_dict.get("coding_score", 60)
        comm = profile_dict.get("communication_score", 70)
        hr = profile_dict.get("hr_score", 75)
        resume = profile_dict.get("resume_score", 65)
        prob = profile_dict.get("problem_solving_score", 60)
        conf = profile_dict.get("confidence_level", 60)
        prev = profile_dict.get("readiness_score", 65)

        overall, explanation = cls.calculate_readiness(
            technical=tech,
            coding=coding,
            communication=comm,
            hr=hr,
            resume=resume,
            problem_solving=prob,
            confidence=conf,
            previous_score=prev
        )

        return ReadinessBreakdown(
            overall=overall,
            technical=tech,
            coding=coding,
            communication=comm,
            hr=hr,
            resume=resume,
            problem_solving=prob,
            confidence=conf,
            explanation=explanation
        )

readiness_engine = ReadinessEngine()
