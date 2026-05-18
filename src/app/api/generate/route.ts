import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, ratio } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!ratio || typeof ratio !== 'string') {
      return NextResponse.json({ error: 'Ratio is required' }, { status: 400 });
    }

    const response = await fetch('https://pixelster.vercel.app/api/tti', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, ratio }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'External API error');
      return NextResponse.json(
        { error: `Generation failed: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
