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
    <Card className="shadow-none border-neutral-200 bg-white dark:bg-neutral-900 animate-fade-in h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Text Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 flex flex-col h-full">
        <div className="flex flex-col gap-1 flex-1">
          <Label htmlFor="resumeText">Resume Content</Label>
          <Textarea
            id="resumeText"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste raw resume text or a pre-parsed JSON..."
            className="flex-1 min-h-[200px] sm:min-h-[300px] resize-y overflow-auto scrollbar-modern"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button onClick={loadDemoData} variant="outline" className="w-full rounded-full px-3 transition-colors duration-200 ease-out hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <Sparkles className="h-4 w-4 mr-2" />
            Load Demo Data
          </Button>

          <Button onClick={handleProcess} disabled={processingParse || processingPdf || !canProcess} className="w-full rounded-full px-3 transition-all duration-200 ease-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            {processingParse ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Parse
              </>
            )}
          </Button>

          <Button onClick={handleProcessToPDF} disabled={processingPdf || processingParse || !canGeneratePDF} className="w-full rounded-full px-3 transition-all duration-200 ease-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            {processingPdf ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate PDF
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}