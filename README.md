# Inclusive Housing Navigator 🏠

An AI-powered housing platform designed specifically for international and rural students, featuring comprehensive D&I scoring, accessibility analysis, and inclusive design principles.

## 🎯 Project Overview

**Inclusive Housing Navigator** tackles the unique challenges international and rural students face when finding housing in new cities. Our platform combines AI-powered analysis with accessibility-first design to help students find safe, affordable, and inclusive housing options.

### Key Features

- **D&I Scoring Algorithm**: Comprehensive scoring system (0-100) based on affordability, accessibility, safety, commute, and inclusivity
- **Lease Analysis**: AI-powered lease document analysis with translation support
- **Budget Planning**: Financial planning tools with affordability analysis
- **Compliance Checking**: FHA/ADA compliance assessment and risk analysis
- **Auto Visualization**: Intelligent chart generation for data insights
- **Multilingual Support**: Translation and cultural considerations
- **Accessibility First**: WCAG 2.2 AA compliant design

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for data pipeline)
- Google Gemini API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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
   
   Add your API keys to `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_SHOW_CHARTS=1
   NEXT_PUBLIC_SHOW_INTERNATIONAL=1
   NEXT_PUBLIC_SHOW_RURAL=1
   ```

4. **Run the data pipeline**
   ```bash
   npm run pipeline
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Node.js
- **AI**: Google Gemini API for lease analysis and translation
- **Data**: Pandas, NumPy for data processing
- **Testing**: Jest, React Testing Library
- **Accessibility**: WCAG 2.2 AA compliance

### Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── autoviz/             # Warp track - Auto visualization
│   │   ├── budget/              # Capital One - Budget planning
│   │   ├── compliance/          # AMERICAN SYSTEMS - Risk assessment
│   │   ├── costar/              # CoStar - Real estate insights
│   │   ├── lease-qa/            # Gemini - Lease analysis
│   │   └── listings/            # Housing data API
│   ├── onboarding/              # User onboarding flow
│   ├── charts/                  # Data visualization
│   ├── listings/                # Housing search
│   └── lease/                   # Lease analysis
├── components/                   # React components
│   ├── accessibility/           # A11y components
│   ├── charts/                  # Visualization components
│   ├── forms/                   # Form components
│   └── ui/                      # UI components
├── lib/                         # Utility libraries
│   ├── ai/                      # AI integration
│   ├── budget/                  # Financial planning
│   ├── compliance/              # Risk assessment
│   ├── costar/                  # Real estate insights
│   └── scoring/                 # D&I scoring algorithm
├── data/                        # Sample datasets
├── tests/                       # Unit tests
└── databricks_pipeline.py       # Data processing pipeline
```

## 🧮 D&I Scoring Algorithm

Our comprehensive scoring system uses weighted factors:

```
Score = 0.35×Affordability + 0.20×Accessibility + 0.20×Safety + 0.15×Commute + 0.10×Inclusivity
```

### Scoring Components

- **Affordability (35%)**: Rent, utilities, deposits vs. user budget
- **Accessibility (20%)**: Step-free entry, elevators, doorway width, accessible facilities
- **Safety (20%)**: Distance to campus, lighting, management hours
- **Commute (15%)**: Walk time, bus frequency, proximity to amenities
- **Inclusivity (10%)**: International student support, flexible requirements

### Score Tiers

- **Gold (90-100)**: Exceptional housing with all features
- **Silver (75-89)**: Good housing with most features
- **Bronze (50-74)**: Adequate housing with some features
- **Needs Improvement (0-49)**: Limited features or concerns

## 🔧 API Endpoints

### Core APIs

- `GET /api/listings` - Get housing listings with filtering
- `POST /api/score` - Calculate D&I score for a listing
- `POST /api/lease-qa` - Analyze lease documents (Gemini)
- `POST /api/autoviz` - Generate visualizations (Warp)
- `POST /api/budget` - Financial planning (Capital One)
- `POST /api/compliance` - Risk assessment (AMERICAN SYSTEMS)
- `POST /api/costar` - Real estate insights (CoStar)

### Example Usage

```typescript
// Get filtered listings
const response = await fetch('/api/listings?max_rent=1500&accessibility=true');
const listings = await response.json();

// Analyze lease document
const analysis = await fetch('/api/lease-qa', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lease_text: 'Lease document text...',
    target_language: 'es'
  })
});
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run accessibility audit
npm run a11y:audit
```

### Test Coverage

- D&I scoring algorithm (100% coverage)
- API endpoints
- React components
- Accessibility compliance

## 📊 Data Pipeline

### Bronze → Silver → Gold Processing

1. **Bronze Layer**: Raw data ingestion from CSV
2. **Silver Layer**: Data cleaning and transformation
3. **Gold Layer**: D&I scoring and insights generation

### Running the Pipeline

```bash
# Run full Databricks-style pipeline
npm run pipeline

# Run local pipeline (fallback)
npm run pipeline:local
```

### Output Formats

- `output/gold_housing_data.json` - API consumption
- `output/gold_housing_data.csv` - Human inspection
- `output/housing_di_scores.parquet` - Efficient storage
- `output/pipeline_summary.json` - Statistics

## 🎨 Prize Track Integrations

### Deloitte | Databricks - AI Agent
- Comprehensive D&I scoring algorithm
- Bronze→Silver→Gold data pipeline
- AI-powered lease analysis

### MLH Gemini API
- Lease document analysis and translation
- Multilingual support
- Cultural considerations

### Peraton UX/UI
- Accessibility-first design (WCAG 2.2 AA)
- Inclusive user experience
- Responsive design

### Best Accessibility
- Full keyboard navigation
- Screen reader support
- High contrast modes
- Dyslexia-friendly fonts

### Capital One Financial Hack
- Budget planning and analysis
- Affordability calculations
- Financial risk assessment

### Warp Auto Visualization
- Intelligent chart generation
- Data-driven insights
- Interactive visualizations

### CoStar Real Estate
- Market analysis and insights
- Comparable properties
- Investment metrics

### AMERICAN SYSTEMS Compliance/Risk
- FHA/ADA compliance checking
- Risk assessment and mitigation
- Legal considerations

## 🌍 Accessibility Features

- **WCAG 2.2 AA Compliance**: Full accessibility standards
- **Keyboard Navigation**: Complete keyboard-only operation
- **Screen Reader Support**: ARIA labels and live regions
- **High Contrast**: Multiple contrast modes
- **Font Options**: Dyslexia-friendly font toggle
- **Focus Management**: Clear focus indicators
- **Skip Links**: Quick navigation to main content

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Docker

```bash
# Build Docker image
docker build -t inclusive-housing-navigator .

# Run container
docker run -p 3000:3000 inclusive-housing-navigator
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 VTHacks 2025

Built for VTHacks 2025 with focus on:
- **Technical Complexity**: Advanced AI integration and scoring algorithms
- **Originality**: Unique D&I scoring system for student housing
- **Ut Prosim**: Direct impact on student housing accessibility
- **Accessibility**: WCAG 2.2 AA compliant design
- **Presentation**: Professional, polished interface
- **DEI**: Core mission of inclusive housing for all students

## 📞 Support

For questions or support, please open an issue or contact the development team.

---

**Built with ❤️ for inclusive housing access**