import { GoogleGenerativeAI } from '@google/generative-ai';
import { LeaseQA } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  /**
   * Analyze lease document for key information and red flags
   */
  async analyzeLease(leaseText: string, language: string = 'en'): Promise<LeaseQA> {
    const prompt = `
Analyze this lease document and provide a comprehensive summary. Focus on:

1. Key terms and conditions
2. Red flags or concerning clauses
3. Hidden fees or unexpected costs
4. Accessibility and discrimination policies
5. International student accommodations
6. Compliance with fair housing laws

Lease Document:
${leaseText}

Please provide:
- A clear summary of the lease terms
- List of red flags or concerning clauses
- Key terms that tenants should understand
- Recommendations for the tenant
- Compliance notes regarding fair housing laws

Format your response as JSON with the following structure:
{
  "summary": "Brief summary of the lease",
  "red_flags": ["List of concerning clauses"],
  "key_terms": ["Important terms to understand"],
  "recommendations": ["Recommendations for the tenant"],
  "compliance_notes": ["Fair housing compliance notes"]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response
      try {
        const parsed = JSON.parse(text);
        return {
          summary: parsed.summary || 'Unable to analyze lease',
          red_flags: parsed.red_flags || [],
          translation: await this.translateText(parsed.summary, language),
          key_terms: parsed.key_terms || [],
          recommendations: parsed.recommendations || [],
          compliance_notes: parsed.compliance_notes || []
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          summary: text,
          red_flags: ['Unable to parse lease analysis'],
          translation: await this.translateText(text, language),
          key_terms: [],
          recommendations: ['Please review the lease carefully'],
          compliance_notes: []
        };
      }
    } catch (error) {
      console.error('Error analyzing lease:', error);
      return {
        summary: 'Error analyzing lease document',
        red_flags: ['Analysis failed'],
        translation: 'Error analyzing lease document',
        key_terms: [],
        recommendations: ['Please try again or contact support'],
        compliance_notes: []
      };
    }
  }

  /**
   * Translate text to target language
   */
  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (targetLanguage === 'en') {
      return text;
    }

    const prompt = `
Translate the following text to ${targetLanguage}. Maintain the original meaning and tone:

${text}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error translating text:', error);
      return text; // Return original text if translation fails
    }
  }

  /**
   * Extract key information from housing listing
   */
  async extractListingInfo(listingText: string): Promise<any> {
    const prompt = `
Extract key information from this housing listing:

${listingText}

Please extract and return as JSON:
{
  "rent": number,
  "utilities": number,
  "deposits": number,
  "bedrooms": number,
  "bathrooms": number,
  "sqft": number,
  "amenities": ["list of amenities"],
  "accessibility_features": ["list of accessibility features"],
  "pet_policy": "pet policy description",
  "smoking_policy": "smoking policy description",
  "lease_terms": "lease terms description",
  "contact_info": "contact information"
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return {
          rent: 0,
          utilities: 0,
          deposits: 0,
          bedrooms: 1,
          bathrooms: 1,
          sqft: 500,
          amenities: [],
          accessibility_features: [],
          pet_policy: 'Not specified',
          smoking_policy: 'Not specified',
          lease_terms: 'Not specified',
          contact_info: 'Not specified'
        };
      }
    } catch (error) {
      console.error('Error extracting listing info:', error);
      return null;
    }
  }

  /**
   * Generate accessibility recommendations
   */
  async generateAccessibilityRecommendations(listing: any, userNeeds: string[]): Promise<string[]> {
    const prompt = `
Based on this housing listing and user accessibility needs, provide specific recommendations:

Listing: ${JSON.stringify(listing, null, 2)}
User Needs: ${userNeeds.join(', ')}

Provide 3-5 specific, actionable recommendations for improving accessibility or finding suitable housing.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Split by lines and clean up
      return text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.match(/^\d+\.$/))
        .slice(0, 5);
    } catch (error) {
      console.error('Error generating accessibility recommendations:', error);
      return ['Please consult with accessibility experts for personalized recommendations'];
    }
  }

  /**
   * Generate budget analysis and recommendations
   */
  async generateBudgetAnalysis(rent: number, utilities: number, deposits: number, userBudget: number): Promise<any> {
    const prompt = `
Analyze this housing budget situation:

Monthly Rent: $${rent}
Monthly Utilities: $${utilities}
Total Deposits: $${deposits}
User Budget: $${userBudget}

Provide analysis including:
1. Total monthly cost
2. Affordability ratio
3. Budget recommendations
4. Cost-saving tips
5. What-if scenarios

Format as JSON with keys: total_cost, affordability_ratio, recommendations, cost_saving_tips, what_if_scenarios
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        const totalCost = rent + utilities + (deposits / 12);
        const ratio = totalCost / userBudget;
        
        return {
          total_cost: totalCost,
          affordability_ratio: ratio,
          recommendations: [
            ratio > 0.3 ? 'Consider finding more affordable housing' : 'This housing fits your budget well',
            'Set aside 3-6 months of rent as emergency fund',
            'Factor in additional costs like internet, groceries, and transportation'
          ],
          cost_saving_tips: [
            'Look for utilities-included options',
            'Consider roommates to split costs',
            'Negotiate deposit amounts if possible'
          ],
          what_if_scenarios: [
            {
              scenario: 'Utilities increase by 20%',
              impact: 'Monthly cost would increase by $' + (utilities * 0.2).toFixed(2)
            },
            {
              scenario: 'Rent increases by 5% next year',
              impact: 'Monthly cost would increase by $' + (rent * 0.05).toFixed(2)
            }
          ]
        };
      }
    } catch (error) {
      console.error('Error generating budget analysis:', error);
      return {
        total_cost: rent + utilities + (deposits / 12),
        affordability_ratio: (rent + utilities + (deposits / 12)) / userBudget,
        recommendations: ['Please review your budget carefully'],
        cost_saving_tips: ['Consider all housing costs'],
        what_if_scenarios: []
      };
    }
  }
}
