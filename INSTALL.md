# Installation Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Databricks account (for data pipeline)
- Google Gemini API key

### 1. Clone Repository
```bash
git clone https://github.com/your-org/inclusive-housing-navigator.git
cd inclusive-housing-navigator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

Fill in your API keys in `.env.local`:
```env
# Gemini AI API
GEMINI_API_KEY=your_gemini_api_key_here

# Databricks Configuration
DATABRICKS_HOST=your_databricks_host_here
DATABRICKS_TOKEN=your_databricks_token_here

# Database
DATABASE_URL=./data/housing.db

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔧 Detailed Setup

### API Keys Setup

#### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env.local` as `GEMINI_API_KEY`

#### Databricks Setup
1. Create a Databricks workspace
2. Generate a personal access token
3. Add to `.env.local`:
   - `DATABRICKS_HOST=your-workspace-url`
   - `DATABRICKS_TOKEN=your-access-token`

#### Mapbox (Optional)
1. Go to [Mapbox](https://www.mapbox.com/)
2. Create an account and get your access token
3. Add to `.env.local` as `NEXT_PUBLIC_MAPBOX_TOKEN`

### Data Pipeline Setup

#### 1. Upload Sample Data
```bash
# The sample data is already included in /data/sample_listings.csv
# No additional setup required for demo
```

#### 2. Run Databricks Notebook
```bash
# Upload the notebook to your Databricks workspace
# Run the notebook to process the data
# Export the results to your app
```

#### 3. Verify Data Pipeline
```bash
# Check that the API endpoints are working
curl http://localhost:3000/api/listings
```

---

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Accessibility Testing
```bash
npm run a11y:audit
```

### Manual Testing Checklist
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators are visible
- [ ] Forms are accessible
- [ ] Images have alt text
- [ ] Headings are properly structured

---

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables for Production
```env
# Production environment variables
NODE_ENV=production
GEMINI_API_KEY=your_production_gemini_key
DATABRICKS_HOST=your_production_databricks_host
DATABRICKS_TOKEN=your_production_databricks_token
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. API Key Errors
```bash
# Check if API keys are set correctly
echo $GEMINI_API_KEY
echo $DATABRICKS_HOST
echo $DATABRICKS_TOKEN
```

#### 2. Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 3. Accessibility Issues
```bash
# Run accessibility audit
npm run a11y:audit
```

#### 4. Data Pipeline Issues
```bash
# Check Databricks connection
# Verify notebook execution
# Check data export format
```

### Debug Mode
```bash
# Run with debug logging
DEBUG=* npm run dev
```

### Logs
```bash
# Check application logs
tail -f logs/app.log
```

---

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run analyze
```

### Runtime Optimization
```bash
# Enable production optimizations
NODE_ENV=production npm start
```

### Database Optimization
```bash
# Optimize database queries
# Add indexes for frequently queried fields
# Implement caching strategies
```

---

## 🔒 Security

### API Security
- Use environment variables for sensitive data
- Implement rate limiting
- Add authentication for admin endpoints
- Use HTTPS in production

### Data Security
- Encrypt sensitive data
- Implement data retention policies
- Regular security audits
- Compliance with data protection regulations

---

## 📈 Monitoring

### Application Monitoring
```bash
# Health check endpoint
curl http://localhost:3000/api/health
```

### Performance Monitoring
```bash
# Monitor response times
# Track error rates
# Monitor accessibility compliance
```

### User Analytics
```bash
# Track user interactions
# Monitor accessibility usage
# Analyze user feedback
```

---

## 🎯 Success Criteria

### Technical Success
- [ ] All API endpoints working
- [ ] D&I scoring algorithm functional
- [ ] Accessibility compliance verified
- [ ] AI features operational

### User Success
- [ ] Onboarding process smooth
- [ ] Search results relevant
- [ ] Accessibility features working
- [ ] User feedback positive

### Business Success
- [ ] Demo ready for presentation
- [ ] All prize tracks integrated
- [ ] Documentation complete
- [ ] Future roadmap defined

---

## 🚀 Next Steps

### Immediate (Next 24 hours)
1. Test all features
2. Prepare demo materials
3. Practice presentation
4. Gather feedback

### Short-term (Next week)
1. Deploy to production
2. Gather user feedback
3. Iterate on features
4. Plan next phase

### Long-term (Next month)
1. Scale to multiple universities
2. Partner with landlords
3. Advocate for policy changes
4. Build community

---

**Ready to make housing search more inclusive and accessible! 🏠♿️**
