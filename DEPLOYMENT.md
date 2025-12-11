# 🚀 Deployment Guide - Plexo

## Quick Deploy to Vercel (Recommended)

### 1. Prerequisites

- GitHub account
- Vercel account (free tier works)

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Plexo GameFi DApp"
git branch -M main
git remote add origin https://github.com/yourusername/plexo.git
git push -u origin main
```

### 3. Deploy to Vercel

**Option A: Via Vercel Dashboard**

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js
5. Click "Deploy"

**Option B: Via CLI**

```bash
npm i -g vercel
vercel login
vercel
```

### 4. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_ADAPTER_MODE=mock
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PLEXO_PROGRAM_ID=11111111111111111111111111111111
```

**For Devnet Mode (after program deployment):**

```env
NEXT_PUBLIC_ADAPTER_MODE=devnet
NEXT_PUBLIC_PLEXO_PROGRAM_ID=<YourActualProgramId>
NEXT_PUBLIC_SOLANA_RPC=<YourRPCEndpoint>
```

### 5. Redeploy

After adding env vars, trigger a redeploy:

```bash
vercel --prod
```

Your app is now live! 🎉

---

## Alternative: Deploy to Netlify

### 1. Build Settings

- Build command: `npm run build`
- Publish directory: `.next`

### 2. netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 3. Environment Variables

Same as Vercel (in Netlify dashboard)

---

## Alternative: Self-Hosted (VPS/Cloud)

### 1. Build

```bash
npm run build
```

### 2. Start

```bash
npm start
# Or use PM2 for production
pm2 start npm --name "plexo" -- start
```

### 3. Nginx Reverse Proxy (optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Production Checklist

### Before Going Live

- [ ] Update `NEXT_PUBLIC_PLEXO_PROGRAM_ID` with deployed program
- [ ] Set `NEXT_PUBLIC_ADAPTER_MODE=devnet`
- [ ] Use dedicated RPC endpoint (not public ones)
- [ ] Enable rate limiting on API routes
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Test wallet connections
- [ ] Test full bet → claim flow
- [ ] Check mobile responsiveness
- [ ] Review security (no private keys in frontend)
- [ ] Set up analytics (Google Analytics, Plausible)

### Recommended RPC Providers

**For Production (Mainnet)**

- Helius: https://helius.xyz (Recommended)
- QuickNode: https://quicknode.com
- Triton: https://triton.one

**For Devnet/Testing**

- Helius free tier
- Public devnet endpoint (limited)

### Environment Variables Summary

```env
# Required
NEXT_PUBLIC_ADAPTER_MODE=devnet
NEXT_PUBLIC_PLEXO_PROGRAM_ID=<YourProgramId>

# Recommended
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=<YourRPCEndpoint>

# Optional
NEXT_PUBLIC_GA_TRACKING_ID=<GoogleAnalyticsId>
```

---

## Database Migration (Optional)

### Current: In-Memory Store

Works for hackathon/demo but data lost on restart.

### Production: Persistent Database

**Option 1: Prisma + PostgreSQL**

1. Install dependencies:

```bash
npm install @prisma/client
npm install -D prisma
```

2. Initialize Prisma:

```bash
npx prisma init
```

3. Update `src/lib/store.ts`:
   - Replace Map with Prisma queries
   - See TODOs in comments

**Option 2: Supabase**

1. Create project at https://supabase.com
2. Install client:

```bash
npm install @supabase/supabase-js
```

3. Use Supabase real-time for live updates

---

## Performance Optimization

### 1. Enable Image Optimization

In `next.config.js`:

```js
module.exports = {
  images: {
    domains: ["yourdomain.com"],
  },
};
```

### 2. Enable Caching

Add caching headers to API routes

### 3. Use CDN

Vercel includes this automatically

### 4. Optimize Bundle

Already optimized with:

- Code splitting
- Tree shaking
- Minification

---

## Monitoring & Analytics

### Error Tracking

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Analytics

```bash
npm install @vercel/analytics
```

In `src/app/layout.tsx`:

```tsx
import { Analytics } from "@vercel/analytics/react";

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Security Best Practices

1. **Never expose private keys** - Already handled
2. **Validate all inputs** - Already implemented
3. **Rate limit API routes** - Add middleware
4. **Use HTTPS** - Vercel includes this
5. **CSP headers** - Add to `next.config.js`
6. **Audit dependencies** - Run `npm audit`

---

## Scaling Considerations

### For High Traffic

1. **Database**: Migrate to PostgreSQL/Supabase
2. **Caching**: Add Redis for match state
3. **WebSockets**: Use Ably/Pusher for real-time
4. **CDN**: Already on Vercel
5. **Load Balancing**: Vercel handles this

### Cost Optimization

- Use Vercel free tier (hobby projects)
- Shared RPC endpoints for testing
- Dedicated RPC only for production
- Monitor bandwidth usage

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next
npm run build
```

### Wallet Not Connecting

- Check browser console
- Ensure HTTPS (not HTTP)
- Test with Phantom wallet first

### API Routes 404

- Verify `src/pages/api/` structure
- Check build logs

### Environment Variables Not Working

- Must start with `NEXT_PUBLIC_` for client-side
- Restart dev server after changes
- Redeploy on Vercel

---

## Support & Updates

### After Deployment

1. Monitor transaction success rates
2. Watch for failed bets/claims
3. Check RPC endpoint health
4. Review user feedback
5. Update program ID if redeployed

### Continuous Deployment

Vercel automatically deploys on `git push`:

- Main branch → Production
- Other branches → Preview deployments

---

**Your Plexo DApp is ready to deploy! 🚀**

Questions? Check README.md or open an issue.
