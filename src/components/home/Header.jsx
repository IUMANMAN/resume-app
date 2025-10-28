import { Sparkles, Cpu, FileText, Download } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <div className="relative mb-2 animate-fade-in">
      <div className="px-4 sm:px-6 py-2 sm:py-3">
        <div className="absolute right-3 top-3 print:hidden">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            AI Resume Generator
          </h1>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-4xl">
            Paste resume text or summary → intelligent structuring → one‑click export to PDF (supports <span className="font-semibold">OpenAI</span> / <span className="font-semibold">DeepSeek</span>)
          </p>

          {/* Steps: 去除卡片样式，仅保留简洁文本行 */}
          <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 w-full max-w-4xl text-xs sm:text-sm">
            <div className="flex items-center justify-center gap-2 px-2 py-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
              <span className="text-gray-700 dark:text-gray-300 inline-flex items-center gap-1"><Cpu className="h-3.5 w-3.5" /> Choose AI provider</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-2 py-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
              <span className="text-gray-700 dark:text-gray-300 inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> Paste resume text</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-2 py-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">3</span>
              <span className="text-gray-700 dark:text-gray-300">Click “Parse”</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-2 py-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">4</span>
              <span className="text-gray-700 dark:text-gray-300 inline-flex items-center gap-1"><Download className="h-3.5 w-3.5" /> Preview & download PDF</span>
            </div>
          </div>
          {/* Soft divider to improve readability between intro and panels */}
          <div className="mt-2 h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-gray-200/80 to-transparent dark:via-gray-700/70" />
        </div>
      </div>
    </div>
  )
}