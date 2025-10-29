"use client"

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Download } from 'lucide-react'
import ModuleStyleEditor from '@/components/ModuleStyleEditor'
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
  const previewInnerRef = useRef(null)
  const jsonColRef = useRef(null)
  const [previewScale, setPreviewScale] = useState(1)
  const [jsonScale, setJsonScale] = useState(1)
  const [leftWidth, setLeftWidth] = useState(460)
  const [isNarrow, setIsNarrow] = useState(false)
  const containerRef = useRef(null)
  const draggingRef = useRef(false)
  // Bridge editor state from ResumeDisplay so we can render the editor in a right column
  const [editorBridge, setEditorBridge] = useState(null)

  const PREVIEW_WIDTH = 794
  const EDITOR_WIDTH = 320

  // compute clamp with container width, ensuring both sides have minimum widths
  const clampWithContainer = (px) => {
    const rect = containerRef.current?.getBoundingClientRect()
    const leftMin = isEditingModules ? 320 : 340
    // On small screens we stack columns, do not reserve editor width
    if (isNarrow || !rect) {
      return Math.min(isEditingModules ? 500 : 540, Math.max(leftMin, px))
    }
    // On desktop/tablet, reserve fixed preview width and editor sidebar when editing
    // Add a small extra margin on the right to keep preview comfortably within bounds
    const gapPx = 8 // account for column gap & subtle paddings
    const rightMin = isEditingModules ? (PREVIEW_WIDTH + EDITOR_WIDTH + 80 + gapPx) : (PREVIEW_WIDTH + 40 + gapPx)
    const maxLeft = Math.max(leftMin, rect.width - rightMin)
    return Math.min(maxLeft, Math.max(leftMin, px))
  }

  const measureRightColumn = () => {
    const wrapper = resumeColRef.current
    const inner = previewInnerRef.current
    if (wrapper && inner) {
      const available = wrapper.clientWidth || PREVIEW_WIDTH
      const nextScale = Math.min(1, available / PREVIEW_WIDTH)
      setPreviewScale(nextScale)
      const h = inner.scrollHeight || inner.offsetHeight || 0
      setResumeColHeight(Math.round(h * nextScale))
    }
  }

  const measureLeftColumn = () => {
    const left = jsonColRef.current
    if (left) {
      const base = 640
      const available = left.clientWidth || base
      const nextScale = Math.min(1, available / base)
      setJsonScale(nextScale)
    }
  }

  useEffect(() => {
    measureRightColumn()
    measureLeftColumn()
  }, [resumeData, isEditingModules])

  // Keep the left column width within range on init and window resize
  useEffect(() => {
    const init = () => {
      const vw = window.innerWidth || 1200
      setIsNarrow(vw < 768)
      // Shift JSON column slightly left by reducing its default width ratio
      const base = Math.round(vw * (isEditingModules ? 0.38 : 0.36))
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
    const onResize = () => { measureRightColumn(); measureLeftColumn() }
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
        <CardContent className="p-3 sm:p-4">
          <div className={`flex gap-1 items-start flex-col lg:flex-row lg:flex-nowrap min-w-0`} ref={containerRef}>
            {/* JSON area (below resume on mobile; left on desktop) */}
            <div
              className={`flex flex-col min-w-0 flex-1 order-2 lg:order-1`}
              style={{ width: isNarrow ? undefined : `${leftWidth}px` }}
              ref={jsonColRef}
            >
              <div className="sticky top-0 z-10 mb-1 flex items-center justify-center gap-2 print:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur pl-2 pr-4 py-2 sm:h-auto rounded-md shadow-sm border-b transition-shadow">
                <div className="flex items-center gap-2 flex-wrap justify-center w-full">
                  <Button
                    onClick={onDownloadJSON}
                    variant="default"
                    size="sm"
                    className="w-full sm:w-auto min-w-[140px] rounded-full px-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-200 ease-out hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download JSON
                  </Button>
                </div>
              </div>
              <div
                className="mt-1 overflow-y-auto overflow-x-auto scrollbar-modern"
                style={{ maxHeight: isNarrow ? '60vh' : (resumeColHeight ? `${resumeColHeight}px` : undefined) }}
              >
                {(!resumeData && (!jsonText || jsonText.trim() === '{}' )) && (
                  <div className="mb-2 p-2 text-xs rounded-md border bg-gray-50 dark:bg-gray-800">
                    贴入你的 JSON 或使用左上角默认提示在 LLM 中生成后粘贴；也可以从右侧样式面板调整模块外观。
                  </div>
                )}
                <div style={{ width: '100%', transform: 'none', transformOrigin: 'top left' }}>
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
            </div>

            {/* Divider (drag to resize) */}
            <div
              className={`hidden lg:block w-1 self-stretch cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded`}
              onMouseDown={() => { draggingRef.current = true }}
              aria-label="Drag to resize left/right width"
            />

            {/* Resume preview (on top on mobile; center column on desktop) */}
            <div className={`min-w-0 flex-none order-1 lg:order-2 print:block flex-shrink-0`} style={{ width: isNarrow ? undefined : `${PREVIEW_WIDTH}px` }}>
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="sticky top-0 z-10 mb-1 flex items-center justify-between gap-2 print:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur pl-2 pr-4 py-2 sm:h-auto rounded-md shadow-sm border-b transition-shadow">
                  <div className="flex items-center justify-start">
                    <Button
                      onClick={onPrint}
                      variant="default"
                      size="sm"
                      className="rounded-full px-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full sm:w-auto min-w-[140px] whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm"
                    >
                      Download PDF
                    </Button>
                  </div>
                  {!isEditingModules && (
                    <div className="flex items-center justify-end">
                      <Button
                        onClick={() => onEditingChange?.(true)}
                        variant="default"
                        size="sm"
                        className="rounded-full px-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full sm:w-auto min-w-[120px] whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm"
                        aria-label="Edit Module Styles"
                      >
                        Edit Styles
                      </Button>
                    </div>
                  )}
                </div>
                <div className="relative px-1 sm:px-0 min-w-0" id="resume-preview" ref={resumeColRef}>
                  
                  <div ref={previewInnerRef} style={{ width: `${PREVIEW_WIDTH}px`, transform: `scale(${previewScale})`, transformOrigin: 'top left' }}>
                    <ResumeDisplay
                      data={resumeData}
                      onEditMeta={onEditMeta}
                      isEditing={isEditingModules}
                      onEditingChange={onEditingChange}
                      onResetStyles={onResetStyles}
                      onEditorState={setEditorBridge}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Editor: right sidebar on desktop; overlay on mobile with 30% background */}
            {isEditingModules && editorBridge && (
              isNarrow ? (
                <div className="fixed inset-0 z-40 print:hidden">
                  <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30" />
                  <div className="absolute inset-y-0 left-0 right-0 overflow-y-auto">
                    <div className="sticky top-0 z-10 mb-1 flex flex-row items-center justify-end gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur pl-2 pr-4 py-2 rounded-md shadow-sm border-b">
                      <Button
                        onClick={() => onResetStyles?.()}
                        variant="outline"
                        size="sm"
                        className="rounded-full px-2 w-auto min-w-[140px] text-xs sm:text-sm"
                        title="Restore default styles from defaults.js"
                      >
                        Restore Styles
                      </Button>
                      <Button
                        onClick={() => onEditingChange?.(false)}
                        variant="default"
                        size="sm"
                        className="rounded-full px-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md w-auto min-w-[140px] text-xs sm:text-sm"
                      >
                        Close Editor
                      </Button>
                    </div>
                    <div className="px-2 pb-2">
                      <div style={{ width: `${EDITOR_WIDTH}px`, transform: `scale(${previewScale})`, transformOrigin: 'top left' }}>
                        <ModuleStyleEditor
                          isOpen={true}
                          onClose={() => onEditingChange?.(false)}
                          globalMeta={editorBridge.globalMeta}
                          setGlobalMeta={editorBridge.setGlobalMeta}
                          modulesMeta={editorBridge.modulesMeta}
                          setModulesMeta={editorBridge.setModulesMeta}
                          openSectionKey={editorBridge.openSectionKey}
                          setOpenSectionKey={editorBridge.setOpenSectionKey}
                          updateModuleMeta={editorBridge.updateModuleMeta}
                          emitPendingRef={editorBridge.emitPendingRef}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-[220px] sm:w-64 md:w-72 lg:w-80 flex-shrink-0 self-stretch lg:order-3">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="sticky top-0 z-10 mb-1 flex flex-row items-center justify-end gap-2 print:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur pl-2 pr-4 py-2 rounded-md shadow-sm border-b">
                      <Button
                        onClick={() => onResetStyles?.()}
                        variant="outline"
                        size="sm"
                        className="rounded-full px-2 w-auto min-w-[140px] text-xs sm:text-sm"
                        title="Restore default styles from defaults.js"
                      >
                        Restore Styles
                      </Button>
                      <Button
                        onClick={() => onEditingChange?.(false)}
                        variant="default"
                        size="sm"
                        className="rounded-full px-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md w-auto min-w-[140px] text-xs sm:text-sm"
                      >
                        Close Editor
                      </Button>
                    </div>
                    <div className="relative">
                      <ModuleStyleEditor
                        isOpen={true}
                        onClose={() => onEditingChange?.(false)}
                        globalMeta={editorBridge.globalMeta}
                        setGlobalMeta={editorBridge.setGlobalMeta}
                        modulesMeta={editorBridge.modulesMeta}
                        setModulesMeta={editorBridge.setModulesMeta}
                        openSectionKey={editorBridge.openSectionKey}
                        setOpenSectionKey={editorBridge.setOpenSectionKey}
                        updateModuleMeta={editorBridge.updateModuleMeta}
                        emitPendingRef={editorBridge.emitPendingRef}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}