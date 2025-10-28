'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from "@/components/theme-toggle";
import { FileText, Key, Loader2, Download, Eye, EyeOff, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { ResumeDisplay } from '@/components/resume-display'
import { JsonViewer } from '@/components/json-viewer'
import { ConfigPanel } from '@/components/modules/ConfigPanel'
import { InputPanel } from '@/components/modules/InputPanel'
import { DEFAULT_MODULE_META, DEFAULT_GLOBAL_META, ensureDefaultLayout, DEFAULT_PROMPT, DEMO_RESUME_TEXT } from '@/app/defaults'
import { ResumeWorkspace } from '@/components/home/ResumeWorkspace'
import { Header } from '@/components/home/Header'
import { Footer } from '@/components/home/Footer'
import { ErrorAlert } from '@/components/home/ErrorAlert'

// Use unified default prompt imported from defaults.js

export default function Home() {
  const [resumeText, setResumeText] = useState('')
  const [processingParse, setProcessingParse] = useState(false)
  const [processingPdf, setProcessingPdf] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [apiKey, setApiKey] = useState('')
  const [apiProvider, setApiProvider] = useState('openai') // 'openai' or 'deepseek'
  const [showApiKey, setShowApiKey] = useState(false)
  const [resumeData, setResumeData] = useState(null)
  const [jsonText, setJsonText] = useState('')
  // Always realtime sync JSON edits to preview
  const [isEditingModules, setIsEditingModules] = useState(false)
  const [showNoApiModal, setShowNoApiModal] = useState(false)

  // On first visit (or after clearing), show a modal if the API is not configured
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('dismiss-no-api-modal') === '1'
      const key = localStorage.getItem('openai-api-key')
      if (!dismissed && !(key && key.trim())) {
        setShowNoApiModal(true)
      }
    } catch {}
  }, [])

  const copyDefaultPrompt = async () => {
    try {
      await navigator.clipboard.writeText(DEFAULT_PROMPT)
    } catch {}
  }

  

  const setDataAndJson = (nextData) => {
    const ensured = ensureDefaultLayout(nextData)
    setResumeData(ensured)
    try { localStorage.setItem('resume-data', JSON.stringify(ensured)) } catch {}
  }

  // Sync changes from resumeData into jsonText to avoid parent updates during other components' render
  useEffect(() => {
    if (resumeData) {
      setJsonText(JSON.stringify(resumeData, null, 2))
    }
  }, [resumeData])

  // Inject module metadata into the JSON (place metadata at the end for easier viewing below)
  const handleInjectModuleMeta = (modulesMeta) => {
    setResumeData(prev => {
      const base = ensureDefaultLayout(prev || {})
      const listedKeys = ['personalInfo', 'summary', 'education', 'experience', 'workExperience', 'skills', 'projects', 'certifications', 'awards', 'languages', 'metadata']
      const rest = Object.fromEntries(Object.entries(base || {}).filter(([k]) => !listedKeys.includes(k)))
      const nextOrdered = {
        personalInfo: base.personalInfo,
        summary: base.summary,
        education: base.education,
        // Prefer experience; fall back to workExperience if missing
        experience: base.experience ?? base.workExperience,
        skills: base.skills,
        projects: base.projects,
        certifications: base.certifications,
        awards: base.awards,
        languages: base.languages,
        ...rest,
        metadata: {
          ...(base.metadata || {}),
          modules: {
            ...(base.metadata?.modules || {}),
            ...modulesMeta
          }
        }
      }
      try { localStorage.setItem('resume-data', JSON.stringify(nextOrdered)) } catch {}
      return nextOrdered
    })
  }

  // Reset to default layout (no content changes; only reset left/right module order)
  const resetToDefaultLayout = () => {
    setResumeData(prev => {
      const base = ensureDefaultLayout(prev || {})
      const next = {
        ...base,
        metadata: {
          ...base.metadata,
          // no columns; keep any other layout fields intact
          layout: { ...(base.metadata?.layout || {}) },
          modules: { ...DEFAULT_MODULE_META }
        }
      }
      try { localStorage.setItem('resume-data', JSON.stringify(next)) } catch {}
      return next
    })
  }

  // Reset default styles: replace metadata (layout/global/modules) in JSON using defaults.js
  const resetModuleStylesOnly = () => {
    setResumeData(prev => {
      const base = ensureDefaultLayout(prev || {})
      const next = {
        ...base,
        metadata: {
          layout: {},
          global: { ...DEFAULT_GLOBAL_META },
          modules: { ...DEFAULT_MODULE_META }
        }
      }
      // Sync immediately to local cache and left-side JSON text to avoid being overwritten by old resume-json-text
      try {
        localStorage.setItem('resume-data', JSON.stringify(next))
        localStorage.setItem('resume-json-text', JSON.stringify(next, null, 2))
      } catch {}
      setJsonText(JSON.stringify(next, null, 2))
      return next
    })
  }

  // Load API key and provider selection from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai-api-key')
    const savedProvider = localStorage.getItem('api-provider')
    const savedResumeText = localStorage.getItem('resume-text')
    const savedJsonText = localStorage.getItem('resume-json-text')
    const savedDataRaw = localStorage.getItem('resume-data') || localStorage.getItem('resume-result')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
    if (savedProvider) {
      setApiProvider(savedProvider)
    }
    if (savedResumeText) {
      setResumeText(savedResumeText)
    }
    // Prefer restoring the in-progress JSON text
    if (savedJsonText) {
      setJsonText(savedJsonText)
      try {
        const parsed = JSON.parse(savedJsonText)
        setResumeData(parsed)
      } catch {}
    }
    if (savedDataRaw) {
      try {
        const parsed = JSON.parse(savedDataRaw)
        const d = parsed?.data || parsed
        // If not restored from savedJsonText, generate JSON text from data
        setResumeData((prev) => prev ?? d)
        setJsonText((prev) => prev || JSON.stringify(d, null, 2))
      } catch {}
    }
    // If nothing was restored, ensure JSON editor shows an empty object by default
    if (!savedJsonText && !savedDataRaw) {
      setJsonText((prev) => prev || '{}')
    }
  }, [])

  // Save API provider selection to localStorage
  const handleProviderChange = (provider) => {
    setApiProvider(provider)
    localStorage.setItem('api-provider', provider)
    // Clear API key because different providers use different formats
    setApiKey('')
    localStorage.removeItem('openai-api-key')
  }
  const handleApiKeyChange = (e) => {
    const newApiKey = e.target.value
    setApiKey(newApiKey)
    if (newApiKey.trim()) {
      localStorage.setItem('openai-api-key', newApiKey)
    } else {
      localStorage.removeItem('openai-api-key')
    }
  }

  const handleProcess = async () => {
    if (!resumeText.trim()) {
      setError('Please enter resume text.')
      return
    }

    setProcessingParse(true)
    setError(null)
    setResult(null)

    try {
      // If input is valid JSON, load directly and skip any API calls
      let parsed = null
      try { parsed = JSON.parse(resumeText) } catch {}
      if (parsed && typeof parsed === 'object') {
        setDataAndJson(parsed)
        setResult({ source: 'local', message: 'Loaded data from input JSON.' })
        return
      }

      // When input is not JSON: if API is set, call parse endpoint; otherwise show modal guidance
      const key = apiKey?.trim()
      if (key) {
        const response = await fetch('/api/parse-resume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resumeText: resumeText,
            apiKey: key,
            provider: apiProvider
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          if (errorData.fallback && errorData.details) {
            throw new Error(`${errorData.error}\n\n${errorData.details}`)
          }
          throw new Error(errorData.error || 'Resume parsing failed.')
        }

        const data = await response.json()
        setResult(data)
        const d = data?.data || data
        setDataAndJson(d)
      } else {
        // No API key: prompt user to use the default Prompt to generate JSON with an LLM and paste it
        setError(null)
        setShowNoApiModal(true)
      }
    } catch (err) {
      setError(err.message || 'Processing failed, please try again.')
    } finally {
      setProcessingParse(false)
    }
  }

  // Wait for a DOM element to appear (used to wait for preview rendering after parsing)
  const waitForElement = async (id, timeout = 5000) => {
    const start = performance.now()
    while (performance.now() - start < timeout) {
      const el = document.getElementById(id)
      if (el) return el
      await new Promise((r) => setTimeout(r, 50))
    }
    return null
  }

  // One-click PDF generation:
  // - With API: do not re-parse; an existing preview (resumeData) is required; export PDF directly
  // - Without API: if input is valid JSON, load preview and export; otherwise prompt for API/JSON
  const handleProcessToPDF = async () => {
    setProcessingPdf(true)
    setError(null)
    setResult(null)

    try {
      const key = apiKey?.trim()
      if (key) {
        // With API: export PDF using the already rendered preview only
        if (resumeData) {
          const el = await waitForElement('resume-preview', 4000)
          if (el) {
            await handlePrint()
          } else {
            setError('Preview has not rendered yet. Please try again shortly.')
          }
        } else {
          setError('Please click "Start Parsing" to render the preview, then export PDF.')
        }
      } else {
        // No API: if input is valid JSON, load preview and export; otherwise show a hint
        let parsed = null
        try {
          parsed = JSON.parse(resumeText)
        } catch {}
        if (parsed && typeof parsed === 'object') {
          // If preview does not exist yet, load first then export
          if (!resumeData) {
            setDataAndJson(parsed)
            const el = await waitForElement('resume-preview', 4000)
            if (el) {
              await handlePrint()
            } else {
              setError('Preview has not rendered yet. Please try again or re-apply the JSON.')
            }
          } else {
            await handlePrint()
          }
        } else {
          setError('No API configured and input is not valid JSON. Please connect an API or use the default Prompt to generate JSON with your LLM, then paste it here.')
        }
      }
    } catch (err) {
      setError(err.message || 'Processing failed, please try again.')
    } finally {
      setProcessingPdf(false)
    }
  }

  const downloadJSON = () => {
    if (!resumeData) return
    const dataStr = JSON.stringify(resumeData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `resume_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handlePrint = async () => {
    try {
      const el = document.getElementById('resume-preview')
      if (!el) {
        window.print()
        return
      }
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ unit: 'px', format: [canvas.width, canvas.height], compress: true })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(`resume_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (e) {
      try { window.print() } catch {}
    }
  }

  const loadDemoData = () => {
    setResumeText(DEMO_RESUME_TEXT)
    setError(null)
  }

  // Real-time save: write input changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('resume-text', resumeText)
    } catch {}
  }, [resumeText])

  // Real-time save: write parsed result changes to localStorage
  useEffect(() => {
    try {
      if (resumeData) {
        localStorage.setItem('resume-data', JSON.stringify(resumeData))
      } else {
        localStorage.removeItem('resume-data')
      }
    } catch {}
  }, [resumeData])

  // JSON text editing: always sync to preview in realtime
  const handleJsonEdit = (text) => {
    setJsonText(text)
    try {
      const parsed = JSON.parse(text)
      setResumeData(ensureDefaultLayout(parsed))
      setError(null)
    } catch (e) {
      // Keep last valid resumeData without overwriting when text is invalid
    }
  }

  // Removed manual apply; realtime sync makes this unnecessary

  // Section drag: across columns and within column ordering
  const handleMoveSection = ({ sectionKey, toColumn, toIndex }) => {
    if (!sectionKey || !toColumn) return
    setResumeData(prev => {
      const data = ensureDefaultLayout({ ...prev })
      const cols = data.metadata.layout.columns
      let left = Array.isArray(cols.left) ? [...cols.left] : []
      let right = Array.isArray(cols.right) ? [...cols.right] : []
      left = left.filter(k => k !== sectionKey)
      right = right.filter(k => k !== sectionKey)
      const target = toColumn === 'left' ? left : right
      const insertIndex = Math.max(0, Math.min(
        typeof toIndex === 'number' ? toIndex : target.length,
        target.length
      ))
      target.splice(insertIndex, 0, sectionKey)
      const next = {
        ...data,
        metadata: {
          ...data.metadata,
          layout: {
            ...data.metadata.layout,
            columns: {
              left,
              right
            }
          }
        }
      }
      try { localStorage.setItem('resume-data', JSON.stringify(next)) } catch {}
      return next
    })
  }

  // Reorder list items: Experience, Education, Projects, Awards, Languages (top-level)
  const handleReorderItem = ({ sectionKey, fromIndex, toIndex }) => {
    if (typeof fromIndex !== 'number' || typeof toIndex !== 'number') return
    setResumeData(prev => {
      const data = { ...prev }
      let arrRefKey = null
      if (sectionKey === 'workExperience') {
        if (Array.isArray(data.workExperience)) arrRefKey = 'workExperience'
        else arrRefKey = 'experience'
      } else if (sectionKey === 'education') {
        arrRefKey = 'education'
      } else if (sectionKey === 'projects') {
        arrRefKey = 'projects'
      } else if (sectionKey === 'awards') {
        arrRefKey = Array.isArray(data.awards) ? 'awards' : 'certifications'
      } else if (sectionKey === 'languages') {
        arrRefKey = 'languages'
      }
      if (!arrRefKey) return prev
      const arr = Array.isArray(data[arrRefKey]) ? [...data[arrRefKey]] : []
      if (!arr.length) return prev
      const from = Math.max(0, Math.min(fromIndex, arr.length - 1))
      const to = Math.max(0, Math.min(toIndex, arr.length - 1))
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      const next = { ...data, [arrRefKey]: arr }
      try { localStorage.setItem('resume-data', JSON.stringify(next)) } catch {}
      return next
    })
  }

  // Save edited JSON text to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('resume-json-text', jsonText || '')
    } catch {}
  }, [jsonText])

  // Compute availability for one-click PDF generation:
  // - With API: preview must already exist (resumeData)
  // - Without API: input must be valid JSON or preview already exists
  const canGeneratePDF = (apiKey && apiKey.trim())
    ? !!resumeData
    : (() => { try { const o = JSON.parse(resumeText); return !!o && typeof o === 'object' } catch { return !!resumeData } })()
  
  // Result section componentized (height measurement logic moved into ResumeWorkspace)

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col">
      <div className="mx-auto px-1 sm:px-3 lg:px-4 pt-2 pb-4 w-full flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-2">
          <Header />
        </div>

        {/* Main Content */}
        <div className="space-y-2 flex-1 flex flex-col">
          {/* Configuration and Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-full">
            <ConfigPanel
              apiProvider={apiProvider}
              handleProviderChange={handleProviderChange}
              apiKey={apiKey}
              handleApiKeyChange={handleApiKeyChange}
              showApiKey={showApiKey}
              setShowApiKey={setShowApiKey}
              defaultPrompt={DEFAULT_PROMPT}
            />
            <InputPanel
              resumeText={resumeText}
              setResumeText={setResumeText}
              processingParse={processingParse}
              processingPdf={processingPdf}
              loadDemoData={loadDemoData}
              handleProcess={handleProcess}
              handleProcessToPDF={handleProcessToPDF}
              canProcess={!!resumeText}
              canGeneratePDF={canGeneratePDF}
            />
          </div>

          {/* Error Display */}
          <ErrorAlert error={error} />

          {/* Results Section: 始终显示工作区，确保 JSON 模块一直打开 */}
          <ResumeWorkspace
            resumeData={resumeData}
            jsonText={jsonText}
            onJsonChange={handleJsonEdit}
            onDownloadJSON={downloadJSON}
            onPrint={handlePrint}
            isEditingModules={isEditingModules}
            onEditingChange={setIsEditingModules}
            onEditMeta={handleInjectModuleMeta}
          onResetStyles={resetModuleStylesOnly}
          />

          {/* Usage instructions moved to the top and simplified */}
        </div>

        {/* No API Modal */}
        <AlertDialog open={showNoApiModal} onOpenChange={(open) => {
          setShowNoApiModal(open)
          if (!open) try { localStorage.setItem('dismiss-no-api-modal', '1') } catch {}
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>No API configured: Generate JSON with your LLM</AlertDialogTitle>
              <AlertDialogDescription>
                Steps: Copy the "Default Prompt" on the left and run it in your LLM (e.g., ChatGPT, DeepSeek) to obtain structured JSON. Then paste that JSON into the "Resume Text Input" on the left and click "Start Parsing" to render the preview.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowNoApiModal(false)}>Maybe later</AlertDialogCancel>
              <AlertDialogAction onClick={copyDefaultPrompt}>Copy Default Prompt</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Footer />
      </div>
    </div>
  )
}
