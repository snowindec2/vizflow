# 🚀 Vercel 部署完整指南

## 方法 1：通过 Vercel 网页界面部署（推荐）⭐

这是最简单稳定的方式，不需要命令行操作！

### 步骤：

### 1️⃣ 推送代码到 GitHub

首先确保代码已推送到 GitHub：

```bash
cd /Users/snowindec/Documents/apps/vizflow2/vizflow
git push origin main
```

如果推送失败，可以手动在 GitHub 网页上操作。

---

### 2️⃣ 导入到 Vercel

1. **访问 Vercel：** https://vercel.com/login
   
2. **登录/注册：**
   - 点击 "Continue with GitHub"
   - 授权 Vercel 访问你的 GitHub 账号

3. **导入项目：**
   - 登录后，点击 "Add New..." → "Project"
   - 选择 "Import Git Repository"
   - 找到并选择 `snowindec2/vizflow` 仓库
   - 点击 "Import"

4. **配置项目：**
   - **Project Name:** 保持默认或自定义
   - **Framework Preset:** 自动检测为 "Vite"
   - **Root Directory:** `./` (默认)
   - **Build Command:** `npm run build` (自动填充)
   - **Output Directory:** `dist` (自动填充)
   - **Install Command:** `npm install` (自动填充)

5. **环境变量（重要）：**
   - 展开 "Environment Variables" 部分
   - 添加变量：
     - **Name:** `GEMINI_API_KEY`
     - **Value:** 你的 Gemini API Key（从 https://ai.google.dev/ 获取）
   - 点击 "Add"

6. **部署：**
   - 点击 "Deploy" 按钮
   - 等待 2-3 分钟构建完成
   - 🎉 获得你的网站地址！

---

## 方法 2：通过 Vercel CLI 部署

如果网络稳定，可以使用命令行：

### 步骤：

```bash
# 1. 进入项目目录
cd /Users/snowindec/Documents/apps/vizflow2/vizflow

# 2. 登录 Vercel（会打开浏览器）
npx vercel login

# 3. 首次部署（会询问一些配置问题）
npx vercel

# 按照提示回答：
# ? Set up and deploy "~/Documents/apps/vizflow2/vizflow"? [Y/n] y
# ? Which scope do you want to deploy to? [选择你的账号]
# ? Link to existing project? [N/y] n
# ? What's your project's name? vizflow
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] n

# 4. 部署到生产环境
npx vercel --prod
```

---

## 方法 3：使用 Vercel Token（适合自动化）

如果无法交互式登录：

```bash
# 1. 在 Vercel 网页获取 Token
# 访问：https://vercel.com/account/tokens
# 创建新 Token

# 2. 使用 Token 部署
cd /Users/snowindec/Documents/apps/vizflow2/vizflow
npx vercel --token YOUR_VERCEL_TOKEN --prod --yes
```

---

## 📝 部署后配置

### 添加/更新环境变量：

1. 访问 Vercel Dashboard：https://vercel.com/dashboard
2. 选择你的项目
3. 进入 "Settings" → "Environment Variables"
4. 添加：
   - **Key:** `GEMINI_API_KEY`
   - **Value:** 你的 API Key
   - **Environment:** Production, Preview, Development (全选)
5. 点击 "Save"
6. 重新部署项目（Settings → Deployments → 最新部署 → "..." → "Redeploy"）

---

## 🌐 自定义域名（可选）

1. 在 Vercel 项目中，进入 "Settings" → "Domains"
2. 输入你的域名（如 `vizflow.yourdomain.com`）
3. 按照提示在你的域名服务商添加 DNS 记录
4. 等待 DNS 生效（通常几分钟到几小时）

---

## 🔄 自动部署

配置完成后，每次你推送代码到 GitHub main 分支，Vercel 会自动：
- 检测到更新
- 自动构建
- 自动部署
- 发送通知

---

## 📊 当前项目信息

- **仓库：** https://github.com/snowindec2/vizflow
- **框架：** Vite + React + TypeScript
- **构建命令：** `npm run build`
- **输出目录：** `dist`
- **Node 版本：** 自动检测

---

## ❓ 常见问题

### Q: 部署失败怎么办？
A: 查看 Vercel 的构建日志，通常会显示具体错误。常见问题：
- 缺少依赖：确保 `package.json` 完整
- 环境变量未设置：检查 `GEMINI_API_KEY`
- 构建超时：可能需要优化代码

### Q: 如何查看部署日志？
A: 在 Vercel Dashboard → 项目 → Deployments → 点击具体部署 → 查看 "Building" 日志

### Q: 可以回滚到之前的版本吗？
A: 可以！在 Deployments 页面，找到之前的部署，点击 "..." → "Promote to Production"

---

## 🎯 推荐部署流程

**最简单的方式：**

1. ✅ 代码已在 GitHub：https://github.com/snowindec2/vizflow
2. 🌐 访问：https://vercel.com/new
3. 🔗 连接 GitHub 并导入 `vizflow` 仓库
4. ⚙️ 添加环境变量 `GEMINI_API_KEY`
5. 🚀 点击 Deploy
6. ⏳ 等待 2-3 分钟
7. 🎉 完成！

---

**预计部署时间：** 5-10 分钟（包括注册和配置）

**获得的域名：** `https://vizflow-xxx.vercel.app`（可自定义）

