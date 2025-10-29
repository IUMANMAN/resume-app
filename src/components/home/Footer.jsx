"use client"

import { Github, CreditCard, QrCode, Sparkles, FileText, Download, Layers, Globe, Link, ShieldCheck, Star, Mail, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/IUMANMAN/resume-app"
  const bmcUrl = process.env.NEXT_PUBLIC_BMC_URL || "#"
  const stripeDonateUrl = process.env.NEXT_PUBLIC_STRIPE_DONATE_URL || "#"
  const wechatPayUrl = process.env.NEXT_PUBLIC_WECHAT_QR_URL || "/wechatpayment.jpg"
  const alipayUrl = process.env.NEXT_PUBLIC_ALIPAY_QR_URL || "/alipaypayemnt.jpg"
  const [qrSrc, setQrSrc] = useState(null)
  
  const issuesUrl = process.env.NEXT_PUBLIC_ISSUES_URL || "https://github.com/IUMANMAN/resume-app/issues/new"
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "my0sterick@gmail.com"

  const VercelIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-black dark:text-white">
      <path d="M12 3l9 18H3z" />
    </svg>
  )
  const CloudflareIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500">
      <path d="M19 10a5 5 0 00-9.8-1.3A4 4 0 006 17h12a4 4 0 001-7z" />
    </svg>
  )

  return (
    <footer className="mt-6 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto w-full px-3 py-6 text-sm text-gray-600 dark:text-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              <p className="font-semibold text-gray-900 dark:text-gray-100">Resume App</p>
            </div>
            <p className="leading-6">
              AI-powered resume builder: generate a resume PDF from text, edit content and styles in real time, and adjust structure freely.
            </p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2"><FileText className="h-4 w-4" /> Paste text or use your LLM to generate JSON</li>
              <li className="flex items-center gap-2"><Layers className="h-4 w-4" /> Rearrange sections and tweak module styles</li>
              <li className="flex items-center gap-2"><Download className="h-4 w-4" /> Export high-quality PDF instantly</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Open-source, privacy-friendly local editing</li>
            </ul>
          </div>

          {/* Project & Contact */}
          <div className="space-y-3">
            <p className="font-semibold text-gray-900 dark:text-gray-100">Project</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded border bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors text-sm whitespace-nowrap w-full sm:w-auto justify-center"
                title="GitHub Repository"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <a 
                href={issuesUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded border bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors text-sm whitespace-nowrap w-full sm:w-auto justify-center" 
                title="Issues"
              >
                <Star className="h-4 w-4" />
                <span>Issues</span>
              </a>
              <div 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded border bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors text-sm whitespace-nowrap w-full sm:w-auto justify-center" 
                title="Open-source License"
              >
                <FileText className="h-4 w-4" />
                <span>License: MIT</span>
              </div>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-gray-700 dark:text-gray-200 font-medium">Contact Info</p>
              <a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors w-full sm:w-[200px] text-sm truncate justify-center sm:justify-start" title="Email">
                <Mail className="h-4 w-4" />
                <span>{contactEmail}</span>
              </a>
            </div>
            <p className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-2"><VercelIcon /> Deploy: <span className="font-medium">Vercel</span></span>
              <span className="inline-flex items-center gap-2"><CloudflareIcon /> Domain: <span className="font-medium">Cloudflare</span></span>
            </p>
          </div>

          {/* Support */}
          <div className="space-y-2">
            <p className="font-semibold text-gray-900 dark:text-gray-100">Buy Me a Coffee</p>
            <div className="flex flex-row flex-wrap items-center justify-center sm:items-start gap-2 sm:flex-col">
              <a
                href={stripeDonateUrl}
                target={stripeDonateUrl !== "#" ? "_blank" : undefined}
                rel={stripeDonateUrl !== "#" ? "noreferrer" : undefined}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors w-[110px] justify-center"
                title="Donate via Stripe"
              >
                <CreditCard className="h-4 w-4" />
                <span>Stripe</span>
              </a>
              <a
                href={wechatPayUrl}
                onClick={(e) => { e.preventDefault(); setQrSrc(wechatPayUrl); }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors w-[110px] justify-center"
                title="WeChat Pay QR"
              >
                <QrCode className="h-4 w-4" />
                <span>WeChat</span>
              </a>
              <a
                href={alipayUrl}
                onClick={(e) => { e.preventDefault(); setQrSrc(alipayUrl); }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors w-[110px] justify-center"
                title="Alipay QR"
              >
                <QrCode className="h-4 w-4" />
                <span>Alipay</span>
              </a>
            </div>
          </div>
          {qrSrc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setQrSrc(null)}>
              <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <button
                  className="absolute top-2 right-2 inline-flex items-center justify-center rounded-md border bg-white/80 hover:bg-white px-2 py-1 text-gray-700 dark:text-gray-200"
                  onClick={() => setQrSrc(null)}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
                <img src={qrSrc} alt="Payment QR" className="max-h-[80vh] max-w-[80vw] object-contain" />
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}