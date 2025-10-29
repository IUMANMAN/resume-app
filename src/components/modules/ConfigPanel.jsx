"use client"

import { useRef, useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Key } from 'lucide-react'

export function ConfigPanel({
  apiProvider,
  handleProviderChange,
  apiKey,
  handleApiKeyChange,
  showApiKey,
  setShowApiKey,
  defaultPrompt
}) {
  const promptRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const copyPrompt = async () => {
    try {
      const text = promptRef.current?.value || ''
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }
  return (
    <Card className="shadow-none border-neutral-200 bg-white dark:bg-neutral-900 animate-fade-in h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 flex flex-col h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={apiProvider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="apiKey">
              {apiProvider === 'openai' ? 'OpenAI API Key' : 'DeepSeek API Key'}
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder={`Enter your ${apiProvider === 'openai' ? 'OpenAI' : 'DeepSeek'} API key`}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Get API key:
              <a
                href={apiProvider === 'openai' ? 'https://platform.openai.com/api-keys' : 'https://platform.deepseek.com/api_keys'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline ml-1"
              >
                {apiProvider === 'openai' ? 'OpenAI Console' : 'DeepSeek Console'}
              </a>
            </p>
          </div>
        </div>

        <Separator />
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <Label htmlFor="promptHelper">API Prompt (scrollable, one‑click copy)</Label>
            <div className="flex items-center gap-2">
              {copied && <span className="text-xs text-green-600">Copied</span>}
              <Button size="sm" variant="outline" onClick={copyPrompt} className="transition-opacity hover:opacity-90">Copy</Button>
            </div>
          </div>
          <Textarea
            id="promptHelper"
            defaultValue={defaultPrompt}
            ref={promptRef}
            rows={10}
            className="flex-1 min-h-[180px] sm:min-h-[260px] resize-none overflow-y-auto text-xs scrollbar-modern"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            If you don’t use an API, you can run the prompt above with your preferred LLM tool.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}