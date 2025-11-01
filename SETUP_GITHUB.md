# 🚀 Quick Setup Guide for GitHub Pages

Your portfolio is ready to be deployed to `https://dreidvd.github.io`

## Steps to Deploy

### 1. Create GitHub Repository

1. Go to: https://github.com/new
2. **Repository name MUST be:** `dreidvd.github.io` (exactly this name for GitHub Pages)
3. Make it **Public** (required for free hosting)
4. **DO NOT** check "Initialize with README"
5. Click "Create repository"

### 2. Initialize Git and Push

Open PowerShell in your project folder and run:

```powershell
# Navigate to your project
cd "C:\Users\Kouki\IT PORTFOLIOS\My Portfolio"

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Portfolio website"

# Add your GitHub repository
git remote add origin https://github.com/dreidvd/dreidvd.github.io.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to: https://github.com/dreidvd/dreidvd.github.io
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **Save**

### 4. Wait for Deployment

- GitHub Pages takes **1-2 minutes** to deploy
- Your site will be live at: **https://dreidvd.github.io**
- You'll receive an email when it's ready

## ✅ What's Been Done

- ✅ `index.html` moved to root folder
- ✅ All CSS/JS paths updated (`../css/` → `css/`)
- ✅ All project image paths updated
- ✅ GitHub link updated to `https://github.com/dreidvd`
- ✅ `.gitignore` created
- ✅ `README.md` created

## 🔄 Updating Your Site

After making changes:

```powershell
git add .
git commit -m "Updated portfolio"
git push
```

Changes will appear on your site in 1-2 minutes.

## 📝 Important Notes

- Repository name **must** be `dreidvd.github.io` for GitHub Pages
- Keep the repository **Public**
- The `index.html` file is now at the root (required)
- All paths have been updated to work from root

## 🆘 Troubleshooting

**Site not loading?**
- Wait 2-3 minutes for GitHub to process
- Check repository name is exactly `dreidvd.github.io`
- Verify repository is Public
- Check Settings → Pages for deployment status

**Images not showing?**
- Make sure all project folders are pushed to GitHub
- Check file paths don't have `../` (they've been updated)

---

Ready to deploy! Follow steps 1-3 above. 🚀

