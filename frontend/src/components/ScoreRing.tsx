export default function ScoreRing({ score }: { score: number }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const progress = (score / 10) * circumference
  const color = score >= 7 ? '#22c55e' : score >= 5 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-1">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        <text x="48" y="44" textAnchor="middle" fontSize="22" fontWeight="700" fill={color} dominantBaseline="central">
          {score}
        </text>
        <text x="48" y="64" textAnchor="middle" fontSize="10" fill="#9ca3af">
          / 10
        </text>
      </svg>
      <span className="text-xs text-gray-400 font-medium">Score</span>
    </div>
  )
}
