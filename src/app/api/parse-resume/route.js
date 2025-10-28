import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    const { resumeText, apiKey, provider = 'openai' } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: '请提供简历文本' },
        { status: 400 }
      );
    }

    // 获取API密钥
    const apiKeyToUse = apiKey || (provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.DEEPSEEK_API_KEY);
    
    if (!apiKeyToUse) {
      return NextResponse.json(
        { error: `请提供${provider === 'openai' ? 'OpenAI' : 'DeepSeek'} API密钥` },
        { status: 400 }
      );
    }

    // 根据提供商选择不同的解析方法
    let parsedData;
    if (provider === 'deepseek') {
      parsedData = await parseResumeWithDeepSeek(apiKeyToUse, resumeText);
    } else {
      parsedData = await parseResumeWithOpenAI(apiKeyToUse, resumeText);
    }

    return NextResponse.json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('解析简历时出错:', error);
    
    // 处理不同类型的错误
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'API密钥无效，请检查您的API密钥' },
        { status: 401 }
      );
    }
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { 
          error: 'API配额不足，请检查您的账户余额或使用其他API密钥',
          details: '您可以：1) 检查账户余额 2) 升级付费计划 3) 使用其他有效的API密钥',
          fallback: true
        },
        { status: 402 }
      );
    }
    
    if (error.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { error: 'API调用频率超限，请稍后再试' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: '解析简历时发生错误，请重试' },
      { status: 500 }
    );
  }
}

// 使用OpenAI解析简历文本
async function parseResumeWithOpenAI(apiKey, resumeText) {
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  return await parseResumeWithChatGPT(openai, resumeText, process.env.OPENAI_MODEL || 'gpt-3.5-turbo');
}

// 使用DeepSeek解析简历文本
async function parseResumeWithDeepSeek(apiKey, resumeText) {
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.deepseek.com/v1',
  });

  return await parseResumeWithChatGPT(openai, resumeText, 'deepseek-chat');
}

async function parseResumeWithChatGPT(openai, resumeText, modelName = 'gpt-3.5-turbo') {
  const prompt = `请将以下简历文本解析为标准化的JSON格式。请严格按照以下JSON结构返回数据，不要添加任何其他文本或解释：

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
  "summary": "个人简介或职业目标",
  "education": [
    {
      "institution": "学校名称",
      "degree": "学位",
      "major": "专业",
      "graduationDate": "毕业时间",
      "gpa": "GPA（如有）"
    }
  ],
  "experience": [
    {
      "company": "公司名称",
      "position": "职位",
      "startDate": "开始时间",
      "endDate": "结束时间",
      "description": "工作描述",
      "achievements": ["成就1", "成就2"]
    }
  ],
  "skills": {
    "technical": ["技术技能"],
    "languages": ["语言技能"],
    "soft": ["软技能"]
  },
  "projects": [
    {
      "name": "项目名称",
      "description": "项目描述",
      "technologies": ["使用技术"],
      "link": "项目链接（如有）"
    }
  ],
  "certifications": [
    {
      "name": "证书名称",
      "issuer": "颁发机构",
      "date": "获得时间"
    }
  ]
}

简历文本：
${resumeText}

请只返回JSON数据，不要包含任何其他文本：`;

  try {
    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的简历解析助手。请将用户提供的简历文本转换为标准化的JSON格式。只返回JSON数据，不要添加任何解释或其他文本。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.1,
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // 尝试解析JSON
    let parsedData;
    try {
      // 移除可能的markdown代码块标记
      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
      parsedData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON解析错误:', parseError);
      console.error('原始响应:', responseText);
      
      // 如果JSON解析失败，返回一个基本的结构
      parsedData = {
        personalInfo: {
          name: "解析失败",
          email: "",
          phone: "",
          address: "",
          linkedin: "",
          github: "",
          website: ""
        },
        summary: "ChatGPT响应格式错误，无法解析",
        education: [],
        experience: [],
        skills: {
          technical: [],
          languages: [],
          soft: []
        },
        projects: [],
        certifications: [],
        rawResponse: responseText
      };
    }

    // 添加元数据
    parsedData.metadata = {
      parsedAt: new Date().toISOString(),
      method: 'chatgpt',
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
    };

    return parsedData;

  } catch (error) {
    console.error('ChatGPT API调用失败:', error);
    throw error;
  }
}