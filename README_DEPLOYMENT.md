# Railway Deployment Guide

This guide will help you deploy the Egg Mining Admin Panel to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Create a New Project on Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo" (or your Git provider)
4. Select your repository
5. Railway will automatically detect the project

### 3. Configure Build Settings

Railway will automatically:
- Detect Node.js project
- Run `npm install` to install dependencies
- Run `npm run build` to build the project
- Run `npm run start` to serve the application

### 4. Set Environment Variables (if needed)

If you need to set environment variables:

1. Go to your project settings on Railway
2. Click on "Variables"
3. Add any required environment variables:
   - `VITE_API_URL` - Your backend API URL (if different from default)
   - `PORT` - Railway will set this automatically

### 5. Deploy

1. Railway will automatically deploy when you push to your main branch
2. Or click "Deploy" in the Railway dashboard
3. Wait for the build to complete
4. Your app will be available at the provided Railway URL

## Configuration Files

- `railway.json` - Railway-specific configuration
- `package.json` - Contains build and start scripts
- `vite.config.ts` - Vite configuration

## Build Process

1. **Install Dependencies**: `npm install`
2. **Build**: `npm run build` (creates `dist` folder)
3. **Start**: `npm run start` (uses `server.js` to serve the built files)

The `server.js` file is a simple Node.js HTTP server that:
- Serves static files from the `dist` directory
- Handles SPA routing (serves `index.html` for all routes)
- Uses the `PORT` environment variable set by Railway
- Listens on `0.0.0.0` to accept connections from Railway's network

## Troubleshooting

### Build Fails
- Check that all dependencies are listed in `package.json`
- Ensure Node.js version is compatible (>=18.0.0)
- Check build logs in Railway dashboard

### App Not Loading
- Verify the build completed successfully
- Check that the `dist` folder was created
- Review Railway logs for errors

### Port Issues
- Railway automatically sets the `PORT` environment variable
- The start script uses `$PORT` to bind to the correct port

## Custom Domain

1. Go to your project settings on Railway
2. Click on "Settings" → "Networking"
3. Add your custom domain
4. Configure DNS as instructed

## Environment Variables

If you need to change the API URL or other settings:

1. Add variables in Railway dashboard
2. Variables prefixed with `VITE_` will be available in your React app
3. Access them using `import.meta.env.VITE_API_URL`

Example:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
```

## Support

For Railway-specific issues, check:
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

