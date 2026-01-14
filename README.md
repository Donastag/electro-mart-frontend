# ElectroMart Frontend

The frontend store application for ElectroMart - an independent deployment that connects to the Payload CMS backend.

## 🚀 Features

- 🛍️ E-commerce storefront
- 🔍 Product search and filtering
- 🛒 Shopping cart functionality
- 👤 User authentication
- 📱 Responsive design
- ⚡ Fast loading with Next.js

## 🏗️ Architecture

This is an **independent service** that:
- ✅ Auto-deploys independently of admin
- ✅ Connects to live Payload CMS
- ✅ Scales independently
- ✅ Has isolated failure domains

## 🚀 Environments

### Development
- **Local**: `npm run dev`
- **URL**: `http://localhost:3000`
- **Payload**: `https://elecromart-v3.vercel.app/api`

### Staging (Preview Deployments)
- **Auto-created** for each PR
- **URL**: `https://electro-mart-frontend-{branch}.vercel-preview.app`
- **Testing**: Feature testing before production

### Production
- **URL**: `https://electro-mart-store.vercel.app` (configure in Vercel)
- **Auto-deploy**: On push to `main` branch
- **Rollback**: Instant rollback in Vercel dashboard

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/electro-mart-frontend.git
   cd electro-mart-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your values
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open** `http://localhost:3000`

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PAYLOAD_API_URL` | Payload CMS API URL | `https://elecromart-v3.vercel.app/api` |
| `NEXT_PUBLIC_PAYLOAD_API_URL` | Public Payload API URL | `https://elecromart-v3.vercel.app/api` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |

## 🚀 Deployment

### Vercel Auto-Deployment

1. **Connect to Vercel**
   - Import project from GitHub
   - Vercel detects Next.js automatically

2. **Configure Environment Variables**
   - Set production values in Vercel dashboard
   - Use `.env.production` as reference

3. **Custom Domain (Optional)**
   - Add custom domain in Vercel
   - Configure DNS records

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔄 Development Workflow

### Making Changes

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-product-page
   ```

2. **Make changes and test locally**

3. **Commit and push**
   ```bash
   git add .
   git commit -m "Add new product page"
   git push origin feature/new-product-page
   ```

4. **Create Pull Request**
   - Vercel creates preview deployment automatically
   - Test on preview URL

5. **Merge to main**
   - Triggers production deployment
   - Available at production URL within minutes

### Independent Deployment Benefits

- ✅ **Frontend changes** don't affect admin operations
- ✅ **Admin changes** don't break customer experience
- ✅ **Staging testing** without production impact
- ✅ **Instant rollback** if issues arise

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Configure Sentry or similar
- **Uptime Monitoring**: Set up external monitoring

## 🆘 Troubleshooting

### Common Issues

**Connection to Payload CMS fails**
- Check `PAYLOAD_API_URL` environment variable
- Verify Payload CMS is accessible
- Check CORS settings

**Build fails**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

**Preview deployments not working**
- Check Vercel project settings
- Verify GitHub integration
- Check build logs in Vercel dashboard

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.
