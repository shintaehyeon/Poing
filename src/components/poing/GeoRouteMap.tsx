'use client';

import { useEffect, useRef } from 'react';
import type { Coordinate } from '@/lib/server/kakao';

export type MapPoint = { name: string; coordinate: Coordinate };

export default function GeoRouteMap({ points, large = false }: { points: MapPoint[]; large?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const signature = points.map((point) => `${point.name}:${point.coordinate.y},${point.coordinate.x}`).join('|');

  useEffect(() => {
    let disposed = false;
    let map: import('leaflet').Map | undefined;
    const mount = async () => {
      const L = await import('leaflet');
      if (disposed || !container.current) return;
      map = L.map(container.current, { zoomControl: true, scrollWheelZoom: false, attributionControl: true });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      const positions = points.map((point) => L.latLng(Number(point.coordinate.y), Number(point.coordinate.x)));
      positions.forEach((position, index) => {
        L.marker(position, {
          icon: L.divIcon({ className: 'geo-pin', html: `<span>${index + 1}</span>`, iconSize: [30, 30], iconAnchor: [15, 30] }),
        }).addTo(map!).bindTooltip(points[index].name);
      });
      if (positions.length > 1) {
        L.polyline(positions, { color: '#cf3374', weight: 4, opacity: 0.85, dashArray: '7 8' }).addTo(map);
        map.fitBounds(L.latLngBounds(positions), { padding: [42, 42], maxZoom: 13 });
      } else if (positions.length === 1) map.setView(positions[0], 12);
      else map.setView([36.052, 129.365], 10);
      window.setTimeout(() => map?.invalidateSize(), 40);
    };
    void mount();
    return () => { disposed = true; map?.remove(); };
    // signature tracks coordinate changes without recreating the map on unrelated renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return <div aria-label="포항 실제 지도와 장소 위치" className={`geo-map ${large ? 'large' : ''}`} ref={container} />;
}
