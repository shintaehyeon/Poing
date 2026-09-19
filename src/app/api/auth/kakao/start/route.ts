import { NextResponse } from 'next/server';

export function GET(request: Request) {
  const clientId = process.env.KAKAO_REST_API_KEY;
  if (!clientId) return NextResponse.redirect(new URL('/plan/create?auth=missing-key', request.url));
  const redirectUri = process.env.KAKAO_REDIRECT_URI || new URL('/api/auth/kakao/callback', request.url).toString();
  const authorize = new URL('https://kauth.kakao.com/oauth/authorize');
  const state = crypto.randomUUID();
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', redirectUri);
  authorize.searchParams.set('response_type', 'code');
  authorize.searchParams.set('state', state);
  const response = NextResponse.redirect(authorize);
  response.cookies.set('poing_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600,
  });
  return response;
}
