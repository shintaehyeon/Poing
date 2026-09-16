import { getPohangSunTimes } from '@/lib/pohang-sun';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(getPohangSunTimes(), {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
