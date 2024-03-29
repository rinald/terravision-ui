import { Files } from '@/lib/files';

import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const basePath = 'http://localhost:8001/terravision';

  const path = params.path;
  const searchParams = request.nextUrl.searchParams;

  const content: Files = await request.json();

  // write the editor content to the file system
  await fetch(`${basePath}/write`, {
    method: 'POST',
    body: JSON.stringify(content)
  });

  const fullUrl = `${basePath}/${path.join('/')}${
    searchParams ? `?${searchParams}` : ''
  }`;

  const stream = await fetch(fullUrl).then(res => res.body);

  return new Response(stream);
}
