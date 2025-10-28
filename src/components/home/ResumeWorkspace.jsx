"use client"

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Download } from 'lucide-react'
// 动态按需加载 JsonViewer，减少首屏包体积（命名导出）
const JsonViewer = dynamic(
  () => import('@/components/json-viewer').then(mod => mod.JsonViewer),
  { ssr: false }
)
// 动态引入简历预览（命名导出），需从模块中提取 ResumeDisplay 组件
const ResumeDisplay = dynamic(
  () => import('@/components/resume-display').then(mod => mod.ResumeDisplay),
  { ssr: false }
)

export function ResumeWorkspace({
  resumeData,
  jsonText,
  onJsonChange,
  onDownloadJSON,
  onPrint,
  isEditingModules,
  onEditingChange,
  onEditMeta,
  onResetStyles,
}) {
  const resumeColRef = useRef(null)
  const [resumeColHeight, setResumeColHeight] = useState(0)
  const [leftWidth, setLeftWidth] = useState(460)
  const [isNarrow, setIsNarrow] = useState(false)
  const containerRef = useRef(null)
  const draggingRef = useRef(false)

  // compute clamp with container width, ensuring both sides have minimum widths
  const clampWithContainer = (px) => {
    const rect = containerRef.current?.getBoundingClientRect()
    const leftMin = isEditingModules ? 320 : 340
    const rightMin = isEditingModules ? 520 : 560
    if (!rect) {
      return Math.min(isEditingModules ? 500 : 540, Math.max(leftMin, px))
    }
    const maxLeft = Math.max(leftMin, rect.width - rightMin)
    return Math.min(maxLeft, Math.max(leftMin, px))
  }

  const measureRightColumn = () => {
    const el = resumeColRef.current
    if (el) {
      const h = el.scrollHeight || el.offsetHeight || 0
      setResumeColHeight(h)
    }
  }

  useEffect(() => {
    measureRightColumn()
  }, [resumeData, isEditingModules])

  // Keep the left column width within range on init and window resize
  useEffect(() => {
    const init = () => {
      const vw = window.innerWidth || 1200
      setIsNarrow(vw < 768)
      const base = Math.round(vw * (isEditingModules ? 0.42 : 0.46))
      setLeftWidth(clampWithContainer(base))
    }
    init()
    const onResize = () => {
      const vw = window.innerWidth || 1200
      setIsNarrow(vw < 768)
      setLeftWidth((w) => clampWithContainer(w))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isEditingModules])

  useEffect(() => {
    const onResize = () => measureRightColumn()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // 始终渲染工作区以保证 JSON 模块可见
  // 即使没有数据也显示空的 JSON 编辑区域

  // Drag divider to resize
  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return
      const rect = containerRef.current?.getBoundingClientRect()
      const x = e.clientX
      if (rect) {
        const relX = x - rect.left
        setLeftWidth(clampWithContainer(relX))
      }
    }
    const onUp = () => { draggingRef.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isEditingModules])

  // Shortcuts: save JSON, print PDF, toggle module editor
  useEffect(() => {
    const onKey = (e) => {
      const key = e.key?.toLowerCase()
      if ((e.ctrlKey || e.metaKey) && key === 's') {
        e.preventDefault()
        try { onDownloadJSON?.() } catch {}
      } else if ((e.ctrlKey || e.metaKey) && key === 'p') {
        e.preventDefault()
        try { onPrint?.() } catch {}
      } else if ((e.ctrlKey || e.metaKey) && key === 'e') {
        e.preventDefault()
        try { onEditingChange?.(!isEditingModules) } catch {}
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isEditingModules, onDownloadJSON, onPrint, onEditingChange])

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">

          <div className={`flex flex-row gap-1 items-start`} ref={containerRef}>
            {/* Left: JSON area */}
            <div
              className={`flex flex-col flex-shrink-0`}
              style={{ width: `${leftWidth}px` }}
            >
              <div className="sticky top-0 z-10 mb-1 flex items-center justify-between gap-2 print:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur px-2 h-10 rounded-md shadow-sm border-b transition-shadow">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Parsed
                  </Badge>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={onDownloadJSON}
                    variant="default"
                    size="sm"
                    className="w-auto rounded-full px-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-200 ease-out hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download JSON
                  </Button>
                </div>
              </div>
              <div
                className="mt-1 overflow-auto"
                style={{ height: resumeColHeight ? `${resumeColHeight}px` : undefined }}
              >
                {(!resumeData && (!jsonText || jsonText.trim() === '{}' )) && (
                  <div className="mb-2 p-2 text-xs rounded-md border bg-gray-50 dark:bg-gray-800">
                    贴入你的 JSON 或使用左上角默认提示在 LLM 中生成后粘贴；也可以从右侧样式面板调整模块外观。
                  </div>
                )}
                <JsonViewer
                  title="Parsed JSON"
                  data={resumeData}
                  defaultCollapsedLevel={2}
                  collapsible={false}
                  minimal={true}
                  editable={true}
                  value={(jsonText && jsonText.trim().length > 0) ? jsonText : JSON.stringify(resumeData ?? {}, null, 2)}
                  onChange={onJsonChange}
                />
              </div>
            </div>

            {/* Divider (drag to resize) */}
            <div
              className="w-1 self-stretch cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
              onMouseDown={() => { draggingRef.current = true }}
              aria-label="Drag to resize left/right width"
            />

            {/* Right: resume preview */}
            <div className="flex-grow print:block" ref={resumeColRef}>
              <div className="flex flex-col">
                <div className="sticky top-0 z-10 mb-1 flex items-center justify-between gap-2 print:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur px-2 h-10 rounded-md shadow-sm border-b transition-shadow">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={onPrint}
                      variant="default"
                      size="sm"
                      className="w-auto rounded-full px-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    >
                      Download PDF
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      onClick={() => onResetStyles?.()}
                      variant="outline"
                      size="sm"
                      className="rounded-full px-2 transition-colors duration-200 ease-out hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      title="Restore default styles from defaults.js"
                    >
                      Restore Styles
                    </Button>
                    <Button
                      onClick={() => onEditingChange?.(!isEditingModules)}
                      variant="default"
                      size="sm"
                      className="rounded-full px-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-200 ease-out hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {isEditingModules ? 'Close Editor' : 'Edit Module Styles'}
                </Button>
              </div>
                </div>
                <div className="relative" id="resume-preview">
                  <ResumeDisplay
                    data={resumeData}
                    onEditMeta={onEditMeta}
                    isEditing={isEditingModules}
                    onEditingChange={onEditingChange}
                    onResetStyles={onResetStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}