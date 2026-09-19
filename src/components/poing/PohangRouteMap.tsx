'use client';

import { useEffect, useMemo, useState } from 'react';
import { findPohangMapRoute, pohangMapRoutes } from '@/lib/poing-content';
import { findPohangCoordinate } from '@/lib/pohang-coordinates';
import type { KakaoRouteSummary } from '@/lib/server/kakao';
import GeoRouteMap from './GeoRouteMap';

type Preview = { segments: Array<{ from: string; to: string; route: KakaoRouteSummary }> };

export default function PohangRouteMap({ activeRegionId, onSelectRegion }: {
  activeRegionId: string;
  onSelectRegion: (regionLabel: string) => void;
}) {
  const activeRoute = findPohangMapRoute(activeRegionId);
  const [preview, setPreview] = useState<Preview | null>(null);
  const points = useMemo(() => activeRoute.pins.flatMap((pin) => {
    const coordinate = findPohangCoordinate(pin.name);
    return coordinate ? [{ name: pin.name, coordinate }] : [];
  }), [activeRoute]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/routes/preview?region=${activeRoute.id}`, { signal: controller.signal })
      .then((response) => response.json() as Promise<Preview>)
      .then(setPreview)
      .catch(() => setPreview(null));
    return () => controller.abort();
  }, [activeRoute.id]);

  return (
    <section className="pohang-route-map-card" id="route-map" aria-label="포항 권역 지도와 추천 코스">
      <div className="pohang-map-copy">
        <span>Area route map</span>
        <h3>포항을 네 권역으로 나눠 오늘의 길을 고릅니다.</h3>
        <p>권역을 선택하면 포항 실제 지도 위의 장소 순서와 구간별 이동 정보가 바뀝니다.</p>
      </div>
      <div aria-label="포항 권역 선택" className="map-region-tabs">
        {pohangMapRoutes.map((route) => (
          <button
            aria-pressed={route.id === activeRoute.id}
            className={route.id === activeRoute.id ? 'active' : ''}
            key={route.id}
            onClick={() => onSelectRegion(route.label)}
            onMouseEnter={() => onSelectRegion(route.label)}
            type="button"
          >{route.label}</button>
        ))}
      </div>
      <div className="pohang-map-layout">
        <div className="pohang-map-canvas">
          <GeoRouteMap large points={points} />
        </div>
        <div className="pohang-map-detail">
          <div className="map-detail-head">
            <span>{activeRoute.label}</span>
            <h4>{activeRoute.title}</h4>
            <p>{activeRoute.summary}</p>
          </div>
          <div className="map-segment-list">
            {activeRoute.pins.slice(0, -1).map((pin, index) => {
              const next = activeRoute.pins[index + 1];
              const route = preview?.segments[index]?.route;
              return (
                <article key={`${pin.name}-${next.name}`}>
                  <strong>{index + 1}. {pin.name} → {next.name}</strong>
                  <span>{route?.connected && route.distanceMeters != null ? `${(route.distanceMeters / 1000).toFixed(1)}km` : '거리 확인 중'}</span>
                  <em>{route?.connected
                    ? `${Math.ceil((route.durationSeconds ?? 0) / 60)}분 · ${route.mode === 'walk' ? '도보 대체' : route.busLines?.length ? route.busLines.join(', ') : '노선 정보 없음'}`
                    : route?.message ?? '대중교통 경로 확인 중'}</em>
                </article>
              );
            })}
          </div>
        </div>
      </div>
      <small className="osm-attribution">OpenStreetMap © 기여자 · 점선은 장소 순서이며 실제 도로 경로가 아닙니다.</small>
    </section>
  );
}
