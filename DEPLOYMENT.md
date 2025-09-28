# 🚀 Deployment Guide for GoDaddy Free Domain

## Overview
This guide will help you deploy your Inclusive Housing Navigator to a free GoDaddy domain using various hosting platforms.

## 🎯 Quick Start (Vercel - Recommended)

### Step 1: Deploy to Vercel
```bash
# Login to Vercel
npx vercel login

# Deploy your app
npx vercel --prod
```

### Step 2: Connect GoDaddy Domain
1. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Domains
   - Add your GoDaddy domain (e.g., `yourdomain.com`)

2. **In GoDaddy DNS Management:**
   - Add CNAME record:
     - **Name:** `www`
     - **Value:** `your-app.vercel.app`
   - Add A record:
     - **Name:** `@`
     - **Value:** `76.76.19.61`

## 🌐 Alternative Platforms

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
4. Deploy!

### GitHub Pages
1. Go to your GitHub repo → Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main`
4. Folder: `/ (root)`

## 🔧 Environment Variables

### For Vercel:
1. Go to Project Settings → Environment Variables
2. Add these variables:
   - `NEXT_PUBLIC_SHOW_CHARTS` = `1`
   - `NEXT_PUBLIC_SHOW_INTERNATIONAL` = `1`
   - `NEXT_PUBLIC_SHOW_RURAL` = `1`
   - `GEMINI_API_KEY` = `your_api_key`
   - `MAPBOX_ACCESS_TOKEN` = `your_token`

### For Netlify:
1. Go to Site Settings → Environment Variables
2. Add the same variables as above

## 📱 Mobile Optimization

Your app is already mobile-optimized with:
- Responsive design
- Touch-friendly interfaces
- Fast loading times
- PWA capabilities

## 🔒 Security Features

- HTTPS enabled by default
- Secure API endpoints
- Input validation
- XSS protection

## 📊 Performance

- Static generation for fast loading
- Image optimization
- Code splitting
- Lazy loading

## 🎨 Custom Domain Setup

### GoDaddy DNS Configuration:
```
Type    Name    Value
A       @       76.76.19.61
CNAME   www     your-app.vercel.app
```

### SSL Certificate:
- Automatically provided by Vercel/Netlify
- Free SSL certificate
- Automatic renewal

## 🚀 Launch Checklist

- [ ] Deploy to hosting platform
- [ ] Configure custom domain
- [ ] Set up environment variables
- [ ] Test all features
- [ ] Verify mobile responsiveness
- [ ] Check accessibility features
- [ ] Test API endpoints
- [ ] Verify SSL certificate

## 🆘 Troubleshooting

### Common Issues:
1. **Domain not working:** Check DNS propagation (can take 24-48 hours)
2. **API errors:** Verify environment variables are set
3. **Build failures:** Check for TypeScript errors
4. **Slow loading:** Enable caching and optimization

### Support:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- GitHub Pages: [docs.github.com/pages](https://docs.github.com/pages)

## 🎉 Success!

Once deployed, your Inclusive Housing Navigator will be live at:
- **Primary:** `https://yourdomain.com`
- **WWW:** `https://www.yourdomain.com`

Your app is now ready for VTHacks 2025 submission! 🏆
