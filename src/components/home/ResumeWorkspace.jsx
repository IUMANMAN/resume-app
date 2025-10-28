"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Download } from 'lucide-react'
import { JsonViewer } from '@/components/json-viewer'
import { ResumeDisplay } from '@/components/resume-display'

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
  const [leftWidth, setLeftWidth] = useState(480)
  const containerRef = useRef(null)
  const draggingRef = useRef(false)

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

  // 初始化和窗口尺寸变化时保持左侧宽度在范围内
  useEffect(() => {
    const clamp = (px) => Math.min(isEditingModules ? 520 : 560, Math.max(isEditingModules ? 340 : 360, px))
    const init = () => {
      const base = Math.round((window.innerWidth || 1200) * (isEditingModules ? 0.42 : 0.46))
      setLeftWidth(clamp(base))
    }
    init()
    const onResize = () => setLeftWidth((w) => clamp(w))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isEditingModules])

  useEffect(() => {
    const onResize = () => measureRightColumn()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (!resumeData && !jsonText) return null

  // 拖拽分割条
  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return
      const rect = containerRef.current?.getBoundingClientRect()
      const x = e.clientX
      if (rect) {
        const relX = x - rect.left
        const clamp = (px) => Math.min(isEditingModules ? 520 : 560, Math.max(isEditingModules ? 340 : 360, px))
        setLeftWidth(clamp(relX))
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

  // 快捷键：保存JSON、打印PDF、切换模块编辑
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
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                解析完成
              </Badge>
            </div>
          </div>

          <div className={`flex flex-row gap-1 items-start`} ref={containerRef}>
            {/* 左侧：JSON 区域 */}
            <div
              className={`flex flex-col flex-shrink-0`}
              style={{ width: `${leftWidth}px` }}
            >
              <div className="sticky top-0 z-10 mb-1 flex items-center justify-center print:hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur py-1 rounded-md shadow-sm">
                <Button
                  onClick={onDownloadJSON}
                  variant="default"
                  size="lg"
                  className="w-auto rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  <Download className="h-5 w-5 mr-2" />
                  下载JSON
                </Button>
              </div>
              <div
                className="mt-1 overflow-auto"
                style={{ height: resumeColHeight ? `${resumeColHeight}px` : undefined }}
              >
                <JsonViewer
                  title="解析JSON"
                  data={resumeData}
                  defaultCollapsedLevel={2}
                  collapsible={false}
                  minimal={true}
                  editable={true}
                  value={jsonText}
                  onChange={onJsonChange}
                />
              </div>
            </div>

            {/* 分割条 */}
            <div
              className="w-1 self-stretch cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
              onMouseDown={() => { draggingRef.current = true }}
              aria-label="拖拽调整左右宽度"
            />

            {/* 右侧：简历预览 */}
            <div className="flex-grow print:block" ref={resumeColRef}>
              <div className="flex flex-col">
                <div className="sticky top-0 z-10 mb-1 relative flex items-center justify-center gap-2 print:hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur py-1 px-2 rounded-md shadow-sm">
                  <Button
                    onClick={onPrint}
                    variant="default"
                    size="lg"
                    className="w-auto rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  >
                    下载PDF
                  </Button>
                  <div className="absolute right-2 flex items-center gap-2">
                    <Button
                      onClick={() => onResetStyles?.()}
                      variant="outline"
                      size="sm"
                      className="rounded-full px-4"
                      title="恢复 default.js 中的默认样式"
                    >
                      恢复默认样式
                    </Button>
                    <Button
                      onClick={() => onEditingChange?.(!isEditingModules)}
                      variant="default"
                      size="sm"
                      className="rounded-full px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    >
                      {isEditingModules ? '关闭编辑面板' : '编辑模块样式'}
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