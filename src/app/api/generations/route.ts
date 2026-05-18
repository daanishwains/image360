import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const generations = await db.generation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json(generations);
  } catch (error) {
    console.error('Fetch generations error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, ratio, imageUrl, status, isFavorite, collection, source } = body;

    if (!prompt || !imageUrl) {
      return NextResponse.json({ error: 'Prompt and imageUrl are required' }, { status: 400 });
    }

    const generation = await db.generation.create({
      data: {
        prompt,
        ratio: ratio || '1:1',
        imageUrl,
        status: status || 'completed',
        isFavorite: isFavorite || false,
        collection: collection || null,
        source: source || 'single',
      },
    });

    return NextResponse.json(generation, { status: 201 });
  } catch (error) {
    console.error('Save generation error:', error);
    return NextResponse.json({ error: 'Failed to save generation' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.generation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete generation error:', error);
    return NextResponse.json({ error: 'Failed to delete generation' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isFavorite, collection } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    if (collection !== undefined) updateData.collection = collection;

    const generation = await db.generation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(generation);
  } catch (error) {
    console.error('Update generation error:', error);
    return NextResponse.json({ error: 'Failed to update generation' }, { status: 500 });
  }
}
