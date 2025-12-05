# ClariDx Deployment Guide

Your app is ready to deploy! Choose one of these options:

## Option 1: Vercel (Recommended - Easiest)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts and your app will be live!

## Option 2: Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Option 3: Manual Static Hosting

The `dist` folder contains your built app. Upload it to any static hosting:
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront
- Any web server

## Environment Variables

Make sure to set these in your hosting platform:
- `OPENROUTER_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`

## Post-Deployment

1. Update Supabase allowed URLs:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your deployment URL to allowed redirect URLs

2. Test the deployment:
   - Sign up as doctor
   - Sign up as patient
   - Test messaging
   - Test diagnostic co-pilot

Your app is now live! 🎉
