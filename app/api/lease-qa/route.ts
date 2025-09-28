import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const language = (formData.get('language') as string) || 'en';

      if (!file) {
        return NextResponse.json({
          ok: false,
          error: 'No file provided'
        });
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({
          ok: false,
          error: 'File too large. Maximum size is 10MB.'
        });
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({
          ok: false,
          error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files only.'
        });
      }

      try {
        // Mock analysis for now
        const analysis = {
          keyTerms: ['Monthly rent amount and due date', 'Security deposit requirements', 'Lease term and renewal options'],
          requiredPayments: {
            oneTime: ['Security Deposit: $1500', 'Application Fee: $50'],
            recurring: ['Monthly Rent: $1200', 'Utilities: $150/month (estimated)']
          },
          junkFees: ['Late Payment Fee: $75', 'Early Termination Fee: 2 months rent'],
          riskNotes: ['Landlord has right to enter with 24-hour notice', 'Tenant responsible for all minor repairs up to $100'],
          tenantQuestions: ['Can I sublet the property?', 'What is the policy on guests?', 'How do I submit maintenance requests?'],
          plainSummary: 'This is a sample lease analysis. File processing is temporarily disabled.',
          translation: language !== 'en' ? 'Translation temporarily unavailable' : undefined,
          model: 'mock-file-analysis'
        };

        return NextResponse.json({
          ok: true,
          data: analysis
        });
      } catch (extractError) {
        console.error('Error processing file:', extractError);
        return NextResponse.json({
          ok: false,
          error: 'Failed to process file. Please try a different file or paste the text directly.'
        });
      }
    } else {
      // Handle JSON text input
      const body = await request.json().catch(() => ({}));
      const text = body.text;
      const language = body.language || 'en';

      if (!text || typeof text !== 'string') {
        return NextResponse.json({
          ok: false,
          error: 'No text provided'
        });
      }

      if (text.trim().length < 50) {
        return NextResponse.json({
          ok: false,
          error: 'Text is too short. Please provide more lease content.'
        });
      }

      try {
        // Mock analysis for now
        const analysis = {
          keyTerms: ['Monthly rent amount and due date', 'Security deposit requirements', 'Lease term and renewal options'],
          requiredPayments: {
            oneTime: ['Security Deposit: $1500', 'Application Fee: $50'],
            recurring: ['Monthly Rent: $1200', 'Utilities: $150/month (estimated)']
          },
          junkFees: ['Late Payment Fee: $75', 'Early Termination Fee: 2 months rent'],
          riskNotes: ['Landlord has right to enter with 24-hour notice', 'Tenant responsible for all minor repairs up to $100'],
          tenantQuestions: ['Can I sublet the property?', 'What is the policy on guests?', 'How do I submit maintenance requests?'],
          plainSummary: `This is a sample lease analysis based on the provided text: "${text.substring(0, 100)}..."`,
          translation: language !== 'en' ? 'Translation temporarily unavailable' : undefined,
          model: 'mock-text-analysis'
        };
        
        return NextResponse.json({
          ok: true,
          data: analysis
        });
      } catch (analysisError) {
        console.error('Error analyzing lease text:', analysisError);
        return NextResponse.json({
          ok: false,
          error: 'Failed to analyze lease text. Please try again.'
        });
      }
    }
  } catch (error) {
    console.error('Lease QA API Error:', error);
    return NextResponse.json({
      ok: false,
      error: 'An unexpected error occurred. Please try again.'
    });
  }
}