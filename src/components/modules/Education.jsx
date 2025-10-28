import { GraduationCap } from 'lucide-react'

function EducationItem({ item, meta }) {
  if (!item) return null
  const { institution, degree, major, period, graduationDate, gpa, location } = item
  return (
    <div className="mb-3">
      <div className="font-semibold" style={{ fontSize: meta?.h1FontSize, color: meta?.h1FontColor, textAlign: meta?.h1Align }}>{institution}</div>
      <div className="text-sm" style={{ color: meta?.h2FontColor, lineHeight: meta?.lineHeight, textAlign: meta?.h2Align }}>{degree}{major ? ` · ${major}` : ''}</div>
      <div className="text-xs" style={{ color: meta?.h2FontColor, textAlign: meta?.h2Align }}>{period || graduationDate}{location ? ` · ${location}` : ''}</div>
      {gpa && <div className="text-xs" style={{ color: meta?.h2FontColor, textAlign: meta?.h2Align }}>GPA: {gpa}</div>}
    </div>
  )
}

export default function Education({ data, meta }) {
  if (!data) return null
  const list = Array.isArray(data) ? data : [data]
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        {meta?.showIcon !== false && (
          <GraduationCap className="h-5 w-5" style={{ color: meta?.iconColor }} />
        )}
        <h2 className="font-semibold tracking-tight" style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}>教育经历</h2>
      </div>
      {list.filter(Boolean).map((item, idx) => (
        <EducationItem key={idx} item={item} meta={meta} />
      ))}
    </section>
  )
}