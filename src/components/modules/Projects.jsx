import { FolderGit2 } from 'lucide-react'

function ProjectItem({ item, meta }) {
  if (!item) return null
  const { name, description, technologies, period, url } = item
  const techs = Array.isArray(technologies) ? technologies : []
  return (
    <div className="mb-3">
      <div className="font-semibold" style={{ fontSize: meta?.h1FontSize, color: meta?.h1FontColor, textAlign: meta?.h1Align }}>{name}</div>
      {description && <p className="text-sm mt-1" style={{ color: meta?.h2FontColor, lineHeight: meta?.lineHeight, textAlign: meta?.h2Align }}>{description}</p>}
      {!!techs.length && (
        <div className="flex flex-wrap gap-2 mt-1">
          {techs.map((t, i) => (
            <span key={i} className="inline-block rounded bg-purple-50 text-purple-700 px-2 py-0.5 text-xs">{t}</span>
          ))}
        </div>
      )}
      <div className="text-xs mt-1" style={{ color: meta?.h2FontColor, textAlign: meta?.h2Align }}>
        {period}{url ? ' · ' : ''}{url ? (<a href={url} className="underline hover:text-blue-600" target="_blank" rel="noreferrer">{url}</a>) : ''}
      </div>
    </div>
  )
}

export default function Projects({ data, meta }) {
  if (!data) return null
  const list = Array.isArray(data) ? data : [data]
  return (
    <section style={{ backgroundColor: meta?.bgColor, padding: meta?.sectionPadding, marginBottom: meta?.moduleSpacingRem, lineHeight: meta?.lineHeight }}>
      <div className="flex items-center gap-2 mb-2">
        {meta?.showIcon !== false && (
          <FolderGit2 className="h-5 w-5" style={{ color: meta?.iconColor }} />
        )}
        <h2 className="font-semibold tracking-tight" style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}>项目</h2>
      </div>
      {list.filter(Boolean).map((item, idx) => (
        <ProjectItem key={idx} item={item} meta={meta} />
      ))}
    </section>
  )
}