import { NextResponse } from 'next/server';

export function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('poing_kakao_access', '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
