import { Trophy } from 'lucide-react'

function AwardItem({ item, meta }) {
  if (!item) return null
  const { name, issuer, date } = item
  return (
    <div className="py-2">
      <div className="text-sm" style={{ color: meta?.h1FontColor, fontSize: meta?.h1FontSize, textAlign: meta?.h1Align }}>{name}</div>
      <div className="text-xs" style={{ color: meta?.h2FontColor, textAlign: meta?.h2Align }}>{issuer}{date ? ` · ${date}` : ''}</div>
    </div>
  )
}

export default function Awards({ data, meta }) {
  if (!data) return null
  const list = Array.isArray(data) ? data : [data]
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        {meta?.showIcon !== false && (
          <Trophy className="h-5 w-5" style={{ color: meta?.iconColor }} />
        )}
        <h2 className="font-semibold tracking-tight" style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}>奖项</h2>
      </div>
      <div>
        {list.filter(Boolean).map((item, idx) => (
          <AwardItem key={idx} item={item} meta={meta} />
        ))}
      </div>
    </section>
  )
}