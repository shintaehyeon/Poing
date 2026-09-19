import { getPohangTourApiData } from '@/lib/server/kto-tour';
import { getRelatedTourPlaces, getTourCongestion, getVisitorTrend } from '@/lib/server/tour-supplements';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tour = await getPohangTourApiData();
  const [related, congestion, visitors] = await Promise.all([
    getRelatedTourPlaces('영일대해수욕장'),
    getTourCongestion('영일대해수욕장'),
    getVisitorTrend(),
  ]);

  return Response.json(
    {
      generatedAt: new Date().toISOString(),
      tour,
      related,
      congestion,
      visitors,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
