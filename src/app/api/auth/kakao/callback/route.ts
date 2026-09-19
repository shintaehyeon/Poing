import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const expectedState = (await cookies()).get('poing_oauth_state')?.value;
  const clientId = process.env.KAKAO_REST_API_KEY;
  const redirectUri = process.env.KAKAO_REDIRECT_URI || new URL('/api/auth/kakao/callback', request.url).toString();
  if (!code || !clientId || !expectedState || expectedState !== url.searchParams.get('state')) {
    return NextResponse.redirect(new URL('/plan/create?auth=failed', request.url));
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
  });
  if (process.env.KAKAO_CLIENT_SECRET) body.set('client_secret', process.env.KAKAO_CLIENT_SECRET);

  const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body,
    cache: 'no-store',
  });
  if (!tokenResponse.ok) return NextResponse.redirect(new URL('/plan/create?auth=failed', request.url));
  const token = (await tokenResponse.json()) as { access_token?: string; expires_in?: number };
  if (!token.access_token) return NextResponse.redirect(new URL('/plan/create?auth=failed', request.url));

  const response = NextResponse.redirect(new URL('/plan/create?auth=success', request.url));
  response.cookies.set('poing_oauth_state', '', { httpOnly: true, path: '/', maxAge: 0 });
  response.cookies.set('poing_kakao_access', token.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: token.expires_in ?? 21600,
  });
  return response;
}
