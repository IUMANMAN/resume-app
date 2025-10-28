"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, Copy } from "lucide-react"

function formatPrimitive(value) {
  const type = typeof value
  if (value === null) {
    return { text: "null", className: "text-gray-500" }
  }
  if (type === "string") {
    return { text: `"${value}"`, className: "text-emerald-600 dark:text-emerald-300" }
  }
  if (type === "number") {
    return { text: String(value), className: "text-purple-600 dark:text-purple-300" }
  }
  if (type === "boolean") {
    return { text: String(value), className: "text-orange-600 dark:text-orange-300" }
  }
  return { text: String(value), className: "text-gray-700 dark:text-gray-300" }
}

function Node({ name, value, level, defaultCollapsedLevel }) {
  const isArray = Array.isArray(value)
  const isObject = value && typeof value === "object" && !isArray

  const initiallyOpen = level < defaultCollapsedLevel
  const [open, setOpen] = useState(initiallyOpen)

  if (!isArray && !isObject) {
    const { text, className } = formatPrimitive(value)
    return (
      <div className="font-mono text-sm py-1">
        {name !== undefined && (
          <span className="text-blue-600 dark:text-blue-300">{String(name)}</span>
        )}
        {name !== undefined && <span className="text-gray-500">: </span>}
        <span className={className}>{text}</span>
      </div>
    )
  }

  const size = isArray ? value.length : Object.keys(value || {}).length
  const bracketLabel = isArray ? `Array[${size}]` : `Object{${size}}`

  return (
    <div className="font-mono text-sm">
      <div
        className="flex items-center gap-2 py-1 cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <ChevronDown className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        )}
        {name !== undefined && (
          <span className="text-blue-600 dark:text-blue-300">{String(name)}</span>
        )}
        {name !== undefined && <span className="text-gray-500">: </span>}
        <Badge variant="outline" className="text-xs">
          {bracketLabel}
        </Badge>
      </div>

      {open && (
        <div className="ml-4 pl-3 border-l border-gray-200 dark:border-gray-700">
          {isArray
            ? value.map((item, idx) => (
                <Node
                  key={idx}
                  name={idx}
                  value={item}
                  level={level + 1}
                  defaultCollapsedLevel={defaultCollapsedLevel}
                />
              ))
            : Object.entries(value || {}).map(([k, v]) => (
                <Node
                  key={k}
                  name={k}
                  value={v}
                  level={level + 1}
                  defaultCollapsedLevel={defaultCollapsedLevel}
                />
              ))}
        </div>
      )}
    </div>
  )
}

