import { findPohangCoordinate } from '@/lib/pohang-coordinates';
import { getKakaoRouteSummary, type Coordinate, type TravelMode } from '@/lib/server/kakao';
import { getTourCongestion } from '@/lib/server/tour-supplements';

type PlaceInput = { name: string; officialTitle?: string; mapX?: string; mapY?: string };

export async function POST(request: Request) {
  const input = await request.json().catch(() => null) as { places?: PlaceInput[]; mode?: TravelMode; changedIndex?: number } | null;
  if (!input?.places || input.places.length < 2 || input.places.length > 8) return Response.json({ error: '장소 수가 올바르지 않습니다.' }, { status: 400 });
  const mode: TravelMode = input.mode === 'walk' || input.mode === 'transit' ? input.mode : 'car';
  const coordinates = input.places.map((place): Coordinate | undefined => {
    const x = Number(place.mapX);
    const y = Number(place.mapY);
    return Number.isFinite(x) && Number.isFinite(y) && x > 129 && x < 130 && y > 35 && y < 37
      ? { x: String(x), y: String(y) }
      : findPohangCoordinate(place.officialTitle ?? place.name);
  });
  const [routeSegments, congestion] = await Promise.all([
    Promise.all(input.places.slice(0, -1).map((_, index) => getKakaoRouteSummary(coordinates[index], coordinates[index + 1], mode))),
    typeof input.changedIndex === 'number' && input.places[input.changedIndex]
      ? getTourCongestion(input.places[input.changedIndex].officialTitle ?? input.places[input.changedIndex].name)
      : Promise.resolve(null),
  ]);
  return Response.json({ routeSegments, congestion });
}
