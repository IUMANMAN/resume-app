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
import { DEFAULT_MODULE_META, DEFAULT_GLOBAL_META, ensureDefaultLayout } from '@/app/defaults'
import { ResumeWorkspace } from '@/components/home/ResumeWorkspace'
import { Header } from '@/components/home/Header'
import { ErrorAlert } from '@/components/home/ErrorAlert'

// 接口中使用的解析 Prompt（供在无 API 时参考与改写）
const DEFAULT_PROMPT = `请将以下简历文本解析为标准化的JSON格式。请严格按照以下JSON结构返回数据，不要添加任何其他文本或解释：

{
  "personalInfo": {
    "name": "姓名",
    "email": "邮箱",
    "phone": "电话",
    "address": "地址",
    "linkedin": "LinkedIn链接",
    "github": "GitHub链接",
    "website": "个人网站"
  },
  "summary": "个人简介或职业目标",
  "education": [
    {
      "institution": "学校名称",
      "degree": "学位",
      "major": "专业",
      "graduationDate": "毕业时间",
      "gpa": "GPA（如有）"
    }
  ],
  "experience": [
    {
      "company": "公司名称",
      "position": "职位",
      "startDate": "开始时间",
      "endDate": "结束时间",
      "description": "工作描述",
      "achievements": ["成就1", "成就2"]
    }
  ],
  "skills": {
    "technical": ["技术技能"],
    "languages": ["语言技能"],
    "soft": ["软技能"]
  },
  "projects": [
    {
      "name": "项目名称",
      "description": "项目描述",
      "technologies": ["使用技术"],
      "link": "项目链接（如有）"
    }
  ],
  "certifications": [
    {
      "name": "证书名称",
      "issuer": "颁发机构",
      "date": "获得时间"
    }
  ]
}

请只返回JSON数据，不要包含任何其他文本。`

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
  const [autoSyncJson, setAutoSyncJson] = useState(true)
  const [isEditingModules, setIsEditingModules] = useState(false)
  const [showNoApiModal, setShowNoApiModal] = useState(false)

  // 初次进入时（或清除后），未配置 API 则弹窗提醒
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

  // 将 resumeData 的变化统一同步到 jsonText，避免在其他组件渲染期间更新父组件
  useEffect(() => {
    if (resumeData) {
      setJsonText(JSON.stringify(resumeData, null, 2))
    }
  }, [resumeData])

  // 将模块元信息注入到 JSON（并将 metadata 放在末尾以便查看在下方）
  const handleInjectModuleMeta = (modulesMeta) => {
    setResumeData(prev => {
      const base = ensureDefaultLayout(prev || {})
      const listedKeys = ['personalInfo', 'summary', 'education', 'experience', 'workExperience', 'skills', 'projects', 'certifications', 'awards', 'languages', 'metadata']
      const rest = Object.fromEntries(Object.entries(base || {}).filter(([k]) => !listedKeys.includes(k)))
      const nextOrdered = {
        personalInfo: base.personalInfo,
        summary: base.summary,
        education: base.education,
        // 优先使用 experience（若无则回退 workExperience）
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

  // 恢复默认布局（不改动内容，仅重置左右列模块顺序）
  const resetToDefaultLayout = () => {
    setResumeData(prev => {
      const base = ensureDefaultLayout(prev || {})
      const next = {
        ...base,
        metadata: {
          ...base.metadata,
          layout: {
            ...(base.metadata?.layout || {}),
            columns: {
              left: ['summary', 'workExperience', 'education'],
              right: ['skills', 'projects', 'awards', 'languages']
            }
          },
          modules: { ...DEFAULT_MODULE_META }
        }
      }
      try { localStorage.setItem('resume-data', JSON.stringify(next)) } catch {}
      return next
    })
  }

  // 恢复默认样式：使用 defaults.js 替换 JSON 中的 metadata（布局/全局/模块）
  const resetModuleStylesOnly = () => {
    setResumeData(prev => {
      const base = ensureDefaultLayout(prev || {})
      const defaultColumns = {
        left: ['summary', 'workExperience', 'education'],
        right: ['skills', 'projects', 'awards', 'languages']
      }
      const next = {
        ...base,
        metadata: {
          layout: { columns: defaultColumns },
          global: { ...DEFAULT_GLOBAL_META },
          modules: { ...DEFAULT_MODULE_META }
        }
      }
      // 立即同步到本地缓存与左侧 JSON 文本，避免被旧的 resume-json-text 覆盖
      try {
        localStorage.setItem('resume-data', JSON.stringify(next))
        localStorage.setItem('resume-json-text', JSON.stringify(next, null, 2))
      } catch {}
      setJsonText(JSON.stringify(next, null, 2))
      return next
    })
  }

  // 从localStorage加载API密钥和提供商选择
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
    // 优先恢复编辑中的 JSON 文本
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
        // 若未从 savedJsonText 恢复，则使用数据生成 JSON 文本
        setResumeData((prev) => prev ?? d)
        setJsonText((prev) => prev || JSON.stringify(d, null, 2))
      } catch {}
    }
  }, [])

  // 保存API提供商选择到localStorage
  const handleProviderChange = (provider) => {
    setApiProvider(provider)
    localStorage.setItem('api-provider', provider)
    // 清空API密钥，因为不同提供商的密钥格式不同
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
      setError('请输入简历文本内容')
      return
    }

    setProcessingParse(true)
    setError(null)
    setResult(null)

    try {
      // 若输入为有效 JSON，则直接载入并跳过一切 API 调用
      let parsed = null
      try { parsed = JSON.parse(resumeText) } catch {}
      if (parsed && typeof parsed === 'object') {
        setDataAndJson(parsed)
        setResult({ source: 'local', message: '已从输入的JSON载入数据' })
        return
      }

      // 输入不是 JSON 时：有 API 则调用解析接口；无 API 弹窗引导
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
          throw new Error(errorData.error || '简历解析失败')
        }

        const data = await response.json()
        setResult(data)
        const d = data?.data || data
        setDataAndJson(d)
      } else {
        // 无 API Key：提示使用默认 Prompt 在模型中生成 JSON 后粘贴
        setError(null)
        setShowNoApiModal(true)
      }
    } catch (err) {
      setError(err.message || '处理失败，请重试')
    } finally {
      setProcessingParse(false)
    }
  }

  // 等待 DOM 中出现指定元素（用于解析后等待预览渲染）
  const waitForElement = async (id, timeout = 5000) => {
    const start = performance.now()
    while (performance.now() - start < timeout) {
      const el = document.getElementById(id)
      if (el) return el
      await new Promise((r) => setTimeout(r, 50))
    }
    return null
  }

  // 一键生成PDF：
  // - 有 API：不重新解析，必须已有预览（resumeData），直接导出 PDF
  // - 无 API：输入为有效 JSON 时载入预览并导出；否则提示需要 API/JSON
  const handleProcessToPDF = async () => {
    setProcessingPdf(true)
    setError(null)
    setResult(null)

    try {
      const key = apiKey?.trim()
      if (key) {
        // 有 API：仅使用已渲染的预览导出 PDF
        if (resumeData) {
          const el = await waitForElement('resume-preview', 4000)
          if (el) {
            await handlePrint()
          } else {
            setError('预览尚未渲染，请稍后重试。')
          }
        } else {
          setError('请先点击“开始解析”生成预览，再导出 PDF。')
        }
      } else {
        // 无 API：若输入为有效 JSON，载入预览并导出；否则提示
        let parsed = null
        try {
          parsed = JSON.parse(resumeText)
        } catch {}
        if (parsed && typeof parsed === 'object') {
          // 如果尚未有预览，先载入再导出
          if (!resumeData) {
            setDataAndJson(parsed)
            const el = await waitForElement('resume-preview', 4000)
            if (el) {
              await handlePrint()
            } else {
              setError('预览尚未渲染，请稍后重试或重新应用JSON。')
            }
          } else {
            await handlePrint()
          }
        } else {
          setError('未配置API，且输入不是有效JSON。请接入API或使用默认Prompt在大模型中生成JSON后粘贴。')
        }
      }
    } catch (err) {
      setError(err.message || '处理失败，请重试')
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
    const demoResume = `张三
软件工程师

联系方式：
电话：138-0000-0000
邮箱：zhangsan@email.com
地址：北京市朝阳区

教育背景：
2018-2022 北京理工大学 计算机科学与技术 本科 GPA: 3.8/4.0

工作经验：
2022.07-至今 阿里巴巴集团 前端开发工程师
- 负责电商平台前端开发，使用React、Vue.js等技术栈
- 优化页面性能，提升用户体验，页面加载速度提升30%
- 参与微服务架构设计，协助团队完成系统重构
- 指导2名实习生，协助其快速融入团队

2021.06-2021.09 腾讯科技 前端开发实习生
- 参与QQ音乐Web端开发，负责播放器组件优化
- 学习并应用TypeScript，提升代码质量和可维护性
- 配合后端团队完成API接口对接

技能专长：
编程语言：JavaScript, TypeScript, Python, Java
前端技术：React, Vue.js, HTML5, CSS3, Sass, Webpack
后端技术：Node.js, Express, MySQL, MongoDB
工具平台：Git, Docker, Jenkins, AWS

项目经验：
1. 电商管理系统 (2022-2023)
   - 技术栈：React + TypeScript + Ant Design + Node.js
   - 实现商品管理、订单处理、用户管理等核心功能
   - 支持多角色权限管理，日活跃用户1000+

2. 个人博客系统 (2021)
   - 技术栈：Vue.js + Express + MongoDB
   - 实现文章发布、评论互动、标签分类等功能
   - 响应式设计，支持移动端访问

获奖荣誉：
- 2023年 阿里巴巴集团优秀员工
- 2022年 北京理工大学优秀毕业生
- 2021年 全国大学生程序设计竞赛三等奖

语言能力：
- 中文：母语
- 英语：CET-6，能够流利阅读英文技术文档

自我评价：
热爱编程，具有强烈的学习能力和团队合作精神。善于沟通，能够快速适应新环境和新技术。对前端技术有深入理解，关注用户体验和代码质量。`;
    
    setResumeText(demoResume);
    setError(null);
  };

  // 实时保存：输入内容变化时写入 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('resume-text', resumeText)
    } catch {}
  }, [resumeText])

  // 实时保存：解析结果变化时写入 localStorage
  useEffect(() => {
    try {
      if (resumeData) {
        localStorage.setItem('resume-data', JSON.stringify(resumeData))
      } else {
        localStorage.removeItem('resume-data')
      }
    } catch {}
  }, [resumeData])

  // JSON 文本编辑：根据模式（实时/手动）同步到简历预览
  const handleJsonEdit = (text) => {
    setJsonText(text)
    if (autoSyncJson) {
      try {
        const parsed = JSON.parse(text)
        setResumeData(ensureDefaultLayout(parsed))
        setError(null)
      } catch (e) {
        // 保留上次有效的 resumeData，不覆盖
      }
    }
  }

  // 手动应用 JSON 更改
  const applyJsonChanges = () => {
    try {
      const parsed = JSON.parse(jsonText)
      setResumeData(ensureDefaultLayout(parsed))
      setError(null)
    } catch (e) {
      setError('JSON格式错误，请修正后再点击“应用更改”')
    }
  }

  // 区域拖拽：跨列和列内排序
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

  // 列表项拖拽重排：工作经历、教育、项目、获奖、语言（顶层）
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

  // 保存编辑中的 JSON 文本到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('resume-json-text', jsonText || '')
    } catch {}
  }, [jsonText])

  // 计算一键生成 PDF 的可用性：
  // - 有 API：必须已有预览（resumeData）
  // - 无 API：输入为有效 JSON 或已有预览
  const canGeneratePDF = (apiKey && apiKey.trim())
    ? !!resumeData
    : (() => { try { const o = JSON.parse(resumeText); return !!o && typeof o === 'object' } catch { return !!resumeData } })()
  
  // 结果区组件化（高度测量逻辑移入 ResumeWorkspace）

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <Header />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Configuration and Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          {/* Results Section */}
          {(resumeData || jsonText) && (
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
          )}

          {/* 使用说明已移至顶部并简化 */}
        </div>

        {/* No API Modal */}
        <AlertDialog open={showNoApiModal} onOpenChange={(open) => {
          setShowNoApiModal(open)
          if (!open) try { localStorage.setItem('dismiss-no-api-modal', '1') } catch {}
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>未配置 API：请用大模型生成 JSON</AlertDialogTitle>
              <AlertDialogDescription>
                操作步骤：复制左侧“默认 Prompt”，在你使用的大模型（如 ChatGPT、DeepSeek）中运行得到结构化 JSON；然后将该 JSON 粘贴到左侧“简历文本输入”，点击“开始解析”即可渲染预览。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowNoApiModal(false)}>稍后再说</AlertDialogCancel>
              <AlertDialogAction onClick={copyDefaultPrompt}>复制默认 Prompt</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
