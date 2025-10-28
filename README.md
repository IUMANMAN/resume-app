# AI 文本简历一键生成

一个基于 Next.js 的现代化 Web 应用，支持粘贴简历文本或 JSON，AI 解析与一键生成 PDF。输入为 JSON 时直接加载，无需调用 AI；输入为文本且配置了 API 密钥时可使用 AI 解析为结构化数据。

## 功能特性

- ✂️ 文本/JSON 输入：支持粘贴简历文本或 JSON 数据
- 🤖 智能解析：有密钥时调用 API 解析文本为结构化 JSON
- ⚡ 直接处理 JSON：当输入为 JSON 时跳过 AI，直接预览与导出
- 🖨️ 一键生成 PDF：基于已渲染预览生成排版良好的 PDF
- 👀 实时预览：解析结果即时可视化，方便校验和微调
- 🌓 主题切换：内置明暗主题，适配不同环境

## 工作原理

- 解析流程：
  - 输入为 JSON：本地直接解析并加载为 `resumeData`，不调用 API。
  - 输入为文本：若配置了 `OPENAI_API_KEY`，调用 `/api/parse-resume` 将文本转为 JSON；未配置则提示无法使用 AI。
- PDF 生成：
  - 有 API：基于当前已渲染的预览（`resumeData`）；若输入为 JSON 也可直接生成。
  - 无 API：支持在已有预览或输入为有效 JSON 时直接生成。

## 技术栈

- 前端框架：Next.js 16（App Router）
- 样式：Tailwind CSS
- UI 组件：shadcn/ui
- PDF：`html2canvas` + `jspdf`
- 图标：Lucide React
- 语言：JavaScript

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   └── parse-resume/
│   │       └── route.js          # 文本解析为 JSON 的 API
│   ├── globals.css               # 全局样式
│   ├── layout.js                 # 根布局与元信息
│   └── page.js                   # 主页面与处理逻辑
├── components/
│   ├── modules/                  # 输入、配置、工作区等模块
│   ├── ui/                       # shadcn/ui 组件封装
│   └── json-viewer.jsx           # JSON 视图
└── lib/
    └── utils.js                  # 工具函数（含 cn 合并）
```

## 快速开始

### 安装依赖

```bash
npm install
```


### 本地开发

```bash
npm run dev
```

打开 `http://localhost:3000` 访问应用。

### 构建与启动

```bash
npm run build
npm start
```

## 使用指南

- 粘贴简历文本：点击“开始解析”，在配置了密钥时由 AI 将文本转为 JSON 并预览。
- 粘贴 JSON：直接加载为预览数据，跳过 AI 调用。
- 一键生成 PDF：确保右侧预览已渲染，点击生成 PDF。

## JSON 示例

```json
{
  "personal": { "name": "张三", "email": "zhangsan@example.com", "phone": "13800000000" },
  "education": [
    { "school": "XX大学", "degree": "本科", "major": "计算机科学", "start": "2017-09", "end": "2021-06" }
  ],
  "experience": [
    { "company": "ABC科技", "title": "前端工程师", "start": "2021-07", "end": "2024-10", "desc": "负责 Web 应用开发与性能优化" }
  ],
  "skills": ["JavaScript", "React", "Tailwind"],
  "projects": [
    { "name": "简历生成器", "tech": ["Next.js", "Tailwind"], "desc": "实现简历预览与 PDF 导出" }
  ]
}
```

## 许可证

MIT License
