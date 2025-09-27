import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leaseText, language = 'en' }: { leaseText: string; language?: string } = body;

    if (!leaseText) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: leaseText' },
        { status: 400 }
      );
    }

    const geminiService = new GeminiService();
    const analysis = await geminiService.analyzeLease(leaseText, language);

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        timestamp: new Date().toISOString(),
        language
      }
    });
  } catch (error) {
    console.error('Error analyzing lease:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze lease document' },
      { status: 500 }
    );
  }
}
