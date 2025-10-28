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
    <section className="animate-fade-in">
      <div className="flex items-center gap-1.5 mb-1">
        {meta?.showIcon !== false && (
          <Code className="h-5 w-5" style={{ color: meta?.iconColor }} />
        )}
      <h2 className="font-semibold tracking-tight" style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}>Skills</h2>
      </div>
      {category && <div className="text-sm mb-1" style={{ color: meta?.h2FontColor, lineHeight: meta?.lineHeight, textAlign: meta?.h2Align }}>{category}</div>}
  <div className="flex flex-wrap gap-1.5">
        {items.map((skill, idx) => {
          const label = typeof skill === 'string' ? skill : (skill?.name || '')
          const key = label ? `${label}-${idx}` : `skill-${idx}`
          return (
            <span key={key} className="inline-block rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-700 px-2 py-0.5 text-xs dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-600">
              {label}
            </span>
          )
        })}
      </div>
    </section>
  )
}