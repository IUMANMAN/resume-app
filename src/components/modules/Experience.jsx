import { Briefcase } from 'lucide-react'

function ExperienceItem({ item, meta }) {
  if (!item) return null
  const { company, position, period, startDate, endDate, location, description, achievements } = item
  const lines = Array.isArray(description) ? description : (Array.isArray(achievements) ? achievements : (description ? [description] : []))
  const time = period || [startDate, endDate].filter(Boolean).join(' - ')
  return (
    <div className="mb-3">
      <div className="font-semibold" style={{ fontSize: meta?.h1FontSize, color: meta?.h1FontColor, textAlign: meta?.h1Align }}>{position}{company ? ` · ${company}` : ''}</div>
      <div className="text-xs" style={{ color: meta?.h2FontColor, textAlign: meta?.h2Align }}>{time}{location ? ` · ${location}` : ''}</div>
      {!!lines.length && (
        <ul className="mt-1 list-disc list-inside text-sm" style={{ color: meta?.h2FontColor, lineHeight: meta?.lineHeight, textAlign: meta?.h2Align }}>
          {lines.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      )}
    </div>
  )
}

export default function Experience({ data, meta }) {
  if (!data) return null
  const list = Array.isArray(data) ? data : [data]
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        {meta?.showIcon !== false && (
          <Briefcase className="h-5 w-5" style={{ color: meta?.iconColor }} />
        )}
        <h2 className="font-semibold tracking-tight" style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}>工作经历</h2>
      </div>
      {list.filter(Boolean).map((item, idx) => (
        <ExperienceItem key={idx} item={item} meta={meta} />
      ))}
    </section>
  )
}