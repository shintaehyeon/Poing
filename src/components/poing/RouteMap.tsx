 'use client';

import GeoRouteMap from './GeoRouteMap';
import { findPohangCoordinate } from '@/lib/pohang-coordinates';
import { useTrip } from '@/lib/use-trip';

export default function RouteMap({ large = false }: { large?: boolean }) {
  const { places } = useTrip();
  const points = places.flatMap((place) => {
    const coordinate = place.mapX && place.mapY
      ? { x: place.mapX, y: place.mapY }
      : findPohangCoordinate(place.officialTitle);
    return coordinate ? [{ name: place.name, coordinate }] : [];
  });
  return (
    <div className="geo-route-shell">
      <GeoRouteMap large={large} points={points} />
      <small>OpenStreetMap · 점선은 장소를 잇는 안내선이며 실제 도로 경로가 아닙니다.</small>
    </div>
  );
}
