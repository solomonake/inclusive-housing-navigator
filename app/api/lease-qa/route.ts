import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface LeaseQAResponse {
  summary: string;
  key_terms: {
    rent: string;
    deposit: string;
    lease_duration: string;
    utilities: string;
    parking: string;
    pets: string;
    maintenance: string;
  };
  red_flags: string[];
  translation?: {
    language: string;
    summary: string;
    key_terms: Record<string, string>;
  };
  accessibility_notes: string[];
  international_student_notes: string[];
  cost_breakdown: {
    monthly_rent: number;
    utilities: number;
    deposit: number;
    fees: number;
    total_first_month: number;
  };
  recommendations: string[];
}

const LEASE_QA_PROMPT = `
You are an expert housing advisor specializing in lease analysis for international and rural students. Analyze the following lease document and provide a comprehensive assessment.

Lease Document Text:
{lease_text}

Please provide a detailed analysis in the following JSON format:

{
  "summary": "Brief 2-3 sentence summary of the lease",
  "key_terms": {
    "rent": "Monthly rent amount and payment terms",
    "deposit": "Security deposit amount and refund conditions",
    "lease_duration": "Lease length and renewal terms",
    "utilities": "What utilities are included/excluded",
    "parking": "Parking availability and costs",
    "pets": "Pet policy and fees",
    "maintenance": "Maintenance responsibilities and procedures"
  },
  "red_flags": [
    "List of concerning clauses or potential issues",
    "Unusual fees or penalties",
    "Restrictive terms"
  ],
  "accessibility_notes": [
    "Notes about accessibility features mentioned",
    "Potential accessibility concerns"
  ],
  "international_student_notes": [
    "Specific considerations for international students",
    "Documentation requirements",
    "Co-signer policies"
  ],
  "cost_breakdown": {
    "monthly_rent": 0,
    "utilities": 0,
    "deposit": 0,
    "fees": 0,
    "total_first_month": 0
  },
  "recommendations": [
    "Actionable advice for the student",
    "Questions to ask the landlord",
    "Negotiation points"
  ]
}

Focus on:
1. Identifying hidden fees or unusual terms
2. Accessibility considerations
3. International student-specific concerns
4. Clear cost breakdown
5. Practical recommendations

Be thorough but concise. Prioritize student safety and financial protection.
`;

const TRANSLATION_PROMPT = `
Translate the following lease analysis into {target_language}. Maintain the same JSON structure but translate all text content.

Original Analysis:
{analysis}

Target Language: {target_language}

Provide the complete translated analysis in the same JSON format.
`;

export async function POST(request: NextRequest) {
  try {
    const { lease_text, target_language } = await request.json();

    if (!lease_text) {
      return NextResponse.json(
        { error: 'Lease text is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Gemini API key not configured',
          fallback: {
            summary: "Lease analysis unavailable - API not configured",
            key_terms: {
              rent: "Please review lease document for rent terms",
              deposit: "Please review lease document for deposit requirements",
              lease_duration: "Please review lease document for lease length",
              utilities: "Please review lease document for utility inclusions",
              parking: "Please review lease document for parking policy",
              pets: "Please review lease document for pet policy",
              maintenance: "Please review lease document for maintenance terms"
            },
            red_flags: ["API not configured - manual review recommended"],
            accessibility_notes: ["Please review for accessibility features"],
            international_student_notes: ["Please review for international student requirements"],
            cost_breakdown: {
              monthly_rent: 0,
              utilities: 0,
              deposit: 0,
              fees: 0,
              total_first_month: 0
            },
            recommendations: ["Configure Gemini API for automated analysis", "Review lease manually for key terms"]
          }
        },
        { status: 503 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Generate lease analysis
    const analysisPrompt = LEASE_QA_PROMPT.replace('{lease_text}', lease_text);
    const analysisResult = await model.generateContent(analysisPrompt);
    const analysisText = analysisResult.response.text();

    let analysis: LeaseQAResponse;
    try {
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      return NextResponse.json(
        { 
          error: 'Failed to parse analysis response',
          raw_response: analysisText
        },
        { status: 500 }
      );
    }

    // Add translation if requested
    if (target_language && target_language !== 'en') {
      try {
        const translationPrompt = TRANSLATION_PROMPT
          .replace('{analysis}', JSON.stringify(analysis))
          .replace('{target_language}', target_language);
        
        const translationResult = await model.generateContent(translationPrompt);
        const translationText = translationResult.response.text();
        
        const translationMatch = translationText.match(/\{[\s\S]*\}/);
        if (translationMatch) {
          const translation = JSON.parse(translationMatch[0]);
          analysis.translation = {
            language: target_language,
            summary: translation.summary,
            key_terms: translation.key_terms
          };
        }
      } catch (translationError) {
        console.error('Translation failed:', translationError);
        // Continue without translation
      }
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Lease QA error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze lease document' },
      { status: 500 }
    );
  }
}