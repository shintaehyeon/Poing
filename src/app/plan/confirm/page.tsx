'use client';

import Link from 'next/link';
import PageShell from '@/components/poing/PageShell';
import PlaceThumb from '@/components/poing/PlaceThumb';
import RouteMap from '@/components/poing/RouteMap';
import { useTrip } from '@/lib/use-trip';

export default function ConfirmPlanPage() {
  const { trip, places } = useTrip();
  return (
    <PageShell
      active="itinerary"
      aside={
        <>
          <RouteMap />
          <section className="panel soft">
            <span className="field-title">예상 흐름</span>
            <h3>총 {places.length}곳</h3>
            <p>{trip?.summary ?? '산책, 노을, 저녁 식사가 이어지는 기본 코스입니다.'}</p>
          </section>
        </>
      }
      description="선택한 도착 시간과 이동수단에 맞춘 일정입니다. 장소 정보와 구간별 경로를 확인하고 여행을 시작하세요."
      eyebrow="Day 1"
      title={trip?.regionRoute?.headline ?? '오늘은 바다에서 시작해 야경으로 마무리해요'}
    >
      {trip?.selectionNote && <p className="itinerary-note">{trip.selectionNote}</p>}
      <section className="timeline">
        {places.map((place, index) => {
          const forecast = trip?.apiConnections?.congestions?.[index];
          const nextRoute = trip?.apiConnections?.routeSegments?.[index];
          return <div className="timeline-stop" key={`${place.id}-${index}`}>
          <article className="place-row">
            <PlaceThumb alt={place.imageAlt} src={place.imageUrl} tone={place.image} />
            <div>
              <span>{place.time}</span>
              <h3>{place.name}</h3>
              <p>{place.reason}</p>
              <div className="tag-row">
                <span>{place.duration}</span>
                <span>{forecast?.connected ? `향후 집중률 ${forecast.rate?.toFixed(0)}/100 · ${forecast.level}` : '집중률 데이터 없음'}</span>
                <span>주차 {place.intro?.parking || place.intro?.parkingculture || place.parking}</span>
              </div>
              <a className="source-link" href={place.sourceUrl} rel="noreferrer" target="_blank">
                {place.sourceTag}
              </a>
              {place.imageCredit && <small className="source-note">사진: {place.imageCredit}</small>}
            </div>
            <div className="row-actions">
              <Link className="secondary-action" href={`/places/${place.id}`}>
                자세히
              </Link>
              <Link className="secondary-action" href="/travel/modify">
                바꾸기
              </Link>
            </div>
          </article>
          {nextRoute && <div className="timeline-leg">
            <span>{place.name} → {places[index + 1]?.name}</span>
            <strong>{nextRoute.connected && nextRoute.distanceMeters != null
              ? `${(nextRoute.distanceMeters / 1000).toFixed(1)}km · ${Math.ceil((nextRoute.durationSeconds ?? 0) / 60)}분`
              : '이동 경로 정보 없음'}</strong>
            <small>{nextRoute.connected
              ? `${nextRoute.source}${nextRoute.busLines?.length ? ` · ${nextRoute.busLines.join(', ')}` : ''}`
              : nextRoute.message}</small>
          </div>}
          </div>;
        })}
      </section>

      <section className="panel">
        <span className="field-title">데이터 활용 결과</span>
        <div className="data-proof-list">
          <div><strong>장소·사진</strong><span>{trip?.apiConnections?.tour?.connected ? '관광공사 실데이터' : '포항 관광 정보 미리보기'}</span></div>
          <div><strong>혼잡 예측</strong><span>{trip?.apiConnections?.congestions?.filter((item) => item.connected).length ?? 0}곳 · 향후 상대 집중률, 실시간 아님</span></div>
          <div><strong>이동 경로</strong><span>{trip?.apiConnections?.routeSegments?.filter((item) => item.connected).length ?? 0}구간 · {trip?.condition?.transport ?? '선택 이동수단'}</span></div>
          <div><strong>추천 문장</strong><span>{trip?.apiConnections?.aiSummary?.connected ? trip.apiConnections.aiSummary.source : 'POING 기본 문장'}</span></div>
          <div><strong>여행 저장</strong><span>{trip?.apiConnections?.persistence?.connected ? 'Supabase에 저장됨' : '기기에서만 임시 보관'}</span></div>
        </div>
      </section>

      <section className="panel">
        <span className="field-title">다음 단계</span>
        <p>여행을 시작하면 지도, 현재 장소, 다음 장소, 일정 변경 버튼을 한 화면에서 볼 수 있습니다.</p>
        <Link className="primary-action" href="/travel/active">
          여행 시작하기
        </Link>
      </section>
    </PageShell>
  );
}
