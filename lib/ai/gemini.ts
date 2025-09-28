import { GoogleGenerativeAI } from '@google/generative-ai';

export type LeaseQA = {
  keyTerms: string[];
  requiredPayments: { oneTime: string[]; recurring: string[] };
  junkFees: string[];
  riskNotes: string[];
  tenantQuestions: string[];
  plainSummary: string;
  translation?: string;
  model: string;
};

// Initialize Gemini AI with fallback for missing API key
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not found, using mock responses');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function summarizeLeaseText(text: string, lang: string = 'en'): Promise<LeaseQA> {
  const genAI = getGeminiClient();
  
  if (!genAI) {
    return getMockLeaseQA(text, lang);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const systemPrompt = `
You are an expert housing lawyer and accessibility consultant. Analyze this lease document and extract the following information in EXACT JSON format:

{
  "keyTerms": ["List of important lease terms and conditions"],
  "requiredPayments": {
    "oneTime": ["Security deposit", "Application fees", "Other one-time payments"],
    "recurring": ["Monthly rent", "Utilities", "Other recurring charges"]
  },
  "junkFees": ["Hidden or questionable fees", "Unnecessary charges"],
  "riskNotes": ["Potential red flags", "Concerning clauses", "Risks to tenant"],
  "tenantQuestions": ["Questions tenant should ask landlord", "Clarifications needed"],
  "plainSummary": "Brief, clear summary of the lease terms"
}

Focus on:
- Fair housing compliance
- Accessibility accommodations
- International student considerations
- Hidden costs and fees
- Tenant rights and protections

Lease Document:
${text.substring(0, 8000)} // Limit text length

Return ONLY valid JSON. Be thorough but concise.
`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const responseText = response.text();
    
    try {
      const parsed = JSON.parse(responseText);
      const leaseQA: LeaseQA = {
        keyTerms: Array.isArray(parsed.keyTerms) ? parsed.keyTerms : [],
        requiredPayments: {
          oneTime: Array.isArray(parsed.requiredPayments?.oneTime) ? parsed.requiredPayments.oneTime : [],
          recurring: Array.isArray(parsed.requiredPayments?.recurring) ? parsed.requiredPayments.recurring : []
        },
        junkFees: Array.isArray(parsed.junkFees) ? parsed.junkFees : [],
        riskNotes: Array.isArray(parsed.riskNotes) ? parsed.riskNotes : [],
        tenantQuestions: Array.isArray(parsed.tenantQuestions) ? parsed.tenantQuestions : [],
        plainSummary: parsed.plainSummary || 'Unable to analyze lease document',
        translation: lang !== 'en' ? await translateText(parsed.plainSummary || text, lang, genAI) : undefined,
        model: 'gemini-1.5-flash'
      };
      
      return leaseQA;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return getMockLeaseQA(text, lang);
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getMockLeaseQA(text, lang);
  }
}

async function translateText(text: string, targetLang: string, genAI: GoogleGenerativeAI): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Translate the following text to ${targetLang}: ${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

function getMockLeaseQA(text: string, lang: string): LeaseQA {
  const mockSummary = lang === 'en' 
    ? "This is a sample lease analysis. Please configure your GEMINI_API_KEY to get real AI-powered analysis."
    : "Esta es un análisis de arrendamiento de muestra. Configure su GEMINI_API_KEY para obtener un análisis real impulsado por IA.";

  return {
    keyTerms: [
      'Monthly rent amount and due date',
      'Security deposit requirements',
      'Lease term and renewal options',
      'Pet policies and restrictions',
      'Maintenance and repair responsibilities'
    ],
    requiredPayments: {
      oneTime: [
        'Security deposit (typically 1-2 months rent)',
        'Application fee',
        'First and last month rent'
      ],
      recurring: [
        'Monthly rent payment',
        'Utilities (if not included)',
        'Internet and cable (if applicable)'
      ]
    },
    junkFees: [
      'Administrative fees',
      'Processing fees',
      'Move-in/move-out fees'
    ],
    riskNotes: [
      'Review all terms carefully before signing',
      'Check for automatic rent increase clauses',
      'Verify maintenance responsibility details'
    ],
    tenantQuestions: [
      'What is included in the rent?',
      'How are maintenance requests handled?',
      'What are the penalties for breaking the lease?',
      'Is renter\'s insurance required?'
    ],
    plainSummary: mockSummary,
    translation: lang !== 'en' ? mockSummary : undefined,
    model: 'mock'
  };
}