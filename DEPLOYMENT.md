# Fleet Flows Deployment Guide

## 🚀 Complete Deployment Strategy

This guide covers deploying the entire Fleet Flows platform including frontend, backend, database, and mobile app.

**Self-hosted VPS (Hostinger):** use [VPS-DEPLOYMENT.md](VPS-DEPLOYMENT.md) and run `npx prisma migrate deploy` on the server after each deploy (see [docs/PRD.md](docs/PRD.md) for environment variables).

## 📋 Prerequisites

- Node.js 18+ installed
- Vercel account (for web deployment)
- PostgreSQL database (Neon, Supabase, or AWS RDS)
- Expo account (for mobile deployment)
- Google Cloud Console account (for Maps API)
- Domain name (optional, for custom branding)

## 🗄️ Step 1: Database Setup

### Option A: Neon (Recommended - Easiest)
```bash
# 1. Sign up at https://neon.tech
# 2. Create new project
# 3. Copy connection string
```

### Option B: Supabase
```bash
# 1. Sign up at https://supabase.com
# 2. Create new project
# 3. Go to Settings > Database
# 4. Copy connection string
```

### Option C: AWS RDS
```bash
# 1. Create PostgreSQL instance
# 2. Configure security groups
# 3. Get connection string
```

## 🔧 Step 2: Environment Configuration

Create production environment variables:

### Database Configuration
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"

# Google Maps (for live tracking)
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Optional: Monitoring
SENTRY_DSN="your-sentry-dsn"
```

### Generate NextAuth Secret
```bash
openssl rand -base64 32
```

## 🌐 Step 3: Deploy Backend & Frontend (Vercel)

### Install Vercel CLI
```bash
npm i -g vercel
```

### Deploy to Vercel
```bash
# From project root
vercel --prod

# Follow prompts:
# - Link to existing project or create new
# - Add environment variables when asked
# - Confirm deployment settings
```

### Vercel Environment Variables
Add these in Vercel dashboard:
1. Go to your project > Settings > Environment Variables
2. Add all variables from Step 2

## 🗄️ Step 4: Database Migrations

### Run Migrations on Production
```bash
# Install Prisma CLI globally
npm i -g prisma

# Generate Prisma Client
npx prisma generate

# Push schema to production database
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate deploy
```

### Seed Initial Data (Optional)
```bash
# Create a seed script if needed
npx prisma db seed
```

## 📱 Step 5: Mobile App Deployment

### Update API Endpoint
In `mobile/app/constants.js`:
```javascript
export const API_BASE_URL = 'https://your-domain.vercel.app/api';
```

### Build for App Stores

#### iOS App Store
```bash
cd mobile
npm install
expo build:ios
```

#### Android Play Store
```bash
cd mobile
npm install
expo build:android
```

### Alternative: Expo Go (Testing)
```bash
cd mobile
expo start
# Scan QR code with Expo Go app
```

## 🔍 Step 6: Verification & Testing

### Test Web Application
1. Visit your Vercel URL
2. Test login functionality
3. Verify database connectivity
4. Check all dashboard features

### Test Mobile App
1. Install on test devices
2. Test driver/employee login
3. Verify API connectivity
4. Test core features

## 📊 Step 7: Monitoring Setup (Optional)

### Sentry for Error Tracking
```bash
npm install @sentry/nextjs
```

### Vercel Analytics
Enable in Vercel dashboard > Analytics

## 🌐 Step 8: Custom Domain (Optional)

### Configure Domain
1. In Vercel dashboard > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate

### Update Environment
```env
NEXTAUTH_URL="https://your-custom-domain.com"
```

## 🔒 Security Considerations

1. **Database Security**: Use SSL connections
2. **API Security**: Implement rate limiting
3. **Authentication**: Secure NextAuth configuration
4. **Environment Variables**: Never commit to git

## 📈 Scaling Considerations

### Database Scaling
- Monitor connection limits
- Consider read replicas for high traffic
- Implement connection pooling

### App Scaling
- Vercel automatically scales
- Monitor edge function performance
- Consider CDN for static assets

## 🚨 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Test connection
psql $DATABASE_URL
```

#### Build Failures
```bash
# Clear build cache
rm -rf .next
vercel --prod
```

#### Environment Variables
```bash
# Verify variables are set
vercel env ls
```

## 📞 Support

- Vercel: https://vercel.com/support
- Neon: https://neon.tech/support
- Expo: https://docs.expo.dev/support/
- Prisma: https://www.prisma.io/support

## 🎯 Post-Deployment Checklist

- [ ] Web app accessible at domain
- [ ] Database connected and working
- [ ] Authentication functional
- [ ] Mobile app can connect to API
- [ ] SSL certificate active
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Performance baseline established

---

**Next Steps**: After deployment, consider implementing CI/CD pipelines, advanced monitoring, and automated backups for production reliability.
