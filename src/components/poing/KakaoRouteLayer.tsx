'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const COORDINATES: Record<string, { lat: number; lng: number }> = {
  '이가리 닻 전망대': { lat: 36.1861, lng: 129.3927 },
  월포해수욕장: { lat: 36.2058, lng: 129.3717 },
  청하공진시장: { lat: 36.1974, lng: 129.3398 },
  영일대해수욕장: { lat: 36.0578, lng: 129.3781 },
  스페이스워크: { lat: 36.0664, lng: 129.3917 },
  '환호공원 스페이스워크': { lat: 36.0664, lng: 129.3917 },
  죽도시장: { lat: 36.0358, lng: 129.3654 },
  포항운하: { lat: 36.0263, lng: 129.3731 },
  도구해수욕장: { lat: 35.9902, lng: 129.4433 },
  연오랑세오녀: { lat: 36.0078, lng: 129.4779 },
  '구룡포 일본인 가옥거리': { lat: 35.9912, lng: 129.5595 },
  호미곶: { lat: 36.0761, lng: 129.5685 },
  보경사: { lat: 36.2517, lng: 129.3193 },
  '내연산 12폭포': { lat: 36.2635, lng: 129.2969 },
  경상북도수목원: { lat: 36.2207, lng: 129.2619 },
  오어사: { lat: 35.9254, lng: 129.4099 },
};

type KakaoMaps = {
  load: (callback: () => void) => void;
  LatLng: new (lat: number, lng: number) => unknown;
  LatLngBounds: new () => { extend: (point: unknown) => void };
  Map: new (element: HTMLElement, options: { center: unknown; level: number }) => {
    setBounds: (bounds: unknown, paddingTop?: number, paddingRight?: number, paddingBottom?: number, paddingLeft?: number) => void;
  };
  Marker: new (options: { map: unknown; position: unknown; title: string }) => unknown;
  Polyline: new (options: {
    map: unknown;
    path: unknown[];
    strokeWeight: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeStyle: string;
  }) => unknown;
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMaps };
  }
}

export default function KakaoRouteLayer({ placeNames }: { placeNames: string[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  const routeKey = placeNames.join('|');
  const stableNames = useMemo(() => routeKey.split('|'), [routeKey]);

  useEffect(() => {
    if (!appKey || !mapRef.current) return;
    const renderMap = () => {
      window.kakao?.maps.load(() => {
        if (!mapRef.current || !window.kakao) return;
        const maps = window.kakao.maps;
        const points = stableNames.map((name) => COORDINATES[name]).filter(Boolean);
        if (!points.length) return;
        const path = points.map((point) => new maps.LatLng(point.lat, point.lng));
        const map = new maps.Map(mapRef.current, { center: path[0], level: 8 });
        const bounds = new maps.LatLngBounds();
        path.forEach((point, index) => {
          bounds.extend(point);
          new maps.Marker({ map, position: point, title: stableNames[index] });
        });
        new maps.Polyline({
          map, path, strokeWeight: 5, strokeColor: '#071d33', strokeOpacity: 0.82, strokeStyle: 'shortdash',
        });
        map.setBounds(bounds, 60, 60, 60, 60);
        setLoaded(true);
      });
    };
    const existing = document.querySelector<HTMLScriptElement>('script[data-poing-kakao-map]');
    if (existing) {
      if (window.kakao?.maps) renderMap();
      else existing.addEventListener('load', renderMap, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.dataset.poingKakaoMap = 'true';
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.addEventListener('load', renderMap, { once: true });
    document.head.appendChild(script);
  }, [appKey, stableNames]);

  if (!appKey) {
    return (
      <iframe
        className="osm-map-frame"
        loading="lazy"
        src="https://www.openstreetmap.org/export/embed.html?bbox=129.10%2C35.80%2C129.63%2C36.32&layer=mapnik"
        title="OpenStreetMap 포항 지도"
      />
    );
  }

  return (
    <>
      <div className="kakao-map-frame" ref={mapRef} />
      {!loaded && <span className="map-loading-label">Kakao 지도 불러오는 중</span>}
    </>
  );
}
