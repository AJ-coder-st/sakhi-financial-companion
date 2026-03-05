# Deployment Guide - Production Ready

## 🚀 Pre-Deployment Verification

### ✅ Code Quality
```bash
# Check for TypeScript errors
bun run type-check

# Expected: ✅ No errors

# Check ESLint
bun run lint

# Expected: ✅ No critical warnings

# Build for production
bun run build

# Expected: ✅ Build successful, dist/ folder created
```

### ✅ Environment Variables
```bash
# Required in production:
GOOGLE_API_KEY=your-gemini-api-key-here

# Optional but recommended:
VITE_API_BASE_URL=https://your-domain.com
NODE_ENV=production
```

### ✅ Module Verification
```typescript
// Verify all modules export correctly
import { calculateSnapshot } from "@/lib/financialTwin";
import { getHealthScore } from "@/lib/financialHealthScore";
import { getTopSchemes } from "@/lib/schemeMatcher";
import schemes from "@/data/schemes.json";
import VoiceAssistant from "@/components/VoiceAssistant";

// All imports should succeed with no errors
```

---

## 📦 Build Output

### Dist Folder Structure
```
dist/
├── index.html              # Main entry point
├── assets/
│   ├── index-xxx.js        # Bundle (minified)
│   ├── index-xxx.css       # Styles (minified)
│   └── fonts/              # Web fonts
├── robots.txt              # SEO
└── favicon.ico             # Favicon
```

### Build Optimization
- Bundle size: ~500-600KB (gzipped)
- JavaScript: Minified and tree-shaken
- CSS: Minified and prefixed
- Images: Optimized (if any)
- Fonts: Subset for performance

---

## 🌐 Deployment Platforms

### Option 1: Vercel (Recommended for Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to GitHub repo
# - Select framework: Vite
# - Build command: bun run build
# - Output directory: dist

# After deployment:
# - Set GOOGLE_API_KEY in Vercel dashboard
# - Environment → Production
# - Add GOOGLE_API_KEY variable
```

**Vercel Deployment Benefits:**
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Environment variables managed
- ✅ Auto-deploy on git push
- ✅ Free tier available

**Vercel Configuration (vercel.json):**
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "env": [
    {
      "key": "GOOGLE_API_KEY",
      "scope": "production"
    }
  ]
}
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir dist

# Or connect GitHub:
# - Go to Netlify.com
# - Connect GitHub repo
# - Select build command: bun run build
# - Output directory: dist
```

**Netlify Configuration (netlify.toml):**
```toml
[build]
  command = "bun run build"
  publish = "dist"

[env]
  GOOGLE_API_KEY = "your-key"
```

### Option 3: Docker + Cloud Run (Google Cloud)
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json bun.lockb ./
RUN npm install -g bun && bun install

COPY . .

RUN bun run build

EXPOSE 3000

FROM node:18-alpine
COPY --from=builder /app/dist /app/dist
CMD ["bun", "run", "preview"]
```

```bash
# Build Docker image
docker build -t sakhi-app .

# Push to Google Cloud Registry
docker tag sakhi-app gcr.io/your-project-id/sakhi-app:latest
docker push gcr.io/your-project-id/sakhi-app:latest

# Deploy to Cloud Run
gcloud run deploy sakhi-app --image gcr.io/your-project-id/sakhi-app:latest --platform managed --region asia-south1 --allow-unauthenticated --set-env-vars GOOGLE_API_KEY=your-key
```

### Option 4: Azure App Service
```bash
# Install Azure CLI
# https://learn.microsoft.com/en-us/cli/azure/

# Login to Azure
az login

# Create resource group
az group create --name sakhi-rg --location southindia

# Create app service plan
az appservice plan create --name sakhi-plan --resource-group sakhi-rg --sku B1 --is-linux

# Create web app
az webapp create --resource-group sakhi-rg --plan sakhi-plan --name sakhi-app --runtime "NODE|18-lts"

# Deploy
az webapp deployment source config-zip --resource-group sakhi-rg --name sakhi-app --src dist.zip

# Set environment variable
az webapp config appsettings set --resource-group sakhi-rg --name sakhi-app --settings GOOGLE_API_KEY=your-key
```

---

## 🔒 Security Checklist

### Before Production
- [ ] Remove console.log statements (use proper logging)
- [ ] Validate all user inputs
- [ ] Sanitize data before display
- [ ] Use HTTPS only (enforced by platforms)
- [ ] Set secure headers:
  ```
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000
  ```
- [ ] Enable CORS headers properly
- [ ] Protect API keys (use environment variables)
- [ ] Add rate limiting to API
- [ ] Use Content Security Policy (CSP)

### Vite Configuration for Security
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  }
})
```

### API Security
```typescript
// app/api/assistant/route.ts - Already implemented
// But verify:
- [ ] Rate limiting on requests
- [ ] API key never logged
- [ ] Input validation
- [ ] Error handling doesn't expose internals
- [ ] CORS configured correctly
```

---

## 📊 Monitoring & Analytics

### Setup Sentry for Error Tracking
```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/project",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### Setup Google Analytics
```typescript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Monitor Key Metrics
- [ ] Page load time < 3s
- [ ] Voice recognition accuracy
- [ ] API response time < 2s
- [ ] Error rate < 0.1%
- [ ] User engagement
- [ ] Scheme application conversion

---

## 🌍 Multi-Region Deployment

