import { buildFallbackItinerary, findRecipePreset, findRegionRoute } from '@/lib/poing-content';
import { getPohangSunTimes } from '@/lib/pohang-sun';
import { generateTripSummary } from '@/lib/server/ai';
import { getKakaoRouteSummary, type Coordinate, type TravelMode } from '@/lib/server/kakao';
import { findPohangCoordinate, straightLineKm } from '@/lib/pohang-coordinates';
import { getPohangTourApiData, pickKtoItineraryPlaces } from '@/lib/server/kto-tour';
import { saveTrip, saveTripEvent } from '@/lib/server/supabase';
import { getRelatedTourPlaces, getTourCongestion, getVisitorTrend } from '@/lib/server/tour-supplements';
import { getTripOwner, ownerCookieOptions } from '@/lib/server/trip-owner';
import { NextResponse } from 'next/server';

type TripCondition = {
  region?: string;
  duration?: string;
  arrivalTime?: string;
  transport?: string;
  companion?: string;
  purpose?: string;
};

export async function POST(request: Request) {
  const condition = (await request.json().catch(() => ({}))) as TripCondition;
  const recipe = findRecipePreset(
    condition.companion ?? '연인',
    condition.purpose ?? '인생샷 찍기',
    condition.region,
  );
  const regionRoute = findRegionRoute(condition.region);
  const fallbackItinerary = buildFallbackItinerary(regionRoute.label);
  const placeCount = condition.duration === '1박2일' ? 5 : condition.duration === '2박3일+' ? 7 : 3;
  const tour = await getPohangTourApiData();
  const selectedTourPlaces = tour.connected ? pickKtoItineraryPlaces(tour.places, regionRoute.label, placeCount) : [];
  const mode: TravelMode = condition.transport === '대중교통' ? 'transit' : condition.transport === '도보 중심' ? 'walk' : 'car';
  const preferred = recipe.route ?? [];
  selectedTourPlaces.sort((a, b) => {
    const rank = (name: string) => {
      const normalize = (value: string) => value.replace(/포항|해수욕장|전망대|해맞이광장|\s/g, '');
      const normalizedName = normalize(name);
      const index = preferred.findIndex((item: string) => {
        const normalizedItem = normalize(item);
        return normalizedName.includes(normalizedItem) || normalizedItem.includes(normalizedName);
      });
      return index < 0 ? 99 : index;
    };
    return rank(a.title) - rank(b.title);
  });
  if (placeCount > 3 && selectedTourPlaces.length > 2) {
    const ordered = [selectedTourPlaces.shift()!];
    while (selectedTourPlaces.length) {
      const previous = ordered[ordered.length - 1];
      const from = previous.mapX && previous.mapY ? { x: previous.mapX, y: previous.mapY } : undefined;
      const distanceTo = (place: (typeof selectedTourPlaces)[number]) =>
        from && place.mapX && place.mapY ? straightLineKm(from, { x: place.mapX, y: place.mapY }) : Infinity;
      const nearestIndex = selectedTourPlaces.reduce((best, place, index) =>
        distanceTo(place) < distanceTo(selectedTourPlaces[best]) ? index : best, 0);
      ordered.push(selectedTourPlaces.splice(nearestIndex, 1)[0]);
    }
    selectedTourPlaces.push(...ordered);
  }
  const places =
    tour.connected && selectedTourPlaces.length > 0
      ? selectedTourPlaces.map((tourPlace, index) => {
          const place = fallbackItinerary[index % fallbackItinerary.length];
          return {
            ...place,
            id: tourPlace.contentId,
            name: tourPlace.title,
            officialTitle: tourPlace.title,
            category: tourPlace.category,
            address: tourPlace.address || place.address,
            imageUrl: tourPlace.imageUrl || place.imageUrl,
            imageCredit: tourPlace.imageCredit,
            imageAlt: `${tourPlace.title} 관광공사 이미지`,
            sourceUrl: 'https://korean.visitkorea.or.kr/',
            sourceLabel: tourPlace.sourceLabel,
            sourceTag: 'ⓒ한국관광공사',
            description: tourPlace.overview || place.description,
            mapX: tourPlace.mapX,
            mapY: tourPlace.mapY,
            intro: tourPlace.intro,
            images: tourPlace.images,
            reason: `${tourPlace.sourceApis.join(', ')} 응답을 기반으로 POING 일정 후보에 반영했어요.`,
          };
        })
      : fallbackItinerary.map((place) => ({ ...place, ...(() => {
          const coordinate = findPohangCoordinate(place.officialTitle);
          return { mapX: coordinate?.x, mapY: coordinate?.y, intro: undefined, images: [place.imageUrl] };
        })() }));
  const signalPlace = regionRoute.label === '구도심'
    ? '영일대해수욕장'
    : regionRoute.label === '남포항'
      ? '구룡포 일본인 가옥거리'
      : selectedTourPlaces[0]?.title ?? places[0].name;
  const coordinates = places.map((place): Coordinate | undefined =>
    place.mapX && place.mapY ? { x: place.mapX, y: place.mapY } : findPohangCoordinate(place.officialTitle));
  const [related, congestions, visitors, routeSegments, aiSummary] = await Promise.all([
    getRelatedTourPlaces(signalPlace),
    Promise.all(places.map((place) => getTourCongestion(place.officialTitle))),
    getVisitorTrend(),
    Promise.all(places.slice(0, -1).map((_, index) => getKakaoRouteSummary(coordinates[index], coordinates[index + 1], mode))),
    generateTripSummary({
      region: regionRoute.label,
      recipeTitle: recipe.title,
      places: places.map((place) => place.name),
    }),
  ]);
  const congestion = congestions[0];
  const route = routeSegments[0];
  const startMinutes = (() => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(condition.arrivalTime ?? '');
    return match ? Math.max(0, Math.min(23, Number(match[1]))) * 60 + Math.min(59, Number(match[2])) : 14 * 60 + 30;
  })();
  let currentMinutes = startMinutes;
  const scheduledPlaces = places.map((place, index) => {
    const day = condition.duration === '당일치기' ? 0 : Math.floor(index / 3);
    if (index > 0 && index % 3 === 0) currentMinutes = 9 * 60 + 30;
    else if (index > 0) currentMinutes += 90 + Math.ceil((routeSegments[index - 1]?.durationSeconds ?? 0) / 60);
    const time = `${String(Math.floor(currentMinutes / 60) % 24).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`;
    return { ...place, time: day ? `${day + 1}일차 ${time}` : time, day: day + 1 };
  });
  const tripId = crypto.randomUUID();
  const ownerId = (await getTripOwner()) ?? crypto.randomUUID();
  const persistence = await saveTrip({
    id: tripId,
    owner_id: ownerId,
    condition,
    itinerary: scheduledPlaces,
    summary: aiSummary.summary,
    visited_places: [],
    status: 'planned',
  }).catch(() => ({ connected: false, message: '여행 저장에 실패했습니다.' }));

  if (persistence.connected) {
    await saveTripEvent({
      event: 'itinerary_generated',
      tripId,
      ownerId,
      payload: { condition, tourConnected: tour.connected, apiCalls: tour.apiCalls },
    }).catch(() => null);
  }

  const nextBackendTargets = [
    !tour.connected && '한국관광공사 관광정보·사진 API 키 설정',
    !related.connected && `연관 관광지: ${related.reason ?? '해당 장소 결과 없음'}`,
    !congestion.connected && `관광지 집중률: ${congestion.message}`,
    !visitors.connected && '지역별 방문자수 API 승인·키 설정',
    !route?.connected && `Kakao 길찾기: ${route?.message ?? '경로 없음'}`,
    !aiSummary.connected && 'OpenAI 또는 Gemini 키 설정',
    !persistence.connected && 'Supabase 프로젝트 연결과 스키마 적용',
  ].filter((target): target is string => Boolean(target));

  const response = NextResponse.json({
    tripId,
    generatedAt: new Date().toISOString(),
    condition,
    recipe,
    regionRoute,
    selectionNote: placeCount > 3
      ? `선택한 ${regionRoute.label}에서 시작하며, 숙박 일정은 포항 전역의 장소까지 확장될 수 있습니다.`
      : undefined,
    places: scheduledPlaces,
    sun: getPohangSunTimes(),
    summary: aiSummary.summary,
    dataSources: [
      ...(tour.connected ? tour.apiCalls : []),
      ...(related.connected ? ['관광지별 연관 관광지'] : []),
      ...(congestions.some((item) => item.connected) ? ['관광지 집중률 예측'] : []),
      ...(visitors.connected ? ['지역별 방문자 수'] : []),
      ...(routeSegments.some((item) => item.connected) ? [`Kakao ${mode} 길찾기`] : []),
      ...(aiSummary.connected ? [aiSummary.source] : []),
    ],
    apiConnections: {
      tour,
      related,
      congestion,
      congestions,
      visitors,
      route,
      routeSegments,
      aiSummary,
      persistence,
    },
    nextBackendTargets,
  });
  if (!ownerId.startsWith('kakao:')) response.cookies.set('poing_guest_id', ownerId, ownerCookieOptions);
  return response;
}
