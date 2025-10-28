// Default module styles and layout metadata
export const DEFAULT_MODULE_META = {
  personalInfo: {
    bgColor: '#f8fafc',
    titleFontSize: '1.125rem',
    titleColor: '#0f172a',
    titleAlign: 'left',
    h1FontSize: '1.05rem',
    h1FontColor: '#0f172a',
    h1Align: 'left',
    h2FontSize: '0.95rem',
    h2FontColor: '#475569',
    h2Align: 'left',
    fontColor: '#0f172a',
    lineHeight: '1.6',
    sectionPadding: '0.6rem',
    moduleSpacingRem: '1.0rem',
    iconColor: '#0ea5e9',
    showIcon: true,
    height: 0,
  },
  summary: {
    bgColor: '#ffffff',
    titleFontSize: '1.125rem',
    titleColor: '#0f172a',
    titleAlign: 'left',
    h1FontSize: '1.05rem',
    h1FontColor: '#0f172a',
    h1Align: 'left',
    h2FontSize: '0.95rem',
    h2FontColor: '#475569',
    h2Align: 'left',
    fontColor: '#0f172a',
    lineHeight: '1.6',
    sectionPadding: '0.6rem',
    moduleSpacingRem: '1.0rem',
    iconColor: '#0ea5e9',
    showIcon: true,
    height: 0,
  },
  experience: {
    bgColor: '#ffffff',
    titleFontSize: '1.125rem',
    titleColor: '#0f172a',
    titleAlign: 'left',
    h1FontSize: '1.05rem',
    h1FontColor: '#0f172a',
    h1Align: 'left',
    h2FontSize: '0.95rem',
    h2FontColor: '#475569',
    h2Align: 'left',
    fontColor: '#0f172a',
    lineHeight: '1.6',
    sectionPadding: '0.6rem',
    moduleSpacingRem: '1.0rem',
    iconColor: '#0ea5e9',
    showIcon: true,
    height: 0,
  },
  education: {
    bgColor: '#ffffff',
    titleFontSize: '1.125rem',
    titleColor: '#0f172a',
    titleAlign: 'left',
    h1FontSize: '1.05rem',
    h1FontColor: '#0f172a',
    h1Align: 'left',
    h2FontSize: '0.95rem',
    h2FontColor: '#475569',
    h2Align: 'left',
    fontColor: '#0f172a',
    lineHeight: '1.6',
    sectionPadding: '0.6rem',
    moduleSpacingRem: '1.0rem',
    iconColor: '#0ea5e9',
    showIcon: true,
    height: 0,
  },
  skills: {
    bgColor: '#ffffff',
    titleFontSize: '1.125rem',
    titleColor: '#0f172a',
    titleAlign: 'left',
    h1FontSize: '1.05rem',
    h1FontColor: '#0f172a',
    h1Align: 'left',
    h2FontSize: '0.95rem',
    h2FontColor: '#475569',
    h2Align: 'left',
    fontColor: '#0f172a',
    lineHeight: '1.6',
    sectionPadding: '0.6rem',
    moduleSpacingRem: '1.0rem',
    iconColor: '#0ea5e9',
    showIcon: true,
    height: 0,
  },
  projects: {
    bgColor: '#ffffff',
    titleFontSize: '1.125rem',
    titleColor: '#0f172a',
    titleAlign: 'left',
    h1FontSize: '1.05rem',
    h1FontColor: '#0f172a',
    h1Align: 'left',
    h2FontSize: '0.95rem',
    h2FontColor: '#475569',
    h2Align: 'left',
    fontColor: '#0f172a',
    lineHeight: '1.6',
    sectionPadding: '0.6rem',
    moduleSpacingRem: '1.0rem',
    iconColor: '#0ea5e9',
    showIcon: true,
    height: 0,
  },
  certifications: {
    bgColor: '#ffffff',
    titleFontSize: '1.125rem',
    titleColor: '#0f172a',
    titleAlign: 'left',
    h1FontSize: '1.05rem',
    h1FontColor: '#0f172a',
    h1Align: 'left',
    h2FontSize: '0.95rem',
    h2FontColor: '#475569',
    h2Align: 'left',
    fontColor: '#0f172a',
    lineHeight: '1.6',
    sectionPadding: '0.6rem',
    moduleSpacingRem: '1.0rem',
    iconColor: '#0ea5e9',
    showIcon: true,
    height: 0,
  },
  awards: {
    bgColor: '#ffffff',
    titleFontSize: '1.125rem',
    titleColor: '#0f172a',
    titleAlign: 'left',
    h1FontSize: '1.05rem',
    h1FontColor: '#0f172a',
    h1Align: 'left',
    h2FontSize: '0.95rem',
    h2FontColor: '#475569',
    h2Align: 'left',
    fontColor: '#0f172a',
    lineHeight: '1.6',
    sectionPadding: '0.6rem',
    moduleSpacingRem: '1.0rem',
    iconColor: '#0ea5e9',
    showIcon: true,
    height: 0,
  },
  languages: {
    bgColor: '#ffffff',
    titleFontSize: '1.125rem',
    titleColor: '#0f172a',
    titleAlign: 'left',
    h1FontSize: '1.05rem',
    h1FontColor: '#0f172a',
    h1Align: 'left',
    h2FontSize: '0.95rem',
    h2FontColor: '#475569',
    h2Align: 'left',
    fontColor: '#0f172a',
    lineHeight: '1.6',
    sectionPadding: '0.6rem',
    moduleSpacingRem: '1.0rem',
    iconColor: '#0ea5e9',
    showIcon: true,
    height: 0,
  },
}