export function JsonViewer({ data, title = "JSON Data", defaultCollapsedLevel = 2, collapsible = true, minimal = false, editable = false, value, onChange }) {
  const copyToClipboard = () => {
    try {
      const json = JSON.stringify(data, null, 2)
      navigator.clipboard.writeText(json)
    } catch {}
  }

  // Simple syntax highlight: convert JSON string into marked-up HTML (non-collapsible mode)
  const Syntax = ({ json }) => {
    const html = (() => {
      if (!json) return ""
      let s = json
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
      // Keys
      s = s.replace(/\"([^\"]+)\"(?=\s*:)/g, '<span class="text-blue-600 dark:text-blue-300">"$1"</span>')
      // String values
      s = s.replace(/:\s*\"([^\"]*)\"/g, ': <span class="text-emerald-600 dark:text-emerald-300">"$1"</span>')
      // Numbers (avoid matching attributes like class="text-blue-600")
      // 1) Numbers in objects: pure numbers after colon
      s = s.replace(/(:\s*)(-?\d+(?:\.\d+)?)/g, '$1<span class="text-purple-600 dark:text-purple-300">$2</span>')
      // 2) Numbers in arrays: pure numbers after '[' or ','
      s = s.replace(/([\[,]\s*)(-?\d+(?:\.\d+)?)/g, '$1<span class="text-purple-600 dark:text-purple-300">$2</span>')
      // Boolean
      s = s.replace(/\b(true|false)\b/g, '<span class="text-orange-600 dark:text-orange-300">$1</span>')
      // null
      s = s.replace(/\bnull\b/g, '<span class="text-gray-500">null</span>')
      return s
    })()
    return <pre className="font-mono text-sm whitespace-pre overflow-visible" dangerouslySetInnerHTML={{ __html: html }} />
  }

  // Minimal pure-JSON mode: optional editing; overlay approach (textarea + highlighted preview)
  if (minimal) {
    if (editable) {
      const text = value ?? JSON.stringify(data, null, 2)

      const handleChange = (e) => {
        const next = e.target.value
        onChange && onChange(next)
      }

      return (
        <div className="relative overflow-auto bg-gray-50 dark:bg-gray-800 rounded-md">
          {/* Content wrapper: use max-content so width follows longest line, enabling horizontal scroll */}
          <div className="relative w-max min-w-full">
            {/* Invisible placeholder: expands container height to make page scroll naturally */}
            <pre
              aria-hidden
              className="m-0 font-mono text-sm leading-6 p-4 opacity-0 select-none pointer-events-none whitespace-pre"
            >{text}</pre>
            {/* Highlighted preview layer (non-interactive) */}
            <pre
              className="absolute inset-0 m-0 font-mono text-sm leading-6 p-4 overflow-visible pointer-events-none"
              dangerouslySetInnerHTML={{ __html: (() => {
              // Use Syntax to highlight current text
              const html = (() => {
                if (!text) return ""
                let s = text
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                s = s.replace(/\"([^\"]+)\"(?=\s*:)/g, '<span class="text-blue-600 dark:text-blue-300">"$1"</span>')
                s = s.replace(/:\s*\"([^\"]*)\"/g, ': <span class="text-emerald-600 dark:text-emerald-300">"$1"</span>')
                s = s.replace(/(:\s*)(-?\d+(?:\.\d+)?)/g, '$1<span class="text-purple-600 dark:text-purple-300">$2</span>')
                s = s.replace(/([\[,]\s*)(-?\d+(?:\.\d+)?)/g, '$1<span class="text-purple-600 dark:text-purple-300">$2</span>')
                s = s.replace(/\b(true|false)\b/g, '<span class="text-orange-600 dark:text-orange-300">$1</span>')
                s = s.replace(/\bnull\b/g, '<span class="text-gray-500">null</span>')
                return s
              })()
              return html
            })() }}
            />

            {/* Input layer (transparent text + visible caret) */}
            <textarea
              value={text}
              onChange={handleChange}
              className="absolute inset-0 z-10 w-full h-full font-mono text-sm leading-6 p-4 bg-transparent text-transparent caret-blue-600 dark:caret-blue-300 outline-none resize-none overflow-hidden selection:bg-blue-200/40 dark:selection:bg-blue-800/40 whitespace-pre"
              wrap="off"
              data-role="json-scroll"
              spellCheck={false}
              aria-label="Edit JSON"
            />
          </div>
        </div>
      )
    }
    return (
      <div className="relative h-full overflow-visible bg-gray-50 dark:bg-gray-800 rounded-md p-2" data-role="json-scroll">
        <Syntax json={JSON.stringify(data, null, 2)} />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {title}
          </Badge>
          <span className="text-xs text-gray-500 dark:text-gray-400">{collapsible ? 'Structured, collapsible view' : 'Formatted, syntax highlighted'}</span>
        </div>
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </div>
      <div className="p-3 max-h-[70vh] overflow-y-auto" data-role="json-scroll">
        {collapsible ? (
          <Node name={undefined} value={data} level={0} defaultCollapsedLevel={defaultCollapsedLevel} />
        ) : (
          <Syntax json={JSON.stringify(data, null, 2)} />
        )}
      </div>
    </div>
  )
}