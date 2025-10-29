import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    const { resumeText, apiKey, provider = 'openai' } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Please provide resume text.' },
        { status: 400 }
      );
    }

    // Get API key
    const apiKeyToUse = apiKey || (provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.DEEPSEEK_API_KEY);
    
    if (!apiKeyToUse) {
      return NextResponse.json(
        { error: `Please provide a ${provider === 'openai' ? 'OpenAI' : 'DeepSeek'} API key.` },
        { status: 400 }
      );
    }

    // Choose parsing method based on provider
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
    console.error('Error parsing resume:', error);
    
    // Handle different error types
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your API key.' },
        { status: 401 }
      );
    }
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { 
          error: 'API quota is insufficient. Please check your account balance or use another API key.',
          details: 'You can: 1) check your account balance 2) upgrade to a paid plan 3) use another valid API key',
          fallback: true
        },
        { status: 402 }
      );
    }
    
    if (error.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while parsing the resume. Please try again.' },
      { status: 500 }
    );
  }
}

// Parse resume text with OpenAI
async function parseResumeWithOpenAI(apiKey, resumeText) {
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  return await parseResumeWithChatGPT(openai, resumeText, process.env.OPENAI_MODEL || 'gpt-3.5-turbo');
}

// Parse resume text with DeepSeek (OpenAI-compatible API)
async function parseResumeWithDeepSeek(apiKey, resumeText) {
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.deepseek.com/v1',
  });

  return await parseResumeWithChatGPT(openai, resumeText, 'deepseek-chat');
}

async function parseResumeWithChatGPT(openai, resumeText, modelName = 'gpt-3.5-turbo') {
  const prompt = `Please parse the following resume text into a standardized JSON format. Strictly follow the JSON schema below and do not add any extra text or explanation:

{
  "personalInfo": {
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "address": "Address",
    "linkedin": "LinkedIn",
    "github": "GitHub",
    "website": "Website"
  },
  "summary": "Professional summary or career objective",
  "education": [
    {
      "institution": "Institution",
      "degree": "Degree",
      "major": "Major",
      "graduationDate": "Graduation Date",
      "gpa": "GPA (if available)"
    }
  ],
  "experience": [
    {
      "company": "Company",
      "position": "Position",
      "startDate": "Start Date",
      "endDate": "End Date",
      "description": "Job Description",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "skills": {
    "technical": ["Technical skills"],
    "languages": ["Languages"],
    "soft": ["Soft skills"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Project Description",
      "technologies": ["Technologies used"],
      "link": "Project link (if any)"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuer",
      "date": "Date"
    }
  ]
}

Resume text:
${resumeText}

Please return ONLY the JSON data with no additional text:`;

  try {
    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume parsing assistant. Convert the user\'s resume text into a standardized JSON format. Return ONLY JSON data without any explanations or extra text.'
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
    
    // Try parsing JSON
    let parsedData;
    try {
      // Remove possible markdown code block markers
      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
      parsedData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', responseText);
      
      // If JSON parsing fails, return a basic structure
      parsedData = {
        personalInfo: {
          name: "Parsing failed",
          email: "",
          phone: "",
          address: "",
          linkedin: "",
          github: "",
          website: ""
        },
        summary: "ChatGPT response format error. Unable to parse.",
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

    // Add metadata
    parsedData.metadata = {
      parsedAt: new Date().toISOString(),
      method: 'chatgpt',
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
    };

    return parsedData;

  } catch (error) {
    console.error('ChatGPT API call failed:', error);
    throw error;
  }
}