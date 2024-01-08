import { NextResponse } from 'next/server';

import { getDocuments } from '@/lib/elasticsearch/api/documents';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.getAll('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  try {
    const result = await getDocuments(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
