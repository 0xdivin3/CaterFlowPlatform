# Deploying to Vercel

Your project is now configured for Vercel deployment. Follow these steps:

## Step 1: Initialize Git & Push to GitHub

```powershell
cd "c:\Users\USER\Documents\myProject\CaterFlowPlatform"
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

Then create a repository on [github.com](https://github.com) and push:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/caterflow-platform.git
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Select your `caterflow-platform` repository
4. Click "Import"
5. Click "Deploy"

That's it! Vercel will automatically:
- Detect your Node.js/Express setup
- Build your project
- Deploy your frontend + API

Your app will be live at a URL like: `https://caterflow-platform.vercel.app`

## What's Ready

✅ **Frontend** — Vanilla HTML/CSS/JS  
✅ **API** — Express.js with CRUD endpoints  
✅ **Data** — Uses `/tmp/data.json` (per-deployment storage)  
✅ **Config** — `vercel.json` configured for serverless  

## Future: Add a Database

When you're ready for persistent data across deployments, connect MongoDB Atlas or Supabase:

1. Create a free account on [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Get your connection string
3. Add to Vercel environment variables in project settings
4. Update `api/index.js` to use `mongoose` or database client

For now, your app works with localStorage on the frontend + server-side session storage.
