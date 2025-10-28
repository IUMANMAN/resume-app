// 默认模块样式与排版元信息
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
    sectionPadding: '0.75rem',
    moduleSpacingRem: '0.9rem',
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
    sectionPadding: '0.75rem',
    moduleSpacingRem: '0.9rem',
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
    sectionPadding: '0.75rem',
    moduleSpacingRem: '0.9rem',
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
    sectionPadding: '0.75rem',
    moduleSpacingRem: '0.9rem',
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
    sectionPadding: '0.75rem',
    moduleSpacingRem: '0.9rem',
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
    sectionPadding: '0.75rem',
    moduleSpacingRem: '0.9rem',
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
    sectionPadding: '0.75rem',
    moduleSpacingRem: '0.9rem',
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
    sectionPadding: '0.75rem',
    moduleSpacingRem: '0.9rem',
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
    sectionPadding: '0.75rem',
    moduleSpacingRem: '0.9rem',
    iconColor: '#0ea5e9',
    showIcon: true,
    height: 0,
  },
}

// 全局样式默认值（用于各模块的初始全局配置）
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
  sectionPadding: '0.75rem',
  moduleSpacingRem: '1.5rem',
}

// 解析使用的默认 Prompt（集中管理，便于后续调整/国际化）
export const DEFAULT_PROMPT = `请将以下简历文本解析为标准化的JSON格式。请严格按照以下JSON结构返回数据，不要添加任何其他文本或解释：

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

请只返回JSON数据，不要包含任何其他文本。`

// 演示用简历文本（集中管理，避免散落在组件里）
export const DEMO_RESUME_TEXT = `张三
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
热爱编程，具有强烈的学习能力和团队合作精神。善于沟通，能够快速适应新环境和新技术。对前端技术有深入理解，关注用户体验和代码质量。`

// 布局元数据默认值与统一写入 JSON 的工具函数
export const ensureDefaultLayout = (data) => {
  const safe = data || {}
  const meta = safe.metadata || {}
  const layout = meta.layout || {}
  const columns = layout.columns || {
    left: ['summary', 'workExperience', 'education'],
    right: ['skills', 'projects', 'awards', 'languages']
  }
  return {
    ...safe,
    metadata: {
      ...meta,
      layout: {
        ...layout,
        columns
      }
    }
  }
}