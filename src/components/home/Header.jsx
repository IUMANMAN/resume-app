import { Sparkles, Cpu, FileText, Download } from 'lucide-react'

export function Header() {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-blue-100/60 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
      <div className="px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col items-center text-center gap-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            AI 简历生成器
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
            粘贴简历文本或摘要 → 智能结构化 → 一键导出 PDF（支持 <span className="font-semibold">OpenAI</span> / <span className="font-semibold">DeepSeek</span>）
          </p>

          {/* 支持引擎徽标 */}
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 dark:bg-gray-900/40 px-3 py-1 text-xs text-gray-700 dark:text-gray-300 border">
              <Sparkles className="h-3.5 w-3.5" /> OpenAI
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 dark:bg-gray-900/40 px-3 py-1 text-xs text-gray-700 dark:text-gray-300 border">
              <Cpu className="h-3.5 w-3.5" /> DeepSeek
            </span>
          </div>

          {/* 使用步骤（更清晰的分步呈现） */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3 w-full max-w-4xl">
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white/70 dark:bg-gray-900/40 px-4 py-3 border">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">选择 AI 并填入 API 密钥</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white/70 dark:bg-gray-900/40 px-4 py-3 border">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">粘贴简历文本或摘要</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white/70 dark:bg-gray-900/40 px-4 py-3 border">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">3</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">点击“开始解析”或“一键生成PDF”</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white/70 dark:bg-gray-900/40 px-4 py-3 border">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">4</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">预览并下载 <Download className="h-4 w-4 inline" /> PDF / <FileText className="h-4 w-4 inline ml-1" /> JSON</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}