import { NextResponse } from 'next/server';

import { searchAsYouType } from '@/lib/elasticsearch/api/searchAsYouType';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  try {
    const result = await searchAsYouType(q);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
