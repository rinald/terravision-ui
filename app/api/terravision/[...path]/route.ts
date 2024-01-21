import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const basePath = 'http://localhost:8001/terravision';

  const path = params.path;
  const searchParams = request.nextUrl.searchParams;

  const fullUrl = `${basePath}/${path.join('/')}${
    searchParams ? `?${searchParams}` : ''
  }`;

  const stream = await fetch(fullUrl).then(res => res.body);

  return new Response(stream);
}
