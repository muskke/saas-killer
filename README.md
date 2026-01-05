# SaaS Killer 🔪

![SaaS Killer Banner](./public/hero-bg.png)

> **Stop Paying SaaS Rent.**  
> The curated directory of Open Source Alternatives. Privacy-focused. Self-hosted. No hidden fees.

## 📖 关于项目

**SaaS Killer** 是一个致力于帮助开发者和企业摆脱昂贵 SaaS 订阅费用的开源项目。我们收集、整理并推荐那些优秀的、可自行托管的开源替代方案（Open Source Alternatives）。

无论你需要数据库、DevTools、AI/ML 工具，还是营销和分析平台，这里都能找到可以完全掌控数据的免费/低成本替代品。

## ✨ 核心特性

- **精选目录**：人工筛选的高质量开源替代方案。
- **现代化 UI**：基于 Glassmorphism（毛玻璃）设计的深色模式界面，极具科技感。
- **快速检索**：通过分类标签（DevTools, AI/ML, CMS 等）快速查找工具。
- **社区驱动**：支持用户提交新的开源工具，共同维护目录。
- **SEO 优化**：针对搜索引擎优化的页面结构和元数据。

## 🛠️ 技术栈

本项目使用最新的现代 Web 技术构建：

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Better SQLite3](https://github.com/WiseLibs/better-sqlite3) (本地高性能数据库)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Comments**: [Giscus](https://giscus.app/) (GitHub Discussions 驱动的评论系统)

## 🚀 快速开始

想要在本地运行此项目？请跟随以下步骤：

### 1. 克隆仓库

```bash
git clone https://github.com/muskke/saas-killer.git
cd saas-killer
```

### 2. 安装依赖

推荐使用 npm 或 pnpm：

```bash
npm install
# 或者
pnpm install
```

### 3. 设置环境变量（可选）

如果项目包含 AI 生成功能或其他 API 依赖，请复制 `.env.example` 并配置（如果有）：

```bash
cp .env.example .env.local
```

### 4. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可看到效果。

## 🤝 如何贡献

我们非常欢迎社区贡献！你可以通过以下方式参与：

1.  **提交新工具**：点击导航栏右上角的 "Submit Tool" 按钮，通过 GitHub Issues 推荐优秀的开源项目。
2.  **改进代码**：Fork 本仓库，修复 Bug 或添加新功能，然后提交 Pull Request。
3.  **提出建议**：有任何想法或建议，欢迎在 Issues 区讨论。

## 📄 许可证

[MIT License](LICENSE) © 2024 SaaS Killer
