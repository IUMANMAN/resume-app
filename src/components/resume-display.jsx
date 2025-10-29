import { useEffect, useRef, useState } from 'react'
import { DEFAULT_GLOBAL_META, DEFAULT_MODULE_META } from '@/app/defaults'
import PersonalInfo from '@/components/modules/PersonalInfo'
import Education from '@/components/modules/Education'
import Experience from '@/components/modules/Experience'
import Skills from '@/components/modules/Skills'
import Projects from '@/components/modules/Projects'
import LanguagesModule from '@/components/modules/Languages'
import Certifications from '@/components/modules/Certifications'
import Awards from '@/components/modules/Awards'
 

export function ResumeDisplay({ data, onEditMeta, isEditing: isEditingProp, onEditingChange, onResetStyles, onEditorState }) {
  if (!data) return null

  const source = data || {}

  // Normalize personal info structure
  const personalInfoRaw = source.personalInfo || {}
  const personalInfo = {
    ...personalInfoRaw,
    name: personalInfoRaw.name || personalInfoRaw.fullName || source.name || '',
    title: personalInfoRaw.title || personalInfoRaw.position || '',
    address: personalInfoRaw.address || personalInfoRaw.location || personalInfoRaw.city || ''
  }

  const summary = source.summary || source.objective || ''

  // Prefer standard keys for module data; fall back to legacy keys when necessary
  const education = source.education || []
  const experience = Array.isArray(source.experience) && source.experience.length
    ? source.experience
    : (source.workExperience || [])
  const skills = source.skills || {}
  const projects = source.projects || []
  const certifications = source.certifications || []
  const awards = source.awards || []
  const languages = Array.isArray(source.languages) && source.languages.length
    ? source.languages
    : (Array.isArray(skills.languages) ? skills.languages : [])

  // refs for measuring heights
  const refs = {
    personalInfo: useRef(null),
    summary: useRef(null),
    experience: useRef(null),
    education: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    certifications: useRef(null),
    awards: useRef(null),
    languages: useRef(null),
  }

  const [isEditing, setIsEditing] = useState(!!isEditingProp)
  useEffect(() => { setIsEditing(!!isEditingProp) }, [isEditingProp])
  // Place parent edit-state callback inside an effect to avoid updating the parent during child render
  useEffect(() => {
    try { onEditingChange?.(isEditing) } catch {}
  }, [isEditing])

  const moduleDefaults = (key) => {
    const m = source?.metadata?.modules?.[key] || {}
    const d = DEFAULT_MODULE_META?.[key] || DEFAULT_MODULE_META.summary
    return {
      bgColor: m.bgColor ?? d.bgColor,
      // Title (module header) styles
      titleFontSize: m.titleFontSize ?? m.h1FontSize ?? d.titleFontSize,
      titleColor: m.titleColor ?? m.fontColor ?? d.titleColor,
      titleAlign: m.titleAlign ?? d.titleAlign,
      h1FontSize: m.h1FontSize ?? d.h1FontSize,
      h2FontSize: m.h2FontSize ?? d.h2FontSize,
      // Text colors: control level-1/level-2 separately
      fontColor: m.fontColor ?? d.fontColor,
      h1FontColor: m.h1FontColor ?? m.fontColor ?? d.h1FontColor,
      h2FontColor: m.h2FontColor ?? m.fontColor ?? d.h2FontColor,
      // Alignment: title, level-1, level-2
      h1Align: m.h1Align ?? d.h1Align,
      h2Align: m.h2Align ?? d.h2Align,
      // Typography: line height, inner padding, spacing between modules
      lineHeight: m.lineHeight ?? d.lineHeight,
      sectionPadding: m.sectionPadding ?? d.sectionPadding,
      moduleSpacingRem: m.moduleSpacingRem ?? d.moduleSpacingRem,
      iconColor: m.iconColor ?? d.iconColor,
      showIcon: typeof m.showIcon === 'boolean' ? m.showIcon : d.showIcon,
      // PersonalInfo-specific photo options
      showPhoto: typeof m.showPhoto === 'boolean' ? m.showPhoto : d.showPhoto,
      photoUrl: m.photoUrl ?? d.photoUrl,
      photoPosition: m.photoPosition ?? d.photoPosition,
      photoSize: m.photoSize ?? d.photoSize,
      // Do not force a default min-height; follow defaults.js
      heightRem: m.heightRem,
    }
  }

  // Global style defaults (for inputs shown in the global control panel and syncing)
  const [globalMeta, setGlobalMeta] = useState(() => ({
    ...DEFAULT_GLOBAL_META
  }))

  const [modulesMeta, setModulesMeta] = useState({
    personalInfo: { height: 0, ...moduleDefaults('personalInfo') },
    summary: { height: 0, ...moduleDefaults('summary') },
    experience: { height: 0, ...moduleDefaults('experience') },
    education: { height: 0, ...moduleDefaults('education') },
    skills: { height: 0, ...moduleDefaults('skills') },
    projects: { height: 0, ...moduleDefaults('projects') },
    certifications: { height: 0, ...moduleDefaults('certifications') },
    awards: { height: 0, ...moduleDefaults('awards') },
    languages: { height: 0, ...moduleDefaults('languages') },
  })

  // Editor: track which module section is expanded (collapsed by default)
  const [openSectionKey, setOpenSectionKey] = useState(null)

  // Flag: changes triggered by user edits that should be emitted (avoid loops from rebuild/auto measurement)
  const emitPendingRef = useRef(false)

  const updateModuleMeta = (key, patch) => {
    emitPendingRef.current = true
    setModulesMeta(prev => {
      const next = { ...prev, [key]: { ...prev[key], ...patch } }
      return next
    })
  }

  const collectAndEmitMeta = () => {
    const readHeight = (r) => (r?.current ? Math.round(r.current.getBoundingClientRect().height) : 0)
    const meta = {
      personalInfo: { ...modulesMeta.personalInfo, height: readHeight(refs.personalInfo) },
      summary: { ...modulesMeta.summary, height: readHeight(refs.summary) },
      experience: { ...modulesMeta.experience, height: readHeight(refs.experience) },
      education: { ...modulesMeta.education, height: readHeight(refs.education) },
      skills: { ...modulesMeta.skills, height: readHeight(refs.skills) },
      projects: { ...modulesMeta.projects, height: readHeight(refs.projects) },
      certifications: { ...modulesMeta.certifications, height: readHeight(refs.certifications) },
      awards: { ...modulesMeta.awards, height: readHeight(refs.awards) },
      languages: { ...modulesMeta.languages, height: readHeight(refs.languages) },
    }
    setModulesMeta(meta)
  }

  // Bridge editor state up to workspace so editor can render as a separate column
  useEffect(() => {
    try {
      onEditorState?.({
        globalMeta,
        setGlobalMeta,
        modulesMeta,
        setModulesMeta,
        openSectionKey,
        setOpenSectionKey,
        updateModuleMeta,
        emitPendingRef,
        isEditing,
        setIsEditing,
      })
    } catch {}
    // We intentionally depend on key editor states to refresh bridge when they change
  }, [globalMeta, modulesMeta, openSectionKey, isEditing])

  // Automatically measure heights and sync to JSON in real time
  const recalcHeightsIfChanged = () => {
    const readHeight = (r) => (r?.current ? Math.round(r.current.getBoundingClientRect().height) : 0)
    const next = { ...modulesMeta }
    const keys = Object.keys(refs)
    let changed = false
    for (const k of keys) {
      if (next[k]?.heightLocked) continue
      const h = readHeight(refs[k])
      if ((next[k]?.height ?? 0) !== h) {
        next[k] = { ...next[k], height: h }
        changed = true
      }
    }
    if (changed) {
      setModulesMeta(next)
    }
  }

  useEffect(() => {
    // When data changes (including resetting default metadata), rebuild local state from JSON module metadata
    const rebuild = {
      personalInfo: { height: 0, heightLocked: false, ...moduleDefaults('personalInfo') },
      summary: { height: 0, heightLocked: false, ...moduleDefaults('summary') },
      experience: { height: 0, heightLocked: false, ...moduleDefaults('experience') },
      education: { height: 0, heightLocked: false, ...moduleDefaults('education') },
      skills: { height: 0, heightLocked: false, ...moduleDefaults('skills') },
      projects: { height: 0, heightLocked: false, ...moduleDefaults('projects') },
      certifications: { height: 0, heightLocked: false, ...moduleDefaults('certifications') },
      awards: { height: 0, heightLocked: false, ...moduleDefaults('awards') },
      languages: { height: 0, heightLocked: false, ...moduleDefaults('languages') },
    }
    setModulesMeta(rebuild)
    // Also sync global style editor state from JSON defaults
    const g = source?.metadata?.global || DEFAULT_GLOBAL_META
    setGlobalMeta({ ...DEFAULT_GLOBAL_META, ...g })
    // After rebuild, measure heights immediately and write to JSON (without overwriting locked values; initially unlocked)
    recalcHeightsIfChanged()
  }, [data])

  useEffect(() => {
    recalcHeightsIfChanged()
  }, [modulesMeta.personalInfo.h1FontSize, modulesMeta.personalInfo.h2FontSize, modulesMeta.summary.h1FontSize, modulesMeta.summary.h2FontSize, modulesMeta.experience.h1FontSize, modulesMeta.experience.h2FontSize, modulesMeta.education.h1FontSize, modulesMeta.education.h2FontSize, modulesMeta.skills.h1FontSize, modulesMeta.skills.h2FontSize, modulesMeta.projects.h1FontSize, modulesMeta.projects.h2FontSize, modulesMeta.certifications.h1FontSize, modulesMeta.certifications.h2FontSize, modulesMeta.awards.h1FontSize, modulesMeta.awards.h2FontSize, modulesMeta.languages.h1FontSize, modulesMeta.languages.h2FontSize])

  // After render commit, sync module meta changes triggered by user to parent to avoid loops
  useEffect(() => {
    if (!onEditMeta) return
    if (emitPendingRef.current) {
      emitPendingRef.current = false
      try { onEditMeta(modulesMeta) } catch {}
    }
  }, [modulesMeta, onEditMeta])

  return (
    <div
      className={`relative mx-auto bg-white dark:bg-neutral-900 shadow-none print:shadow-none rounded-xl border border-neutral-200 animate-slide-up overflow-visible`}
      style={{ width: '100%' }}
    >
      <div className={`p-3 sm:p-8`}>
        {/* Fixed preview width, centered within container */}
        <div className="mr-auto px-2 sm:px-0 break-words" style={{ width: '794px', boxSizing: 'border-box', paddingRight: '12px', wordBreak: 'break-word', overflowWrap: 'anywhere', hyphens: 'auto', overflowX: 'hidden' }}>
        {/* Full width: Personal Info */}
        {personalInfo && (
          <div
            ref={refs.personalInfo}
            style={{
              backgroundColor: modulesMeta.personalInfo.bgColor,
              minHeight: modulesMeta.personalInfo.heightRem || undefined,
              padding: modulesMeta.personalInfo.sectionPadding,
              marginBottom: modulesMeta.personalInfo.moduleSpacingRem,
              lineHeight: modulesMeta.personalInfo.lineHeight,
              overflow: 'visible',
            }}
          >
            <PersonalInfo data={personalInfo} meta={modulesMeta.personalInfo} />
          </div>
        )}

        {/* Full width: Summary (if present) */}
        {summary && (
          <section
            ref={refs.summary}
            style={{
              backgroundColor: modulesMeta.summary.bgColor,
              minHeight: modulesMeta.summary.heightRem || undefined,
              padding: modulesMeta.summary.sectionPadding,
              marginBottom: modulesMeta.summary.moduleSpacingRem,
              lineHeight: modulesMeta.summary.lineHeight,
              overflow: 'hidden',
            }}
          >
            <h2
              className="font-semibold tracking-tight mb-2"
              style={{ fontSize: modulesMeta.summary.titleFontSize, color: modulesMeta.summary.titleColor, textAlign: modulesMeta.summary.titleAlign }}
            >Summary</h2>
            <p
              className="text-gray-700 dark:text-gray-300 leading-7 max-w-[70ch]"
              style={{ color: modulesMeta.summary.h2FontColor, textAlign: modulesMeta.summary.h2Align }}
            >{summary}</p>
          </section>
        )}

        {/* Full width: Experience */}
        {experience && (Array.isArray(experience) ? experience.length > 0 : !!experience) && (
          <div
            ref={refs.experience}
            style={{
              backgroundColor: modulesMeta.experience.bgColor,
              minHeight: modulesMeta.experience.heightRem || undefined,
              padding: modulesMeta.experience.sectionPadding,
              marginBottom: modulesMeta.experience.moduleSpacingRem,
              lineHeight: modulesMeta.experience.lineHeight,
              overflow: 'hidden',
            }}
          >
            <Experience data={experience} meta={modulesMeta.experience} />
          </div>
        )}

        {/* Full width: Education */}
        {education && (Array.isArray(education) ? education.length > 0 : !!education) && (
          <div
            ref={refs.education}
            style={{
              backgroundColor: modulesMeta.education.bgColor,
              minHeight: modulesMeta.education.heightRem || undefined,
              padding: modulesMeta.education.sectionPadding,
              marginBottom: modulesMeta.education.moduleSpacingRem,
              lineHeight: modulesMeta.education.lineHeight,
              overflow: 'hidden',
            }}
          >
            <Education data={education} meta={modulesMeta.education} />
          </div>
        )}

        {/* Full width: Skills */}
        {skills && Object.keys(skills).length > 0 && (
          <div
            ref={refs.skills}
            style={{
              backgroundColor: modulesMeta.skills.bgColor,
              minHeight: modulesMeta.skills.heightRem || undefined,
              padding: modulesMeta.skills.sectionPadding,
              marginBottom: modulesMeta.skills.moduleSpacingRem,
              lineHeight: modulesMeta.skills.lineHeight,
              overflow: 'hidden',
            }}
          >
            <Skills data={skills} meta={modulesMeta.skills} />
          </div>
        )}

        {/* Full width: Projects */}
        {projects && (Array.isArray(projects) ? projects.length > 0 : !!projects) && (
          <div
            ref={refs.projects}
            style={{
              backgroundColor: modulesMeta.projects.bgColor,
              minHeight: modulesMeta.projects.heightRem || undefined,
              padding: modulesMeta.projects.sectionPadding,
              marginBottom: modulesMeta.projects.moduleSpacingRem,
              lineHeight: modulesMeta.projects.lineHeight,
              overflow: 'hidden',
            }}
          >
            <Projects data={projects} meta={modulesMeta.projects} />
          </div>
        )}

        {/* Full width: Certifications */}
        {certifications && (Array.isArray(certifications) ? certifications.length > 0 : !!certifications) && (
          <div
            ref={refs.certifications}
            style={{
              backgroundColor: modulesMeta.certifications.bgColor,
              minHeight: modulesMeta.certifications.heightRem || undefined,
              padding: modulesMeta.certifications.sectionPadding,
              marginBottom: modulesMeta.certifications.moduleSpacingRem,
              lineHeight: modulesMeta.certifications.lineHeight,
              overflow: 'hidden',
            }}
          >
            <Certifications data={certifications} meta={modulesMeta.certifications} />
          </div>
        )}

        {/* Full width: Awards */}
        {awards && (Array.isArray(awards) ? awards.length > 0 : !!awards) && (
          <div
            ref={refs.awards}
            style={{
              backgroundColor: modulesMeta.awards.bgColor,
              minHeight: modulesMeta.awards.heightRem || undefined,
              padding: modulesMeta.awards.sectionPadding,
              marginBottom: modulesMeta.awards.moduleSpacingRem,
              lineHeight: modulesMeta.awards.lineHeight,
              overflow: 'hidden',
            }}
          >
            <Awards data={awards} meta={modulesMeta.awards} />
          </div>
        )}

        {/* Full width: Languages */}
        {languages && (Array.isArray(languages) ? languages.length > 0 : !!languages) && (
          <div
            ref={refs.languages}
            style={{
              backgroundColor: modulesMeta.languages.bgColor,
              minHeight: modulesMeta.languages.heightRem || undefined,
              padding: modulesMeta.languages.sectionPadding,
              marginBottom: modulesMeta.languages.moduleSpacingRem,
              lineHeight: modulesMeta.languages.lineHeight,
              overflow: 'hidden',
            }}
          >
            <LanguagesModule data={languages} meta={modulesMeta.languages} />
          </div>
        )}
        </div>
      </div>

      {/* Editor moved to workspace-level; no inline overlay here */}
    </div>
  )
}