// Global style defaults (used as initial global configuration for each module)
export const DEFAULT_GLOBAL_META = {
  titleFontSize: '1.125rem',
  titleColor: '#0f172a',
  titleAlign: 'left',
  h1FontSize: '1.05rem',
  h1FontColor: '#0f172a',
  h1Align: 'left',
  h2FontSize: '0.95rem',
  h2FontColor: '#475569',
  h2Align: 'left',
  lineHeight: '1.6',
  sectionPadding: '0.6rem',
  moduleSpacingRem: '1.2rem',
}

// Default parsing prompt (centralized for future adjustment/internationalization)
export const DEFAULT_PROMPT = `Parse the following resume text into a standardized JSON object. Strictly return data that matches the JSON schema below. Do not include any extra text or explanations.

{
  "personalInfo": {
    "name": "Full Name",
    "email": "Email",
    "phone": "Phone",
    "address": "Address",
    "linkedin": "LinkedIn",
    "github": "GitHub",
    "website": "Website"
  },
  "summary": "Professional summary or objective",
  "education": 
    {
      "institution": "Institution",
      "degree": "Degree",
      "major": "Major",
      "graduationDate": "Graduation Date",
      "gpa": "GPA (optional)"
    },
  "experience":
    {
      "company": "Company",
      "position": "Position",
      "startDate": "Start Date",
      "endDate": "End Date",
      "description": "Role description",
      "achievements": ["Achievement 1", "Achievement 2"]
    },
  "skills": {
    "technical": ["Technical Skills"],
    "languages": ["Language Skills"],
    "soft": ["Soft Skills"]
  },
  "projects": 
    {
      "name": "Project Name",
      "description": "Project Description",
      "technologies": ["Technologies"],
      "link": "Project Link (if any)"
    },
  "certifications": 
    {
      "name": "Certification",
      "issuer": "Issuer",
      "date": "Date"
    },
  "awards": 
    {
      "name": "Award",
      "date": "Date"
    }
}

Return only the JSON data. Do not include any other text.`

// Demo resume text (centralized to avoid scattering across components)
export const DEMO_RESUME_TEXT = `John Doe
Software Engineer

Contact:
Phone: +1-555-000-0000
Email: john.doe@email.com
Address: San Francisco, CA

Education:
2018–2022 University of California, Berkeley — B.S. in Computer Science
GPA: 3.8/4.0

Experience:
Jul 2022–Present Alibaba Group — Frontend Engineer
- Built and maintained the e-commerce platform frontend using React and Vue.js
- Optimized performance and user experience; reduced page load time by 30%
- Contributed to microservices architecture and system refactoring
- Mentored two interns and helped them onboard quickly

Jun 2021–Sep 2021 Tencent — Frontend Intern
- Contributed to QQ Music web client; optimized the player component
- Learned and applied TypeScript to improve code quality and maintainability
- Collaborated with backend teams to integrate APIs

Skills:
Programming: JavaScript, TypeScript, Python, Java
Frontend: React, Vue.js, HTML5, CSS3, Sass, Webpack
Backend: Node.js, Express, MySQL, MongoDB
Tools & Platforms: Git, Docker, Jenkins, AWS

Projects:
1. E-commerce Management System (2022–2023)
   - Stack: React + TypeScript + Ant Design + Node.js
   - Implemented product management, order processing, and user management features
   - Role-based access control; 1,000+ daily active users

2. Personal Blog System (2021)
   - Stack: Vue.js + Express + MongoDB
   - Implemented post publishing, comments, and tag categories
   - Responsive design with mobile support

Awards:
- 2023 Alibaba Group Outstanding Employee
- 2022 Beijing Institute of Technology Excellent Graduate
- 2021 National College Programming Contest — Third Prize

Languages:
- Chinese: Native
- English: CET-6; able to read technical documentation fluently

Summary:
Passionate about programming with strong learning ability and teamwork. Excellent communication skills and quick to adapt to new environments and technologies. Deep understanding of frontend technologies, focused on user experience and code quality.`

// Default layout metadata and helper function to consistently write it into JSON
export const ensureDefaultLayout = (data) => {
  const safe = data || {}
  const meta = safe.metadata || {}
  const layout = meta.layout || {}
  // Remove any legacy columns config; we render modules sequentially
  const { columns, ...restLayout } = layout
  return {
    ...safe,
    metadata: {
      ...meta,
      layout: { ...restLayout }
    }
  }
}