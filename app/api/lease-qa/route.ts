import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface LeaseQAResponse {
  keyTerms: string[];
  requiredPayments: { oneTime: string[]; recurring: string[] };
  junkFees: string[];
  riskNotes: string[];
  tenantQuestions: string[];
  plainSummary: string;
  translation?: string;
  model: string;
}

const LEASE_QA_PROMPT = `
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
{lease_text}

Return ONLY valid JSON. Be thorough but concise.
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
    let lease_text: string;
    let target_language: string;

    // Check if it's a file upload (FormData) or JSON
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const language = formData.get('language') as string;
      
      if (!file) {
        return NextResponse.json(
          { error: 'File is required' },
          { status: 400 }
        );
      }

      // For now, we'll just use the file name as text
      // In a real implementation, you'd extract text from the file
      lease_text = `Lease document: ${file.name} (${file.size} bytes)`;
      target_language = language || 'en';
    } else {
      const { lease_text: text, target_language: lang } = await request.json();
      lease_text = text;
      target_language = lang || 'en';
    }

    if (!lease_text) {
      return NextResponse.json(
        { error: 'Lease text is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return fallback analysis instead of error
      const fallbackAnalysis: LeaseQAResponse = {
        keyTerms: [
          "Please review lease document for rent terms",
          "Please review lease document for deposit requirements", 
          "Please review lease document for lease length",
          "Please review lease document for utility inclusions",
          "Please review lease document for parking policy",
          "Please review lease document for pet policy",
          "Please review lease document for maintenance terms"
        ],
        requiredPayments: {
          oneTime: ["Security deposit", "Application fees", "First and last month rent"],
          recurring: ["Monthly rent", "Utilities", "Other recurring charges"]
        },
        junkFees: ["API not configured - manual review recommended"],
        riskNotes: ["Please review for accessibility features", "Please review for international student requirements"],
        tenantQuestions: ["Configure Gemini API for automated analysis", "Review lease manually for key terms"],
        plainSummary: "Lease analysis unavailable - API not configured. Please review the document manually.",
        model: "fallback"
      };
      
      return NextResponse.json(fallbackAnalysis);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate lease analysis
    const analysisPrompt = LEASE_QA_PROMPT.replace('{lease_text}', lease_text);
    
    let analysisText: string;
    try {
      const analysisResult = await model.generateContent(analysisPrompt);
      analysisText = analysisResult.response.text();
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      // Return fallback analysis if Gemini fails
      const fallbackAnalysis: LeaseQAResponse = {
        keyTerms: [
          "Rent amount and payment terms",
          "Security deposit requirements",
          "Lease duration and renewal options",
          "Utility inclusions and exclusions",
          "Pet policies and restrictions",
          "Maintenance responsibilities"
        ],
        requiredPayments: {
          oneTime: ["Security deposit", "Application fees", "First month rent"],
          recurring: ["Monthly rent", "Utilities", "Other recurring charges"]
        },
        junkFees: ["Review for hidden fees", "Check for unnecessary charges"],
        riskNotes: ["Review all terms carefully", "Check for automatic rent increases", "Verify maintenance responsibilities"],
        tenantQuestions: [
          "What is included in the rent?",
          "How are maintenance requests handled?",
          "What are the penalties for breaking the lease?",
          "Is renter's insurance required?"
        ],
        plainSummary: "AI analysis temporarily unavailable. Please review the lease document manually for key terms and conditions.",
        model: "fallback"
      };
      
      return NextResponse.json(fallbackAnalysis);
    }

    let analysis: LeaseQAResponse;
    try {
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysis = {
          keyTerms: Array.isArray(parsed.keyTerms) ? parsed.keyTerms : [],
          requiredPayments: {
            oneTime: Array.isArray(parsed.requiredPayments?.oneTime) ? parsed.requiredPayments.oneTime : [],
            recurring: Array.isArray(parsed.requiredPayments?.recurring) ? parsed.requiredPayments.recurring : []
          },
          junkFees: Array.isArray(parsed.junkFees) ? parsed.junkFees : [],
          riskNotes: Array.isArray(parsed.riskNotes) ? parsed.riskNotes : [],
          tenantQuestions: Array.isArray(parsed.tenantQuestions) ? parsed.tenantQuestions : [],
          plainSummary: parsed.plainSummary || 'Unable to analyze lease document',
          model: 'gemini-1.5-flash'
        };
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      // Return fallback analysis if JSON parsing fails
      const fallbackAnalysis: LeaseQAResponse = {
        keyTerms: [
          "Rent amount and payment terms",
          "Security deposit requirements", 
          "Lease duration and renewal options",
          "Utility inclusions and exclusions",
          "Pet policies and restrictions",
          "Maintenance responsibilities"
        ],
        requiredPayments: {
          oneTime: ["Security deposit", "Application fees", "First month rent"],
          recurring: ["Monthly rent", "Utilities", "Other recurring charges"]
        },
        junkFees: ["Review for hidden fees", "Check for unnecessary charges"],
        riskNotes: ["Review all terms carefully", "Check for automatic rent increases", "Verify maintenance responsibilities"],
        tenantQuestions: [
          "What is included in the rent?",
          "How are maintenance requests handled?",
          "What are the penalties for breaking the lease?",
          "Is renter's insurance required?"
        ],
        plainSummary: "AI analysis response parsing failed. Please review the lease document manually for key terms and conditions.",
        model: "fallback"
      };
      
      return NextResponse.json(fallbackAnalysis);
    }

    // Add translation if requested
    if (target_language && target_language !== 'en') {
      try {
        const translationPrompt = `Translate the following text to ${target_language}: ${analysis.plainSummary}`;
        
        const translationResult = await model.generateContent(translationPrompt);
        const translationText = translationResult.response.text();
        
        analysis.translation = translationText;
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