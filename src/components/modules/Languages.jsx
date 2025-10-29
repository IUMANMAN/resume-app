import { Languages as LanguagesIcon } from 'lucide-react'

export default function Languages({ data, meta }) {
  if (!data) return null
  const list = (Array.isArray(data) ? data : [data]).filter(Boolean)
  return (
    <section className="animate-fade-in">
      {/* Single row: icon + title + inline languages */}
      <div
        className="flex flex-wrap items-baseline gap-1.5 mb-1"
        style={{ justifyContent: meta?.titleAlign === 'center' ? 'center' : 'flex-start' }}
      >
        {meta?.showIcon !== false && (
          <LanguagesIcon className="h-5 w-5" style={{ color: meta?.iconColor }} />
        )}
        <h2
          className="font-semibold tracking-tight"
          style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}
        >
          Languages
        </h2>
        {!!list.length && (
          <div
            className="text-sm flex flex-wrap gap-x-2 gap-y-1"
            style={{ color: meta?.h1FontColor, fontSize: meta?.h1FontSize, textAlign: meta?.h1Align }}
          >
            {list.map((item, idx) => {
              const { language, proficiency } = typeof item === 'object' ? item : { language: String(item), proficiency: '' }
              const text = language || String(item)
              const prof = proficiency ? ` · ${proficiency}` : ''
              return (
                <span key={`lang-${idx}`} className="inline-block">
                  {text}{prof}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}