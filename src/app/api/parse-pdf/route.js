import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('pdf')
    const apiKey = formData.get('apiKey') // 从前端获取API密钥

    if (!file) {
      return NextResponse.json(
        { error: '没有找到PDF文件' },
        { status: 400 }
      )
    }

    // 检查API密钥
    const finalApiKey = apiKey || process.env.OPENAI_API_KEY
    if (!finalApiKey || finalApiKey === 'your_openai_api_key_here') {
      return NextResponse.json(
        { error: '请配置OpenAI API密钥。可以在环境变量中设置OPENAI_API_KEY，或在前端界面中输入。' },
        { status: 400 }
      )
    }

    // 将文件转换为Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 动态导入pdf-parse-fork
    const pdfParse = (await import('pdf-parse-fork')).default
    
    // 解析PDF
    const data = await pdfParse(buffer)
    const text = data.text

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'PDF文件中没有找到可提取的文本内容' },
        { status: 400 }
      )
    }

    // 使用ChatGPT解析简历文本
    const resumeData = await parseResumeWithChatGPT(text, file.name, file.size, finalApiKey)

    return NextResponse.json(resumeData)
  } catch (error) {
    console.error('PDF解析错误:', error)
    
    // 处理不同类型的错误
    if (error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API密钥无效，请检查密钥是否正确' },
        { status: 401 }
      )
    }
    
    if (error.message.includes('quota')) {
      return NextResponse.json(
        { error: 'OpenAI API配额已用完，请检查账户余额' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'PDF解析失败，请确保文件格式正确并检查网络连接' },
      { status: 500 }
    )
  }
}

async function parseResumeWithChatGPT(text, fileName, fileSize, apiKey) {
  try {
    // 创建临时的OpenAI客户端（如果使用前端传入的API密钥）
    const client = new OpenAI({
      apiKey: apiKey,
    })

    const prompt = `
请分析以下简历文本，并将其转换为标准化的JSON格式。请严格按照以下JSON结构返回数据，如果某些信息不存在，请使用空字符串或空数组：

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
  "education": 
    {
      "institution": "学校名称",
      "degree": "学位",
      "major": "专业",
      "period": "时间段",
      "gpa": "GPA",
      "location": "地点"
    },
  "experience": 
    {
      "company": "公司名称",
      "position": "职位",
      "period": "工作时间",
      "location": "工作地点",
      "description": ["工作描述1", "工作描述2"]
    },
  "skills": 
    {
      "category": "技能分类",
      "items": ["技能1", "技能2"]
    },
  "projects": 
    {
      "name": "项目名称",
      "description": "项目描述",
      "technologies": ["技术1", "技术2"],
      "period": "项目时间",
      "url": "项目链接"
    },
  "languages": 
    {
      "language": "语言名称",
      "proficiency": "熟练程度"
    },
  "certifications": 
    {
      "name": "证书名称",
      "issuer": "颁发机构",
      "date": "获得时间"
    },
  "awards": 
    {
      "name": "奖项名称",
      "issuer": "颁发机构",
      "date": "获得时间"
    }
}

请仔细分析以下简历文本，提取所有相关信息：

${text}

请只返回JSON格式的数据，不要包含任何其他文字说明。
`

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的简历解析助手，擅长从简历文本中提取结构化信息并转换为JSON格式。请严格按照要求的JSON结构返回数据。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.3,
    })

    const responseText = completion.choices[0].message.content.trim()
    
    // 尝试解析JSON响应
    let parsedData
    try {
      // 移除可能的markdown代码块标记
      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim()
      parsedData = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('JSON解析错误:', parseError)
      console.error('原始响应:', responseText)
      throw new Error('ChatGPT返回的数据格式无效')
    }

    // 添加文件元数据
    parsedData.fileName = fileName
    parsedData.fileSize = fileSize
    parsedData.uploadedAt = new Date().toISOString()
    parsedData.rawText = text
    parsedData.processedBy = 'ChatGPT'

    return parsedData

  } catch (error) {
    console.error('ChatGPT解析错误:', error)
    
    // 如果ChatGPT解析失败，返回基础解析结果
    return {
      fileName: fileName,
      fileSize: fileSize,
      uploadedAt: new Date().toISOString(),
      rawText: text,
      processedBy: 'Fallback Parser',
      error: `ChatGPT解析失败: ${error.message}`,
      personalInfo: {},
      education: [],
      experience: [],
      skills: [],
      projects: [],
      languages: [],
      certifications: [],
      awards: []
    }
  }
}