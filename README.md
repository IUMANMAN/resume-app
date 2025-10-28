# 简历PDF转JSON工具

一个基于Next.js构建的现代化Web应用，可以将PDF格式的简历快速转换为结构化的JSON数据。

## 功能特性

- 📄 **PDF上传**: 支持拖拽或点击上传PDF简历文件
- 🔍 **智能解析**: 自动提取个人信息、教育背景、工作经验、技能和项目经验
- 📊 **实时预览**: 解析结果实时显示，支持JSON格式预览
- 💾 **一键下载**: 支持将解析结果导出为JSON文件
- 🎨 **现代UI**: 使用shadcn/ui组件库，提供美观的用户界面
- 📱 **响应式设计**: 完美适配桌面和移动设备

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **PDF解析**: pdf-parse
- **图标**: Lucide React
- **语言**: JavaScript (非TypeScript)

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 使用方法

1. **上传PDF**: 点击上传区域选择PDF简历文件
2. **开始解析**: 点击"开始解析"按钮处理文件
3. **查看结果**: 在右侧面板查看解析后的JSON数据
4. **下载文件**: 点击"下载JSON文件"保存结果

## 解析字段

应用会尝试从PDF中提取以下信息：

- **个人信息**: 姓名、邮箱、电话
- **教育背景**: 学校、学位、专业、时间
- **工作经验**: 公司、职位、工作描述、时间
- **技能**: 技术技能列表
- **项目经验**: 项目名称、描述、技术栈

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   └── parse-pdf/
│   │       └── route.js          # PDF解析API
│   ├── globals.css               # 全局样式
│   ├── layout.js                 # 根布局
│   └── page.js                   # 主页面
├── components/
│   └── ui/                       # shadcn/ui组件
└── lib/
    └── utils.js                  # 工具函数
```

## 自定义解析逻辑

如需修改PDF解析逻辑，请编辑 `src/app/api/parse-pdf/route.js` 文件中的解析函数：

- `extractPersonalInfo()`: 个人信息提取
- `extractEducation()`: 教育背景提取
- `extractExperience()`: 工作经验提取
- `extractSkills()`: 技能提取
- `extractProjects()`: 项目经验提取

## 注意事项

- 支持的文件格式：PDF
- 最大文件大小：建议不超过10MB
- 解析准确性取决于PDF的文本结构和格式
- 建议使用文本型PDF而非扫描件

## 许可证

MIT License
