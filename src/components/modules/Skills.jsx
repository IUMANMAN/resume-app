import { Code } from 'lucide-react'

export default function Skills({ data, meta }) {
  if (!data) return null
  const items = Array.isArray(data.items) ? data.items : (
    Array.isArray(data) ? data : (
      Array.isArray(data.technical) ? data.technical : []
    )
  )
  const category = data.category || null
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        {meta?.showIcon !== false && (
          <Code className="h-5 w-5" style={{ color: meta?.iconColor }} />
        )}
        <h2 className="font-semibold tracking-tight" style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}>技能</h2>
      </div>
      {category && <div className="text-sm mb-2" style={{ color: meta?.h2FontColor, lineHeight: meta?.lineHeight, textAlign: meta?.h2Align }}>{category}</div>}
      <div className="flex flex-wrap gap-2">
        {items.map((skill, idx) => (
          <span key={idx} className="inline-block rounded bg-blue-50 text-blue-700 px-2.5 py-0.5 text-xs">
            {typeof skill === 'string' ? skill : (skill?.name || '')}
          </span>
        ))}
      </div>
    </section>
  )
}