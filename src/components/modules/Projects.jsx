import { memo, useMemo } from 'react'
import { FolderGit2 } from 'lucide-react'

const ProjectItem = memo(function ProjectItem({ item, meta }) {
  if (!item) return null
  const { name, description, technologies, period, url } = item
  const techs = Array.isArray(technologies) ? technologies : []
  // 去重并规范化技术栈，避免重复渲染与不稳定 key
  const normalizedTechs = useMemo(() => {
    try {
      const arr = techs.map((t) => (typeof t === 'string' ? t : (t?.name || ''))).filter(Boolean)
      return Array.from(new Set(arr))
    } catch {
      return techs
    }
  }, [techs])
  return (
    <div className="py-1.5">
      <div className="font-semibold" style={{ fontSize: meta?.h1FontSize, color: meta?.h1FontColor, textAlign: meta?.h1Align }}>{name}</div>
      {description && <p className="text-sm mt-0.5" style={{ color: meta?.h2FontColor, lineHeight: meta?.lineHeight, textAlign: meta?.h2Align }}>{description}</p>}
      {!!normalizedTechs.length && (
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {normalizedTechs.map((t, i) => (
            <span key={`${t}-${i}`} className="inline-block rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-700 px-2 py-0.5 text-xs dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-600">{t}</span>
          ))}
        </div>
      )}
      <div className="text-xs mt-0.5" style={{ color: meta?.h2FontColor, textAlign: meta?.h2Align }}>
        {period}{url ? ' · ' : ''}{url ? (<a href={url} className="underline hover:text-blue-600" target="_blank" rel="noreferrer">{url}</a>) : ''}
      </div>
    </div>
  )
})

function Projects({ data, meta }) {
  if (!data) return null
  const list = Array.isArray(data) ? data : [data]
  return (
    <section className="animate-fade-in" style={{ backgroundColor: meta?.bgColor, padding: meta?.sectionPadding, marginBottom: meta?.moduleSpacingRem, lineHeight: meta?.lineHeight }}>
      <div className="flex items-center gap-1.5 mb-1">
        {meta?.showIcon !== false && (
          <FolderGit2 className="h-5 w-5" style={{ color: meta?.iconColor }} />
        )}
      <h2 className="font-semibold tracking-tight" style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}>Projects</h2>
      </div>
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {list.filter(Boolean).map((item, idx) => (
          <ProjectItem key={idx} item={item} meta={meta} />
        ))}
      </div>
    </section>
  )
}

export default memo(Projects)