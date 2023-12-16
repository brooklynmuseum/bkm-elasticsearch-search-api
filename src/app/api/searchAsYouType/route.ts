import { NextResponse } from 'next/server';

import { searchAsYouType } from '@/lib/elasticsearch/api/searchAsYouType';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  try {
    const result = await searchAsYouType(query);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
