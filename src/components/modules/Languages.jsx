import { Languages as LanguagesIcon } from 'lucide-react'

function LangItem({ item, meta }) {
  if (!item) return null
  const { language, proficiency } = item
  const text = typeof item === 'string' ? item : language
  return (
    <div className="py-2 text-sm" style={{ color: meta?.h1FontColor, fontSize: meta?.h1FontSize, textAlign: meta?.h1Align }}>
      {text}{proficiency ? ` · ${proficiency}` : ''}
    </div>
  )
}

export default function Languages({ data, meta }) {
  if (!data) return null
  const list = Array.isArray(data) ? data : [data]
  return (
    <section className="animate-fade-in">
      <div className="flex items-center gap-1.5 mb-1">
        {meta?.showIcon !== false && (
          <LanguagesIcon className="h-5 w-5" style={{ color: meta?.iconColor }} />
        )}
      <h2 className="font-semibold tracking-tight" style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}>Languages</h2>
      </div>
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {list.filter(Boolean).map((item, idx) => (
          <LangItem key={idx} item={item} meta={meta} />
        ))}
      </div>
    </section>
  )
}