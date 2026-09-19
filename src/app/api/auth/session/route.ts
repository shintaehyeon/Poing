import { cookies } from 'next/headers';

export async function GET() {
  const accessToken = (await cookies()).get('poing_kakao_access')?.value;
  if (!accessToken) return Response.json({ authenticated: false });
  try {
    const response = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!response.ok) return Response.json({ authenticated: false });
    const profile = (await response.json()) as {
      id?: number;
      kakao_account?: { profile?: { nickname?: string; profile_image_url?: string } };
      properties?: { nickname?: string; profile_image?: string };
    };
    return Response.json({
      authenticated: true,
      user: {
        id: profile.id,
        nickname: profile.kakao_account?.profile?.nickname ?? profile.properties?.nickname ?? '여행자',
        profileImage: profile.kakao_account?.profile?.profile_image_url ?? profile.properties?.profile_image,
      },
    });
  } catch {
    return Response.json({ authenticated: false });
  }
}
