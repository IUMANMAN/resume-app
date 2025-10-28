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
import { Button } from '@/components/ui/button'

export function ResumeDisplay({ data, onEditMeta, isEditing: isEditingProp, onEditingChange, onResetStyles }) {
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
      className={`relative mx-auto bg-white dark:bg-neutral-900 shadow-none print:shadow-none rounded-xl border border-neutral-200 animate-slide-up overflow-hidden`}
      style={{ width: '100%' }}
    >
      <div className={`p-8 ${isEditing ? 'md:pr-80' : ''}`}>
        {/* Fixed preview width, centered within container */}
        <div className="mx-auto" style={{ maxWidth: '794px' }}>
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
            }}
          >
            <LanguagesModule data={languages} meta={modulesMeta.languages} />
          </div>
        )}
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-0 right-0 w-80 h-full border-l bg-white dark:bg-gray-800 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Module Style Editor</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false)
              }}
            >
              Close
            </Button>
          </div>
          <div className="mb-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                // Trigger parent to reset module styles (layout columns unaffected)
                try { onResetStyles?.() } catch {}
              }}
              className="w-full"
            >
              Restore Default Styles
            </Button>
          </div>

          {/* Global style settings: apply to all modules */}
          <div className="mb-4 border rounded p-3">
            <div className="text-xs font-semibold mb-2">Global Styles</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs w-24">Title Font Size</label>
              <input type="text" className="flex-1 text-xs border rounded px-2 py-1" placeholder="e.g. 1.25rem" value={globalMeta.titleFontSize}
                onChange={(e) => {
                  const v = e.target.value
                  emitPendingRef.current = true
                  setGlobalMeta(prev => ({ ...prev, titleFontSize: v }))
                  setModulesMeta(prev => {
                    const next = { ...prev }
                    Object.keys(next).forEach(k => { next[k] = { ...next[k], titleFontSize: v } })
                    return next
                  })
                }} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-24">Title Color</label>
              <input type="color" className="h-7 w-12 p-0 border" value={globalMeta.titleColor}
                onChange={(e) => {
                  const v = e.target.value
                  emitPendingRef.current = true
                  setGlobalMeta(prev => ({ ...prev, titleColor: v }))
                  setModulesMeta(prev => {
                    const next = { ...prev }
                    Object.keys(next).forEach(k => { next[k] = { ...next[k], titleColor: v } })
                    return next
                  })
                }} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-24">Title Alignment</label>
              <select className="w-28 text-xs border rounded px-2 py-1" value={globalMeta.titleAlign}
                onChange={(e) => {
                  const v = e.target.value
                  emitPendingRef.current = true
                  setGlobalMeta(prev => ({ ...prev, titleAlign: v }))
                  setModulesMeta(prev => {
                    const next = { ...prev }
                    Object.keys(next).forEach(k => { next[k] = { ...next[k], titleAlign: v } })
                    return next
                  })
                }}>
                <option value="left">Left</option>
                <option value="center">Center</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-24">Primary Font Size</label>
              <input type="text" className="flex-1 text-xs border rounded px-2 py-1" placeholder="e.g. 1.25rem" value={globalMeta.h1FontSize}
                onChange={(e) => {
                  const v = e.target.value
                  emitPendingRef.current = true
                  setGlobalMeta(prev => ({ ...prev, h1FontSize: v }))
                  setModulesMeta(prev => {
                    const next = { ...prev }
                    Object.keys(next).forEach(k => { next[k] = { ...next[k], h1FontSize: v } })
                    return next
                  })
                }} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-24">Primary Color</label>
              <input type="color" className="h-7 w-12 p-0 border" value={globalMeta.h1FontColor}
                onChange={(e) => {
                  const v = e.target.value
                  emitPendingRef.current = true
                  setGlobalMeta(prev => ({ ...prev, h1FontColor: v }))
                  setModulesMeta(prev => {
                    const next = { ...prev }
                    Object.keys(next).forEach(k => { next[k] = { ...next[k], h1FontColor: v } })
                    return next
                  })
                }} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-24">Primary Alignment</label>
              <select className="w-28 text-xs border rounded px-2 py-1" value={globalMeta.h1Align}
                onChange={(e) => {
                  const v = e.target.value
                  emitPendingRef.current = true
                  setGlobalMeta(prev => ({ ...prev, h1Align: v }))
                  setModulesMeta(prev => {
                    const next = { ...prev }
                    Object.keys(next).forEach(k => { next[k] = { ...next[k], h1Align: v } })
                    return next
                  })
                }}>
                <option value="left">Left</option>
                <option value="center">Center</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-24">Secondary Font Size</label>
              <input type="text" className="flex-1 text-xs border rounded px-2 py-1" placeholder="e.g. 1rem" value={globalMeta.h2FontSize}
                onChange={(e) => {
                  const v = e.target.value
                  emitPendingRef.current = true
                  setGlobalMeta(prev => ({ ...prev, h2FontSize: v }))
                  setModulesMeta(prev => {
                    const next = { ...prev }
                    Object.keys(next).forEach(k => { next[k] = { ...next[k], h2FontSize: v } })
                    return next
                  })
                }} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-24">Secondary Color</label>
              <input type="color" className="h-7 w-12 p-0 border" value={globalMeta.h2FontColor}
                onChange={(e) => {
                  const v = e.target.value
                  emitPendingRef.current = true
                  setGlobalMeta(prev => ({ ...prev, h2FontColor: v }))
                  setModulesMeta(prev => {
                    const next = { ...prev }
                    Object.keys(next).forEach(k => { next[k] = { ...next[k], h2FontColor: v } })
                    return next
                  })
                }} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-24">Secondary Alignment</label>
              <select className="w-28 text-xs border rounded px-2 py-1" value={globalMeta.h2Align}
                onChange={(e) => {
                  const v = e.target.value
                  emitPendingRef.current = true
                  setGlobalMeta(prev => ({ ...prev, h2Align: v }))
                  setModulesMeta(prev => {
                    const next = { ...prev }
                    Object.keys(next).forEach(k => { next[k] = { ...next[k], h2Align: v } })
                    return next
                  })
                }}>
                <option value="left">Left</option>
                <option value="center">Center</option>
              </select>
            </div>
              <div className="flex items-center gap-2">
                <label className="text-xs w-24">Line Height</label>
                <input type="text" className="w-28 text-xs border rounded px-2 py-1" placeholder="e.g. 1.6" value={globalMeta.lineHeight}
                  onChange={(e) => {
                    const v = e.target.value
                    emitPendingRef.current = true
                    setGlobalMeta(prev => ({ ...prev, lineHeight: v }))
                    setModulesMeta(prev => {
                      const next = { ...prev }
                      Object.keys(next).forEach(k => { next[k] = { ...next[k], lineHeight: v } })
                      return next
                    })
                  }} />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs w-24">Section Padding</label>
                <input type="text" className="w-28 text-xs border rounded px-2 py-1" placeholder="e.g. 1rem" value={globalMeta.sectionPadding}
                  onChange={(e) => {
                    const v = e.target.value
                    emitPendingRef.current = true
                    setGlobalMeta(prev => ({ ...prev, sectionPadding: v }))
                    setModulesMeta(prev => {
                      const next = { ...prev }
                      Object.keys(next).forEach(k => { next[k] = { ...next[k], sectionPadding: v } })
                      return next
                    })
                  }} />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs w-24">Module Spacing</label>
                <input type="text" className="w-28 text-xs border rounded px-2 py-1" placeholder="e.g. 2rem" value={globalMeta.moduleSpacingRem}
                  onChange={(e) => {
                    const v = e.target.value
                    emitPendingRef.current = true
                    setGlobalMeta(prev => ({ ...prev, moduleSpacingRem: v }))
                    setModulesMeta(prev => {
                      const next = { ...prev }
                      Object.keys(next).forEach(k => { next[k] = { ...next[k], moduleSpacingRem: v } })
                      return next
                    })
                  }} />
              </div>
            </div>
          </div>

          {Object.entries(modulesMeta).map(([key, meta]) => (
            <div key={key} className="mb-6">
              <div className="text-xs font-semibold mb-2">{key}</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Background</label>
                  <input type="color" value={meta.bgColor} onChange={(e) => updateModuleMeta(key, { bgColor: e.target.value })} className="h-7 w-12 p-0 border" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Title Color</label>
                  <input type="color" value={meta.titleColor} onChange={(e) => updateModuleMeta(key, { titleColor: e.target.value })} className="h-7 w-12 p-0 border" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Icon Color</label>
                  <input type="color" value={meta.iconColor} onChange={(e) => updateModuleMeta(key, { iconColor: e.target.value })} className="h-7 w-12 p-0 border" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Show Icon</label>
                  <input type="checkbox" checked={!!meta.showIcon} onChange={(e) => updateModuleMeta(key, { showIcon: e.target.checked })} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Title Font Size</label>
                  <input type="text" value={meta.titleFontSize} onChange={(e) => updateModuleMeta(key, { titleFontSize: e.target.value })} placeholder="e.g. 1.25rem" className="flex-1 text-xs border rounded px-2 py-1" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Title Alignment</label>
                  <select value={meta.titleAlign} onChange={(e) => updateModuleMeta(key, { titleAlign: e.target.value })} className="w-28 text-xs border rounded px-2 py-1">
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Primary Font Size</label>
                  <input type="text" value={meta.h1FontSize} onChange={(e) => updateModuleMeta(key, { h1FontSize: e.target.value })} placeholder="e.g. 1.25rem" className="flex-1 text-xs border rounded px-2 py-1" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Primary Color</label>
                  <input type="color" value={meta.h1FontColor} onChange={(e) => updateModuleMeta(key, { h1FontColor: e.target.value })} className="h-7 w-12 p-0 border" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Primary Alignment</label>
                  <select value={meta.h1Align} onChange={(e) => updateModuleMeta(key, { h1Align: e.target.value })} className="w-28 text-xs border rounded px-2 py-1">
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Secondary Font Size</label>
                  <input type="text" value={meta.h2FontSize} onChange={(e) => updateModuleMeta(key, { h2FontSize: e.target.value })} placeholder="e.g. 1rem" className="flex-1 text-xs border rounded px-2 py-1" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Secondary Color</label>
                  <input type="color" value={meta.h2FontColor} onChange={(e) => updateModuleMeta(key, { h2FontColor: e.target.value })} className="h-7 w-12 p-0 border" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Secondary Alignment</label>
                  <select value={meta.h2Align} onChange={(e) => updateModuleMeta(key, { h2Align: e.target.value })} className="w-28 text-xs border rounded px-2 py-1">
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Line Height</label>
                  <input type="text" value={meta.lineHeight} onChange={(e) => updateModuleMeta(key, { lineHeight: e.target.value })} placeholder="e.g. 1.6" className="w-28 text-xs border rounded px-2 py-1" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Section Padding</label>
                  <input type="text" value={meta.sectionPadding} onChange={(e) => updateModuleMeta(key, { sectionPadding: e.target.value })} placeholder="e.g. 1rem" className="w-28 text-xs border rounded px-2 py-1" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Module Spacing</label>
                  <input type="text" value={meta.moduleSpacingRem} onChange={(e) => updateModuleMeta(key, { moduleSpacingRem: e.target.value })} placeholder="e.g. 2rem" className="w-28 text-xs border rounded px-2 py-1" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs w-20">Min Height (rem)</label>
                  <input
                    type="text"
                    value={meta.heightRem || ''}
                    onChange={(e) => updateModuleMeta(key, { heightRem: e.target.value, heightLocked: true })}
                    placeholder="e.g. 12rem"
                    className="w-28 text-xs border rounded px-2 py-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}