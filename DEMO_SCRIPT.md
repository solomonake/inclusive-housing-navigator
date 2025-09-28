# Inclusive Housing Navigator - Demo Script 🏠

## 🎯 Demo Overview (5 minutes)

This demo showcases the **Inclusive Housing Navigator**, an AI-powered platform designed specifically for international and rural students to find safe, affordable, and accessible housing.

## 🚀 Quick Start Demo

### 1. **Start the Application** (30 seconds)
```bash
npm run dev
```
- Open `http://localhost:3000`
- Show the clean, Airbnb-inspired interface
- Highlight the accessibility-first design

### 2. **User Onboarding Flow** (1 minute)
- Click "Get Started" or navigate to `/onboarding`
- Walk through the 5-step onboarding:
  - **Budget & Preferences**: Set $2000 budget, 2 bedrooms
  - **Accessibility Needs**: Select step-free entry, elevator access
  - **Commute Preferences**: Set 15-minute walk, 20-minute bus
  - **Cultural Needs**: Mark as international student, select Spanish
  - **Location & Safety**: Set 1km from campus, high safety priority

### 3. **Housing Search & Filtering** (1.5 minutes)
- Navigate to `/listings`
- Show the comprehensive filtering system:
  - **Quick Filters**: "Under $1000", "Accessible", "International Friendly"
  - **Advanced Filters**: Price range sliders, bedroom count, feature checkboxes
- Demonstrate real-time filtering results
- Show the D&I score badges on each listing

### 4. **D&I Scoring Deep Dive** (1 minute)
- Click on a high-scoring listing
- Show the detailed score breakdown:
  - **Affordability (35%)**: Rent vs. budget analysis
  - **Accessibility (20%)**: Step-free entry, elevator, doorway width
  - **Safety (20%)**: Distance to campus, lighting, management hours
  - **Commute (15%)**: Walk time, bus frequency
  - **Inclusivity (10%)**: International student support, flexible requirements
- Explain the weighted scoring algorithm

### 5. **AI-Powered Features** (1 minute)
- Navigate to `/lease` for lease analysis
- Upload a sample lease document (or use mock data)
- Show Gemini-powered analysis:
  - **Summary**: Key terms and conditions
  - **Red Flags**: Concerning clauses
  - **Translation**: Spanish translation of key terms
  - **Accessibility Notes**: ADA compliance check
  - **International Student Notes**: SSN requirements, co-signer policies

## 🏆 Prize Track Demonstrations

### **Deloitte | Databricks - AI Agent**
- Show the data pipeline: `npm run pipeline`
- Explain Bronze → Silver → Gold processing
- Display the D&I scoring algorithm in action

### **MLH Gemini API**
- Demonstrate lease analysis with translation
- Show multilingual support in onboarding
- Highlight cultural considerations

### **Peraton UX/UI**
- Walk through accessibility features:
  - Keyboard navigation (Tab through interface)
  - Screen reader support (ARIA labels)
  - High contrast mode
  - Skip links

### **Best Accessibility**
- Show WCAG 2.2 AA compliance
- Demonstrate focus management
- Highlight inclusive design principles

### **Capital One Financial Hack**
- Navigate to budget analysis
- Show affordability calculations
- Demonstrate "what-if" scenarios
- Display financial risk assessment

### **Warp Auto Visualization**
- Navigate to `/charts`
- Show auto-generated visualizations
- Explain chart recommendations
- Demonstrate data insights

### **CoStar Real Estate**
- Show market analysis API
- Display comparable properties
- Highlight investment metrics
- Explain demand indicators

### **AMERICAN SYSTEMS Compliance/Risk**
- Show compliance checking API
- Display FHA/ADA violation detection
- Highlight risk mitigation strategies
- Explain legal considerations

## 🎨 Key Features to Highlight

### **Technical Complexity**
- Advanced D&I scoring algorithm with weighted factors
- AI-powered lease analysis with Gemini
- Comprehensive data pipeline (Bronze→Silver→Gold)
- Real-time filtering and search

### **Originality**
- Unique D&I scoring system for student housing
- Accessibility-first design approach
- Cultural considerations for international students
- AI-powered lease translation and analysis

### **Ut Prosim (Impact)**
- Directly addresses housing challenges for international students
- Promotes accessibility and inclusion
- Reduces housing discrimination
- Supports student success and well-being

### **Accessibility**
- WCAG 2.2 AA compliant design
- Full keyboard navigation
- Screen reader support
- High contrast modes
- Dyslexia-friendly fonts

### **Presentation Polish**
- Clean, modern Airbnb-inspired interface
- Responsive design
- Professional data visualizations
- Intuitive user experience

### **DEI (Diversity, Equity, Inclusion)**
- Core mission of inclusive housing
- International student support
- Accessibility considerations
- Cultural sensitivity
- Anti-discrimination features

## 🔧 Technical Demo Points

### **Data Pipeline**
```bash
# Show the data processing
npm run pipeline
# Explain Bronze → Silver → Gold transformation
# Show D&I score calculations
```

### **API Endpoints**
- `GET /api/listings` - Housing data with filtering
- `POST /api/lease-qa` - AI lease analysis
- `POST /api/autoviz` - Auto visualization
- `POST /api/budget` - Financial planning
- `POST /api/compliance` - Risk assessment
- `POST /api/costar` - Real estate insights

### **Testing**
```bash
# Show comprehensive test suite
npm test
# Demonstrate 100% test coverage for scoring algorithm
```

## 🎯 Demo Conclusion

**"Inclusive Housing Navigator represents a comprehensive solution to the housing challenges faced by international and rural students. By combining AI-powered analysis with accessibility-first design, we're not just building a housing platform—we're creating a more inclusive future for student housing."**

### **Key Takeaways:**
1. **Technical Excellence**: Advanced AI integration and scoring algorithms
2. **Social Impact**: Directly addresses student housing inequities
3. **Accessibility**: WCAG 2.2 AA compliant design
4. **Innovation**: Unique D&I scoring system
5. **Completeness**: Full-stack solution with comprehensive features

---

**Built with ❤️ for inclusive housing access at VTHacks 2025**