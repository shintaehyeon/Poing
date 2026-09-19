'use client';

import { useEffect, useState } from 'react';
import { itineraryPlaces } from '@/lib/poing-content';
import type { CongestionResult, RelatedPlaceResult, VisitorTrendResult } from '@/lib/server/tour-supplements';
import type { KakaoRouteSummary } from '@/lib/server/kakao';

export type GeneratedPlace = (typeof itineraryPlaces)[number] & {
  mapX?: string;
  mapY?: string;
  day?: number;
  intro?: Record<string, string>;
  images?: string[];
  imageCredit?: string;
};

export type GeneratedTrip = {
  tripId?: string;
  generatedAt: string;
  places: GeneratedPlace[];
  condition?: { region?: string; duration?: string; arrivalTime?: string; transport?: string; companion?: string; purpose?: string };
  summary: string;
  selectionNote?: string;
  regionRoute?: { label: string; headline: string; description?: string };
  recipe?: { title: string; copy?: string };
  apiConnections?: {
    tour?: { connected: boolean; places: Array<{ id: string; contentId: string; title: string; category: string; address: string; overview: string; intro?: Record<string, string>; imageUrl: string; mapX?: string; mapY?: string; sourceLabel: string }> };
    related?: RelatedPlaceResult;
    congestion?: CongestionResult;
    congestions?: CongestionResult[];
    visitors?: VisitorTrendResult;
    route?: KakaoRouteSummary;
    routeSegments?: KakaoRouteSummary[];
    aiSummary?: { connected: boolean; source: string };
    persistence?: { connected: boolean; message: string };
  };
};

export function useTrip() {
  const [trip, setTrip] = useState<GeneratedTrip | null>(null);
  useEffect(() => {
    let parsed: GeneratedTrip | null = null;
    try {
      const saved = window.sessionStorage.getItem('poing_result');
      if (saved) parsed = JSON.parse(saved) as GeneratedTrip;
    } catch {}
    const timer = window.setTimeout(() => setTrip(parsed), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const updateTrip = (next: GeneratedTrip) => {
    setTrip(next);
    window.sessionStorage.setItem('poing_result', JSON.stringify(next));
  };
  return { trip, updateTrip, places: trip?.places ?? (itineraryPlaces as GeneratedPlace[]) };
}

export async function persistTripUpdate(
  trip: GeneratedTrip | null,
  payload: { rating?: number; review?: string; visited_places?: string[]; status?: 'planned' | 'active' | 'finished'; itinerary?: unknown[] },
) {
  if (!trip) return { connected: false, local: false, message: '저장할 여행이 없습니다.' };
  const saveLocally = () => {
    const id = trip.tripId ?? trip.generatedAt;
    let existing: Array<Record<string, unknown>> = [];
    try { existing = JSON.parse(window.localStorage.getItem('poing_local_records') ?? '[]'); } catch {}
    const previous = existing.find((item) => item.id === id) ?? {};
    const record = { ...previous, id, summary: trip.summary, condition: trip.condition, itinerary: payload.itinerary ?? trip.places, ...payload, saved_at: new Date().toISOString() };
    window.localStorage.setItem('poing_local_records', JSON.stringify([record, ...existing.filter((item) => item.id !== id)].slice(0, 20)));
    return { connected: false, local: true, message: '서버 연결 없이 이 기기에만 저장했습니다.' };
  };
  if (!trip.tripId) return saveLocally();
  try {
    const response = await fetch('/api/trips/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: trip.tripId, ...payload }),
    });
    if (response.ok) return (await response.json()) as { connected: boolean; local?: boolean; message: string };
  } catch {}
  return saveLocally();
}
