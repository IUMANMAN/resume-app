"use client"

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  return (
    <Card className="h-[360px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          配置设置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-full overflow-auto">
        <div>
          <Label htmlFor="provider">AI 提供商</Label>
          <Select value={apiProvider} onValueChange={handleProviderChange}>
            <SelectTrigger>
              <SelectValue placeholder="选择AI提供商" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="deepseek">DeepSeek</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="apiKey">
            {apiProvider === 'openai' ? 'OpenAI API 密钥' : 'DeepSeek API 密钥'}
          </Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder={`输入您的 ${apiProvider === 'openai' ? 'OpenAI' : 'DeepSeek'} API 密钥`}
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
            获取API密钥：
            <a
              href={apiProvider === 'openai' ? 'https://platform.openai.com/api-keys' : 'https://platform.deepseek.com/api_keys'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline ml-1"
            >
              {apiProvider === 'openai' ? 'OpenAI 控制台' : 'DeepSeek 控制台'}
            </a>
          </p>
        </div>

        <Separator />
        <div>
          <Label htmlFor="promptHelper">接口 Prompt（可复制、可自行改写）</Label>
          <Textarea
            id="promptHelper"
            defaultValue={defaultPrompt}
            className="h-[180px] resize-none overflow-y-auto text-xs"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            不使用 API 时，可将上面的提示词配合你的工具使用。
          </p>
        </div>
      </CardContent>
    </Card>
  )
}