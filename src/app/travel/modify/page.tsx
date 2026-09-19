'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageShell from '@/components/poing/PageShell';
import PlaceThumb from '@/components/poing/PlaceThumb';
import { officialPlaceById } from '@/lib/pohang-official';
import { persistTripUpdate, useTrip } from '@/lib/use-trip';
import type { TravelMode } from '@/lib/server/kakao';

const fallbackAlternatives = [officialPlaceById.hwanho, officialPlaceById.yeongildae];

export default function ModifyTravelPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState('');
  const [targetIndex, setTargetIndex] = useState(1);
  const [status, setStatus] = useState('');
  const { trip, updateTrip, places } = useTrip();
  useEffect(() => {
    const current = Number(window.sessionStorage.getItem('poing_current_index')) || 0;
    const timer = window.setTimeout(() => setTargetIndex(Math.min(current + 1, places.length - 1)), 0);
    return () => window.clearTimeout(timer);
  }, [places.length]);
  const alternatives = useMemo(() => {
    const currentIds = new Set(places.map((place) => place.id));
    const relatedNames = trip?.apiConnections?.related?.connected
      ? trip.apiConnections.related.items.map((item) => item.title) : [];
    if (trip?.apiConnections?.tour?.connected) {
      return trip.apiConnections.tour.places
        .filter((place) => place.imageUrl && !currentIds.has(place.contentId))
        .sort((a, b) => {
          const rank = (title: string) => {
            const index = relatedNames.findIndex((name) => title.includes(name) || name.includes(title));
            return index < 0 ? 99 : index;
          };
          return rank(a.title) - rank(b.title);
        })
        .slice(0, 4)
        .map((place) => ({
          id: place.contentId, title: place.title, shortTitle: place.title, category: place.category,
          address: place.address, description: place.overview, imageUrl: place.imageUrl,
          imageAlt: `${place.title} 사진`, sourceUrl: `/places/${place.contentId}`,
          sourceLabel: place.sourceLabel, sourceTag: place.sourceLabel, mapX: place.mapX, mapY: place.mapY,
          intro: place.intro, meta: relatedNames.some((name) => place.title.includes(name)) ? '연관 관광지 데이터와 일치' : place.category,
          reason: place.overview || `${place.category} 장소입니다. 변경 후 이동 경로를 다시 확인합니다.`, tone: 'sea',
        }));
    }
    return fallbackAlternatives.filter((place) => !currentIds.has(place.id)).map((place) => ({
      ...place, mapX: undefined, mapY: undefined, intro: undefined,
      meta: '포항 관광 정보 미리보기', reason: place.description, tone: 'sea',
    }));
  }, [places, trip]);
  const changePlace = async () => {
    const selected = alternatives.find((place) => place.id === selectedId);
    if (!selected) return;
    setStatus('변경한 경로를 계산하고 있습니다.');
    const updated = places.map((place, index) => index === targetIndex ? {
      ...place,
      id: selected.id,
      name: selected.title,
      address: selected.address,
      description: selected.description,
      imageUrl: selected.imageUrl,
      imageAlt: selected.imageAlt,
      sourceUrl: selected.sourceUrl,
      sourceLabel: selected.sourceLabel,
      sourceTag: selected.sourceTag,
      officialTitle: selected.title,
      mapX: selected.mapX,
      mapY: selected.mapY,
      intro: selected.intro,
      reason: selected.reason,
    } : place);
    if (trip) {
      const mode: TravelMode = trip.condition?.transport === '대중교통' ? 'transit' : trip.condition?.transport === '도보 중심' ? 'walk' : 'car';
      const result = await fetch('/api/routes/recalculate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ places: updated, mode, changedIndex: targetIndex }),
      }).then((response) => response.json()).catch(() => null) as {
        routeSegments?: NonNullable<NonNullable<typeof trip.apiConnections>['routeSegments']>;
        congestion?: NonNullable<NonNullable<typeof trip.apiConnections>['congestion']>;
      } | null;
      const congestions = [...(trip.apiConnections?.congestions ?? [])];
      if (result?.congestion) congestions[targetIndex] = result.congestion;
      updateTrip({ ...trip, places: updated, apiConnections: {
        ...trip.apiConnections,
        routeSegments: result?.routeSegments ?? [],
        route: result?.routeSegments?.[0],
        congestions,
      } });
      await persistTripUpdate(trip, { itinerary: updated });
    }
    router.push('/travel/active');
  };

  return (
    <PageShell
      active="replace"
      aside={
        <section className="panel dark">
          <h3>변경 후 경로</h3>
          <p>선택한 장소를 반영하고 현재 이동수단으로 남은 구간을 다시 조회합니다.</p>
          <div className="mini-list">
            <span>변경 대상: {places[targetIndex]?.name}</span>
            <span>{trip?.condition?.transport ?? '선택한 이동수단'}</span>
          </div>
        </section>
      }
      description="관광공사 장소 후보에서 다음 방문지를 고릅니다. 연관 관광지 자료가 있으면 우선 보여줍니다."
      eyebrow="Route update"
      title="지금 상황에 맞춰 남은 일정을 바꿀 수 있어요"
    >
      <section className="alert"><span>다음 장소 변경</span><h3>{places[targetIndex]?.name} 대신 어디로 갈까요?</h3><p>혼잡도는 향후 상대 예측치이며, 실제 현장 대기 시간은 제공하지 않습니다.</p></section>

      <section className="replace-grid">
        {alternatives.map((place) => (
          <button
            className={`panel ${selectedId === place.id ? 'selected' : ''}`}
            key={place.id}
            onClick={() => setSelectedId(place.id)}
            type="button"
          >
            <PlaceThumb alt={place.imageAlt} src={place.imageUrl} tone={place.tone} />
            <span className="field-title">{place.meta}</span>
            <h3>{place.shortTitle}</h3>
            <p>{place.reason}</p>
            <span className="source-link">{place.sourceTag}</span>
          </button>
        ))}
      </section>

      <section className="panel">
        <span className="field-title">선택 후</span>
        <p>선택 후 이동 거리와 시간은 길찾기 API에서 다시 확인합니다.</p>
        <div className="side-actions">
          <button className="primary-action" disabled={!selectedId} onClick={() => void changePlace()} type="button">
            이 장소로 변경
          </button>
          <Link className="secondary-action" href="/plan/confirm">
            변경 취소
          </Link>
        </div>
        {status && <p aria-live="polite">{status}</p>}
      </section>
    </PageShell>
  );
}