### India Primary Regions
- **Primary:** Asia South 1 (Mumbai)
- **Secondary:** Asia South 2 (Delhi)
- **Backup:** Southeast Asia (Singapore)

### Deployment Strategy
```
Vercel Global Edge
    ↓
Asia South 1 (India)
    ↓
Gemini API (Google Cloud India)
    ↓
Database (India - if added later)
```

---

## 💾 Database Setup (Future Enhancement)

### Firebase Realtime Database
```javascript
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  projectId: "sakhi-app",
  databaseURL: "https://sakhi-app.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Save user profile
push(ref(database, 'users/' + userId), {
  income: 30000,
  expenses: 20000,
  timestamp: Date.now()
});
```

### PostgreSQL + Supabase
```sql
-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  income DECIMAL(10,2),
  expenses DECIMAL(10,2),
  health_score INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  amount DECIMAL(10,2),
  category VARCHAR(50),
  transaction_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📱 Mobile App Optimization

### PWA Configuration
```json
// In public/manifest.json
{
  "name": "SAKHI - Financial Companion",
  "short_name": "SAKHI",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#FF9933",
  "background_color": "#FFFFFF",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "orientation": "portrait"
}
```

### Service Worker Caching
```typescript
// Implemented automatically by Vite PWA plugin
// Enable in vite.config.ts:
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
            }
          }
        ]
      }
    })
  ]
}
```

---

## 🚀 Continuous Deployment

### GitHub Actions (Auto-Deploy)
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        
      - name: Install dependencies
        run: bun install
        
      - name: Run tests
        run: bun run test
        
      - name: Build
        run: bun run build
        env:
          GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY }}
        
      - name: Deploy to Vercel
        uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Automated Testing
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
  }
})
```

```bash
# Run tests before deployment
bun run test

# Expected: All tests pass
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (`bun run test`)
- [ ] No TypeScript errors (`bun run type-check`)
- [ ] No console errors or warnings
- [ ] All dependencies in production
- [ ] Environment variables configured
- [ ] API keys secured
- [ ] Build size acceptable
- [ ] Performance audit passed
- [ ] Accessibility audit passed

### Deployment
- [ ] Build command: `bun run build`
- [ ] Output directory: `dist/`
- [ ] Node version: 18+
- [ ] Environment variables set in platform
- [ ] HTTPS enabled
- [ ] Domain configured
- [ ] SSL certificate valid

### Post-Deployment
- [ ] Application loads without errors
- [ ] Voice assistant works
- [ ] API calls respond correctly
- [ ] Charts render properly
- [ ] Mobile responsive
- [ ] All pages accessible
- [ ] No 404 errors
- [ ] Analytics tracking
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (Google Analytics)
- [ ] Monitor API response times
- [ ] Monitor user engagement
- [ ] Set up alerts for errors
- [ ] Daily health check

---

## 🌐 Domain & SSL

### Custom Domain Setup
```
Vercel/Netlify → Your Domain
1. Add domain in platform
2. Update DNS records:
   A record: Points to platform IP
   CNAME: www → platform
3. Wait for DNS propagation (5-30 mins)
4. SSL certificate auto-generated
5. Redirect HTTP → HTTPS
```

### DNS Records
```
yourdomain.com        A        76.76.19.21    (Vercel IP)
www.yourdomain.com    CNAME    cname.vercel.sh
sakhi.yourdomain.com  CNAME    cname.vercel.sh
```

---

## 📧 Notification Setup

### Email Alerts
```typescript
// app/api/assistant/route.ts - can add email on error
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send error email
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'admin@example.com',
  subject: 'SAKHI App Error Alert',
  text: 'Error details...'
});
```

---

## 🔄 Rollback Procedure

### If deployment fails:
```bash
# Vercel
vercel rollback

# Netlify
netlify deploy --prod --dir dist/old-build/

# Docker
kubectl rollout undo deployment/sakhi-app
```

---

## 📈 Performance Optimization

### Recommended Settings
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    sourcemap: false,  // Disable in prod
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'recharts']
        }
      }
    }
  },
  // Enable compression
  server: {
    compression: 'gzip'
  }
})
```

### CDN Configuration
```
Static assets:
- index.html          → Cache 1 hour
- JS/CSS files        → Cache 1 year (versioned)
- Images              → Cache 30 days
- API responses       → No cache
```

---

## 🆘 Support & Maintenance

### Post-Launch Support
1. **Monitor errors daily** via Sentry dashboard
2. **Check analytics** for user behavior
3. **Fix bugs within 24 hours**
4. **Respond to user feedback**
5. **Update API keys** if needed

### Maintenance Schedule
- Weekly: Check error logs
- Monthly: Review analytics
- Quarterly: Update dependencies
- Annually: Security audit

---

## 🎉 Launch Checklist

Final items before public launch:

- [ ] All modules tested ✅
- [ ] Security audit passed ✅
- [ ] Performance audit passed ✅
- [ ] Accessibility audit passed ✅
- [ ] Mobile tested ✅
- [ ] API working ✅
- [ ] Error handling working ✅
- [ ] Monitoring set up ✅
- [ ] Team trained ✅
- [ ] Documentation updated ✅
- [ ] Backup system ready ✅
- [ ] Support channels open ✅

---

**🚀 Ready for production deployment!**

For questions or issues, refer to:
- [MODULES_IMPLEMENTATION_GUIDE.md](./MODULES_IMPLEMENTATION_GUIDE.md)
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- [TESTING_GUIDE.md](./TESTING_GUIDE.md)
