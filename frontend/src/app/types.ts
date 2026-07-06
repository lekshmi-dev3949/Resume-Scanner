export interface ReviewResult {
  overall_score: number
  strengths: string[]
  weaknesses: string[]
  missing_sections: string[]
  improvement_tips: string[]
  summary: string
}
