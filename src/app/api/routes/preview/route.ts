import { findPohangMapRoute } from '@/lib/poing-content';
import { findPohangCoordinate } from '@/lib/pohang-coordinates';
import { getKakaoRouteSummary } from '@/lib/server/kakao';

export async function GET(request: Request) {
  const region = new URL(request.url).searchParams.get('region') ?? 'oldtown';
  const selected = findPohangMapRoute(region);
  const segments = await Promise.all(selected.pins.slice(0, -1).map(async (pin, index) => ({
    from: pin.name,
    to: selected.pins[index + 1].name,
    route: await getKakaoRouteSummary(findPohangCoordinate(pin.name), findPohangCoordinate(selected.pins[index + 1].name), 'transit'),
  })));
  return Response.json({ region: selected.label, segments }, { headers: { 'Cache-Control': 'public, s-maxage=600' } });
}
