# 🚀 VizFlow 部署指南

生产版本已构建完成！选择以下任一方式部署到外网：

## 方案 1：Netlify Drop（最简单 - 推荐新手）⭐

1. 访问：https://app.netlify.com/drop
2. 将 `dist` 文件夹直接拖拽到网页上
3. 等待上传完成，获得免费的 `.netlify.app` 域名
4. ✅ 完成！网站已上线

**优点：** 
- 完全免费
- 无需注册即可使用（注册后可自定义域名）
- 自动 HTTPS
- 全球 CDN 加速

---

## 方案 2：Vercel（适合开发者）

### 步骤：
```bash
# 1. 登录 Vercel（需要 GitHub/GitLab/Bitbucket 账号）
cd /Users/snowindec/Documents/apps/vizflow2/vizflow
npx vercel login

# 2. 部署
npx vercel --prod --yes
```

**获得：** 免费的 `.vercel.app` 域名

---

## 方案 3：GitHub Pages（免费）

### 步骤：
```bash
# 1. 初始化 Git 仓库（如果还没有）
cd /Users/snowindec/Documents/apps/vizflow2/vizflow
git init
git add .
git commit -m "Initial commit"

# 2. 创建 GitHub 仓库并推送
# 在 https://github.com/new 创建新仓库
git remote add origin YOUR_REPO_URL
git push -u origin main

# 3. 安装 gh-pages
npm install -D gh-pages

# 4. 在 package.json 添加脚本：
# "deploy": "gh-pages -d dist"

# 5. 部署
npm run deploy
```

**访问：** `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

---

## 方案 4：传统服务器部署

将 `dist` 文件夹上传到任何支持静态网站的服务器：
- 阿里云 OSS
- 腾讯云 COS  
- AWS S3
- 自己的 Nginx 服务器

---

## ⚙️ 环境变量配置

**重要：** 部署后需要在平台上配置环境变量：

- **变量名：** `GEMINI_API_KEY`
- **变量值：** 你的 Gemini API Key
- **获取地址：** https://ai.google.dev/

### 各平台配置方法：

**Netlify:** 
Site settings → Environment variables → Add variable

**Vercel:**
Project Settings → Environment Variables → Add

**GitHub Pages:**
需要在构建时注入，或使用 GitHub Secrets

---

## 📝 当前构建信息

- **构建目录：** `dist/`
- **入口文件：** `dist/index.html`
- **资源大小：** ~838 KB
- **框架：** Vite + React + TypeScript

---

## 🎯 快速开始推荐

**最快方式：**
1. 打开 https://app.netlify.com/drop
2. 拖拽 `dist` 文件夹
3. 完成！

整个过程不到 1 分钟 ⚡

