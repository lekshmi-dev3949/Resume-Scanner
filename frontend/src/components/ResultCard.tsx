type Color = 'green' | 'amber' | 'red'

const styles: Record<Color, { card: string; dot: string }> = {
  green: { card: 'border-green-100 bg-green-50', dot: 'bg-green-400' },
  amber: { card: 'border-amber-100 bg-amber-50', dot: 'bg-amber-400' },
  red:   { card: 'border-red-100 bg-red-50',     dot: 'bg-red-400'   },
}

export default function ResultCard({
  title, emoji, items, color,
}: {
  title: string
  emoji: string
  items: string[]
  color: Color
}) {
  const s = styles[color]
  return (
    <div className={`rounded-2xl border p-5 ${s.card}`}>
      <h3 className="font-semibold text-gray-900 mb-3 text-sm">
        {emoji} {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-700">
            <span className={`mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
