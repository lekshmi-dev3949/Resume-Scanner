from pydantic import BaseModel, Field
from typing import List

class ResumeReview(BaseModel):
    overall_score: int = Field(description="Score out of 10")
    strengths: List[str] = Field(description="What is good about the resume")
    weaknesses: List[str] = Field(description="What is weak or unclear")
    missing_sections: List[str] = Field(description="Important sections not present")
    improvement_tips: List[str] = Field(description="Specific, actionable improvements")
    summary: str = Field(description="One paragraph overall assessment")
