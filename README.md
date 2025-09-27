# Inclusive Housing Navigator

> AI-powered housing copilot for international & rural students with D&I scoring

[![VTHacks 2024](https://img.shields.io/badge/VTHacks-2024-blue)](https://vthacks.com)
[![Built for Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-green)](https://www.w3.org/WAI/WCAG22/quickref/)
[![Deloitte AI Agent](https://img.shields.io/badge/Deloitte-AI%20Agent-orange)](https://www.deloitte.com)
[![Databricks ML](https://img.shields.io/badge/Databricks-ML-purple)](https://www.databricks.com)

## 🎯 Project Overview

Inclusive Housing Navigator is an AI-powered housing copilot designed specifically for international and rural students. It provides comprehensive D&I (Diversity & Inclusion) scoring, accessibility analysis, lease QA, and budget planning to help students find housing that meets their unique needs.

### Key Features

- **D&I Scoring Algorithm**: Weighted scoring system (35% Affordability, 20% Accessibility, 20% Safety, 15% Commute, 10% Inclusivity)
- **Accessibility Analysis**: WCAG 2.2 AA compliant with full keyboard navigation and screen reader support
- **AI-Powered Lease QA**: Gemini AI integration for lease analysis, translation, and red flag detection
- **Auto-Visualization**: Warp track integration for intelligent chart generation
- **Compliance & Risk Assessment**: AMERICAN SYSTEMS track for FHA/ADA compliance checking
- **Budget Planning**: Capital One track for comprehensive financial analysis
- **CoStar Integration**: Real estate market insights and investment analysis

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for accessible components
- **React Aria** for accessibility patterns
- **Recharts** for data visualization
- **Leaflet/Mapbox** for mapping

### Backend
- **Next.js API Routes** (Node.js/TypeScript)
- **Google Gemini API** for AI features
- **Databricks** for data processing pipeline

### Data & Analytics
- **Databricks Notebooks** for ETL pipeline
- **Delta Tables** for data storage
- **Parquet/JSON** for data export

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Databricks account (for data pipeline)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/inclusive-housing-navigator.git
   cd inclusive-housing-navigator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABRICKS_HOST=your_databricks_host_here
   DATABRICKS_TOKEN=your_databricks_token_here
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 D&I Scoring Algorithm

Our proprietary D&I scoring algorithm evaluates housing listings across five key dimensions:

### Scoring Formula
```
D&I Score = 0.35 × Affordability + 0.20 × Accessibility + 0.20 × Safety + 0.15 × Commute + 0.10 × Inclusivity
```

### Score Components

1. **Affordability (35%)**
   - Rent + utilities + prorated deposits
   - Normalized against user budget
   - Higher score = more affordable

2. **Accessibility (20%)**
   - Step-free entry, elevator access
   - Doorway width (ADA compliance)
   - Accessible bathroom and parking
   - Binary features scaled to 0-100

3. **Safety (20%)**
   - Distance to campus
   - Street lighting
   - Management hours
   - Neighborhood safety score

4. **Commute (15%)**
   - Walk time and bus frequency
   - Distance penalties
   - Winter condition adjustments

5. **Inclusivity (10%)**
   - International student acceptance
   - SSN requirements
   - Cosigner policies
   - Anti-discrimination policies

## 🎨 Accessibility Features

### WCAG 2.2 AA Compliance
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Reader Support**: ARIA labels, live regions, and semantic HTML
- **Color Contrast**: Meets WCAG AA standards
- **Dyslexia Support**: OpenDyslexic font option
- **Reduced Motion**: Respects user preferences

### Accessibility Components
- Skip links for main content and navigation
- Focus trap for modals and forms
- ARIA live regions for dynamic content
- High contrast mode support
- Screen reader only content

## 🔧 API Endpoints

### Core Endpoints

- `GET /api/listings` - Fetch housing listings with filters
- `POST /api/score` - Calculate D&I score for a listing
- `POST /api/lease-qa` - Analyze lease documents with AI
- `POST /api/autoviz` - Generate auto-visualizations

### Track-Specific Endpoints

- `POST /api/compliance` - AMERICAN SYSTEMS compliance check
- `POST /api/budget` - Capital One budget analysis
- `POST /api/costar` - CoStar real estate insights

## 📈 Data Pipeline

### Bronze → Silver → Gold Architecture

1. **Bronze Layer**: Raw CSV data ingestion
2. **Silver Layer**: Data cleaning and type conversion
3. **Gold Layer**: D&I score calculation and enrichment

### Databricks Notebook
The `dbx/notebook.py` implements the complete ETL pipeline:
- Data ingestion from CSV
- Data cleaning and validation
- D&I score calculation
- Export to JSON/Parquet for app consumption

## 🏆 VTHacks Judging Criteria

### Technical Complexity
- **AI Integration**: Gemini API for lease analysis and translation
- **Data Pipeline**: Databricks bronze→silver→gold architecture
- **Scoring Algorithm**: Sophisticated weighted D&I scoring
- **Accessibility**: WCAG 2.2 AA compliance with custom components

### Originality
- **D&I Scoring**: Novel approach to housing evaluation
- **Multi-track Integration**: Combines multiple prize tracks
- **Accessibility-First**: Built with inclusion as core principle
- **AI-Powered**: Intelligent lease analysis and visualization

### Ut Prosim (Impact)
- **Student Focus**: Specifically designed for international and rural students
- **Accessibility**: Removes barriers for students with disabilities
- **Financial Planning**: Helps students make informed housing decisions
- **Compliance**: Ensures fair housing practices

### Accessibility
- **WCAG 2.2 AA**: Full compliance with accessibility standards
- **Keyboard Navigation**: Complete keyboard support
- **Screen Reader**: Full screen reader compatibility
- **Dyslexia Support**: Specialized font options

### DEI (Diversity, Equity, Inclusion)
- **D&I Scoring**: Core feature evaluates inclusion metrics
- **International Students**: Specialized features for international students
- **Accessibility**: Ensures housing is accessible to all
- **Fair Housing**: Compliance checking for discrimination prevention

## 🎯 Prize Track Integration

### Deloitte AI Agent Track
- **Gemini AI Integration**: Advanced AI for lease analysis
- **Intelligent Scoring**: AI-powered D&I evaluation
- **Natural Language Processing**: Lease document analysis

### Databricks ML Track
- **Data Pipeline**: Bronze→Silver→Gold architecture
- **Delta Tables**: Efficient data storage and processing
- **ML Scoring**: Machine learning-based D&I scoring

### MLH Gemini API Track
- **Gemini Integration**: Advanced AI capabilities
- **Lease Analysis**: Intelligent document processing
- **Translation**: Multi-language support

### Peraton UX/UI Track
- **Accessibility-First Design**: WCAG 2.2 AA compliance
- **User-Centered Design**: Focus on student needs
- **Inclusive Interface**: Designed for all users

### Best Accessibility Track
- **WCAG 2.2 AA**: Full compliance
- **Custom Components**: Accessibility-first design
- **Testing**: Comprehensive accessibility testing

### Capital One Financial Hack Track
- **Budget Planning**: Comprehensive financial analysis
- **Cost Breakdown**: Detailed expense analysis
- **What-if Scenarios**: Financial modeling

### Warp Auto Visualization Track
- **Auto-Visualization**: Intelligent chart generation
- **Data Analysis**: Automated insights
- **Chart Recommendations**: AI-powered visualization

### CoStar Real Estate Track
- **Market Analysis**: Real estate insights
- **Investment Metrics**: ROI and yield analysis
- **Neighborhood Analysis**: Location evaluation

### AMERICAN SYSTEMS Compliance/Risk Track
- **FHA Compliance**: Fair Housing Act checking
- **ADA Compliance**: Americans with Disabilities Act
- **Risk Assessment**: Compliance risk evaluation

### GoDaddy Domain Track
- **Professional Domain**: Custom domain setup
- **Brand Identity**: Professional presentation

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

## 📱 Demo Script (5 Minutes)

### 1. Introduction (30 seconds)
"Welcome to Inclusive Housing Navigator, an AI-powered housing copilot for international and rural students. We're solving the challenge of finding accessible, affordable, and inclusive housing."

### 2. Onboarding (1 minute)
- Show user preference setup
- Highlight accessibility options
- Demonstrate international student features

### 3. D&I Scoring (1.5 minutes)
- Show scoring algorithm in action
- Explain weighted scoring system
- Demonstrate score breakdown

### 4. AI Features (1.5 minutes)
- Lease QA analysis
- Auto-visualization
- Budget planning
- Compliance checking

### 5. Accessibility Demo (1 minute)
- Keyboard navigation
- Screen reader support
- High contrast mode
- Dyslexia-friendly fonts

### 6. Impact & Conclusion (30 seconds)
- Student success stories
- Accessibility impact
- Future roadmap

## 🚀 Deployment

### Production Deployment
```bash
npm run build
npm start
```

### Environment Variables
Ensure all required environment variables are set:
- `GEMINI_API_KEY`
- `DATABRICKS_HOST`
- `DATABRICKS_TOKEN`
- `NEXT_PUBLIC_MAPBOX_TOKEN`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure accessibility compliance
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **VTHacks 2024** for the hackathon platform
- **Deloitte** for AI Agent track sponsorship
- **Databricks** for ML track sponsorship
- **Capital One** for Financial Hack track
- **AMERICAN SYSTEMS** for Compliance/Risk track
- **CoStar** for Real Estate track
- **Warp** for Auto Visualization track
- **GoDaddy** for Domain track

## 📞 Contact

- **Team**: VTHacks 2024
- **Email**: team@inclusivehousingnavigator.com
- **GitHub**: [@inclusive-housing-navigator](https://github.com/inclusive-housing-navigator)
- **Devpost**: [VTHacks 2024 Submission](https://devpost.com/inclusive-housing-navigator)

---

**Built with ❤️ for accessibility and inclusion**
