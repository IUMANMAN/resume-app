import { Award } from 'lucide-react'

function CertItem({ item, meta }) {
  if (!item) return null
  const { name, issuer, date } = item
  return (
    <div className="py-2">
      <div className="text-sm" style={{ color: meta?.h1FontColor, fontSize: meta?.h1FontSize, textAlign: meta?.h1Align }}>{name}</div>
      <div className="text-xs" style={{ color: meta?.h2FontColor, textAlign: meta?.h2Align }}>{issuer}{date ? ` · ${date}` : ''}</div>
    </div>
  )
}

export default function Certifications({ data, meta }) {
  if (!data) return null
  const list = Array.isArray(data) ? data : [data]
  return (
    <section className="animate-fade-in">
      <div className="flex items-center gap-1.5 mb-1">
        {meta?.showIcon !== false && (
          <Award className="h-5 w-5" style={{ color: meta?.iconColor }} />
        )}
      <h2 className="font-semibold tracking-tight" style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}>Certifications</h2>
      </div>
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {list.filter(Boolean).map((item, idx) => (
          <CertItem key={idx} item={item} meta={meta} />
        ))}
      </div>
    </section>
  )
}
