# My Apps

## Deployment

### Backend (Vercel)
1. Push folder backend to GitHub.
2. Import repository to Vercel.
3. Set root directory to backend.
4. Add environment variables:
   - PORT=3000
   - NODE_ENV=production
   - TOKEN_SECRET=your-secret
   - MONGODB_URI=your-mongodb-uri
   - EMAIL_USER=your-email
   - EMAIL_PASS=your-email-password
5. Deploy.

### Frontend (GitHub Pages)
1. Push folder frontend/react to GitHub.
2. Enable GitHub Pages from the repository settings.
3. Choose Deploy from branch: gh-pages.
4. Run the build and publish the dist folder.

### Local development
- Backend: npm start inside backend
- Frontend: npm run dev inside frontend/react
