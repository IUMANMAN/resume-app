import { Briefcase } from 'lucide-react'

function ExperienceItem({ item, meta }) {
  if (!item) return null
  const { company, position, period, startDate, endDate, location, description, achievements } = item
  const lines = Array.isArray(description) ? description : (Array.isArray(achievements) ? achievements : (description ? [description] : []))
  const time = period || [startDate, endDate].filter(Boolean).join(' - ')
  return (
    <div className="py-1.5">
      <div className="font-semibold" style={{ fontSize: meta?.h1FontSize, color: meta?.h1FontColor, textAlign: meta?.h1Align }}>{position}{company ? ` · ${company}` : ''}</div>
      <div className="text-xs" style={{ color: meta?.h2FontColor, textAlign: meta?.h2Align }}>{time}{location ? ` · ${location}` : ''}</div>
      {!!lines.length && (
        <ul className="mt-0.5 list-disc list-outside pl-4 text-sm space-y-0.5" style={{ color: meta?.h2FontColor, lineHeight: meta?.lineHeight, textAlign: meta?.h2Align }}>
          {lines.map((l, i) => (
            <li key={`${typeof l === 'string' ? l : 'line'}-${i}`}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Experience({ data, meta }) {
  if (!data) return null
  const list = Array.isArray(data) ? data : [data]
  return (
    <section className="animate-fade-in">
      <div className="flex items-center gap-1.5 mb-1">
        {meta?.showIcon !== false && (
          <Briefcase className="h-5 w-5" style={{ color: meta?.iconColor }} />
        )}
      <h2 className="font-semibold tracking-tight" style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}>Experience</h2>
      </div>
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {list.filter(Boolean).map((item, idx) => (
          <ExperienceItem key={idx} item={item} meta={meta} />
        ))}
      </div>
    </section>
  )
}