'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from "@/components/theme-toggle";
import { FileText, Key, Loader2, Download, Eye, EyeOff, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export default function Home() {
  const [resumeText, setResumeText] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [apiKey, setApiKey] = useState('')
  const [apiProvider, setApiProvider] = useState('openai') // 'openai' or 'deepseek'

  // 从localStorage加载API密钥和提供商选择
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai-api-key')
    const savedProvider = localStorage.getItem('api-provider')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
    if (savedProvider) {
      setApiProvider(savedProvider)
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
  const [showApiKey, setShowApiKey] = useState(false)

  const handleProcess = async () => {
    if (!resumeText.trim()) {
      setError('请输入简历文本内容')
      return
    }

    setProcessing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: resumeText,
          apiKey: apiKey.trim() || undefined,
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
    } catch (err) {
      setError(err.message || '处理失败，请重试')
    } finally {
      setProcessing(false)
    }
  }

  // 下载JSON文件
  const downloadJSON = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            简历文本转JSON工具
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            将简历文本内容智能转换为结构化的JSON数据，支持OpenAI和DeepSeek双引擎
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 配置面板 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Key className="h-5 w-5" />
              配置设置
            </h2>
            
            <div className="space-y-4">
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
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder={`输入您的 ${apiProvider === 'openai' ? 'OpenAI' : 'DeepSeek'} API 密钥`}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
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
            </div>
          </Card>

          {/* 输入面板 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              简历文本输入
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="resumeText">简历内容</Label>
                <Textarea
                  id="resumeText"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="请粘贴简历文本内容..."
                  className="h-[200px] max-h-[300px] resize-none overflow-y-auto"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={loadDemoData}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  加载演示数据
                </Button>
                
                <Button
                  onClick={handleProcess}
                  disabled={!apiKey || !resumeText || processing}
                  className="flex-1"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      开始解析
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {error && (
            <Alert variant="destructive" className="lg:col-span-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* 结果区域 */}
        {result && (
          <Card className="p-6 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  解析完成
                </Badge>
              </div>
              <Button
                onClick={downloadJSON}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                下载JSON文件
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              简历文本解析后的JSON数据预览
            </p>
            
            <Separator className="my-4" />
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </Card>
        )}

        {/* 功能说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-1">输入文本</h3>
                <p className="text-sm text-gray-600">输入或粘贴简历文本</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-1">自动解析</h3>
                <p className="text-sm text-gray-600">AI自动提取简历信息</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-1">下载JSON</h3>
                <p className="text-sm text-gray-600">获取结构化数据文件</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
