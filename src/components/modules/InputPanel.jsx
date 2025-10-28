"use client"

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FileText, Loader2, Sparkles, Download } from 'lucide-react'

export function InputPanel({
  resumeText,
  setResumeText,
  processingParse,
  processingPdf,
  loadDemoData,
  handleProcess,
  handleProcessToPDF,
  canProcess = true,
  canGeneratePDF = true
}) {
  return (
    <Card className="h-[360px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          简历文本输入
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-full overflow-auto">
        <div>
          <Label htmlFor="resumeText">简历内容</Label>
          <Textarea
            id="resumeText"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="请粘贴简历文本或已解析的JSON内容..."
            className="h-[180px] resize-none overflow-y-auto"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={loadDemoData} variant="outline" className="flex-1 sm:flex-none">
            <Sparkles className="h-4 w-4 mr-2" />
            加载演示数据
          </Button>

          <Button onClick={handleProcess} disabled={processingParse || processingPdf || !canProcess} className="flex-1">
            {processingParse ? (
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

          <Button onClick={handleProcessToPDF} disabled={processingPdf || processingParse || !canGeneratePDF} className="flex-1">
            {processingPdf ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                一键生成PDF
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}