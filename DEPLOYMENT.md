# Deployment Guide for Render

This guide explains how to deploy the Digital Campus Demo to Render.

## Render Configuration

The project includes a `render.yaml` file that configures the deployment:

```yaml
services:
  - type: web
    name: digital-campus-demo
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

## Deployment Steps

### 1. Connect to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository: `yorhagengyue/CamousDemo2`

### 2. Configure Build Settings

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18.x (or latest)

### 3. Environment Variables

Set the following environment variables in Render:

```
NODE_ENV=production
VITE_APP_TITLE=Digital Campus Demo
VITE_API_BASE_URL=/api
```

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Alternative: Manual Deployment

If you prefer to deploy manually:

1. **Build the project locally**:
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to any static hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront

## Important Notes

### MSW (Mock Service Worker)

The application uses MSW for API mocking in both development and production. This is intentional for the demo:

- **Development**: MSW intercepts API calls
- **Production**: MSW continues to work for demo purposes
- **Real Production**: Replace MSW with actual API endpoints

### Static Site Configuration

The application is a Single Page Application (SPA) that requires:

- **History API**: All routes should fallback to `index.html`
- **Base Path**: Configure if deploying to a subdirectory

### Performance Optimizations

The build includes:

- **Code Splitting**: Vendor chunks separated
- **Asset Optimization**: Images and CSS optimized
- **Bundle Analysis**: Use `npm run build` to see bundle sizes

## Troubleshooting

### Common Issues

1. **Build Fails**: Check Node.js version (18+ required)
2. **Routes Not Working**: Ensure SPA routing is configured
3. **MSW Not Working**: Check that `mockServiceWorker.js` is in the public folder

### Debug Commands

```bash
# Test build locally
npm run build
npm run preview

# Check bundle size
npm run build -- --analyze
```

## Production Considerations

For a real production deployment:

1. **Replace MSW**: Implement actual API endpoints
2. **Add Authentication**: Integrate with real auth providers
3. **Database**: Connect to a real database
4. **Security**: Add proper security headers
5. **Monitoring**: Add error tracking and analytics

## Support

If you encounter issues:

1. Check the [Render Documentation](https://render.com/docs)
2. Review the build logs in Render dashboard
3. Test the build locally with `npm run build`

