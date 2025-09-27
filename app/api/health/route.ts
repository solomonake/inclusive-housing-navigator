import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasGemini: Boolean(process.env.GEMINI_API_KEY),
    hasDatabricks: Boolean(process.env.DATABRICKS_HOST && process.env.DATABRICKS_TOKEN),
    hasMapbox: Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN)
  });
}
