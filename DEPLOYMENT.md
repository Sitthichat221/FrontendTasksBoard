# TaskBoard Frontend - Cloud Render Deployment Guide

## Prerequisites
- GitHub repository with your frontend code
- Cloud Render account
- Backend API deployed and accessible

## Deployment Steps

### 1. Prepare Your Repository
Make sure your repository contains:
- `Dockerfile` (already configured)
- `nginx.conf` (already configured)
- `render.yaml` (already configured)
- `env.example` (template for environment variables)

### 2. Deploy to Cloud Render

#### Option A: Using render.yaml (Recommended)
1. Connect your GitHub repository to Cloud Render
2. Cloud Render will automatically detect the `render.yaml` file
3. The service will be created automatically

#### Option B: Manual Setup
1. Create a new Web Service in Cloud Render
2. Connect your GitHub repository
3. Set the following environment variables:

**Required Environment Variables:**
```
VITE_API_URL=https://your-backend-url.onrender.com
NODE_ENV=production
```

### 3. Environment Variables Configuration

#### Frontend Variables (Set manually)
- `VITE_API_URL`: URL ของ backend API (เช่น https://your-backend-url.onrender.com)
- `NODE_ENV`: ตั้งเป็น `production`

### 4. Build Process
The deployment process:
1. **Build Stage**: Node.js builds the React application
2. **Production Stage**: Nginx serves the built files
3. **Static Files**: Served with proper caching headers

### 5. Nginx Configuration
- **Client-side routing**: All routes redirect to `index.html`
- **Static assets**: Cached for 1 year
- **Security headers**: XSS protection, frame options
- **Gzip compression**: Enabled for better performance

### 6. Health Check
- Health check endpoint: `/`
- Nginx serves the React application
- Automatic restart on failure

## Troubleshooting

### Common Issues:
1. **Build Failed**: Check Node.js version and dependencies
2. **API Connection Failed**: Verify `VITE_API_URL` is correct
3. **Routing Issues**: Ensure nginx configuration is correct
4. **Static Assets Not Loading**: Check nginx static file serving

### Logs:
- View build logs in Cloud Render dashboard
- Check nginx access/error logs
- Monitor application performance

## Production Checklist
- [ ] Backend API deployed and accessible
- [ ] Environment variables configured
- [ ] Frontend build successful
- [ ] Nginx serving static files
- [ ] Client-side routing working
- [ ] API calls successful
- [ ] Security headers enabled

## Performance Optimization
- **Static assets**: Cached for 1 year
- **Gzip compression**: Reduces file sizes
- **Nginx**: High-performance web server
- **Docker**: Optimized container image

## Security Features
- **XSS Protection**: Enabled
- **Frame Options**: SAMEORIGIN
- **Content Type**: nosniff
- **HTTPS**: Automatic SSL certificate
