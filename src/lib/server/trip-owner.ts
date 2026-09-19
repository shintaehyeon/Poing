import { cookies } from 'next/headers';

export async function getTripOwner() {
  const cookieStore = await cookies();
  const token = cookieStore.get('poing_kakao_access')?.value;
  if (token) {
    try {
      const response = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (response.ok) {
        const profile = (await response.json()) as { id?: number };
        if (profile.id) return `kakao:${profile.id}`;
      }
    } catch {}
  }
  const guestId = cookieStore.get('poing_guest_id')?.value;
  return guestId && /^[a-f0-9-]{36}$/.test(guestId) ? guestId : null;
}

export const ownerCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
};
