import Image from 'next/image';
import Link from 'next/link';
import PageShell from '@/components/poing/PageShell';
import { getIntegrationStatus } from '@/lib/server/api-status';
import { getPohangTourApiData, pickKtoItineraryPlaces } from '@/lib/server/kto-tour';
import { getRelatedTourPlaces, getTourCongestion, getVisitorTrend } from '@/lib/server/tour-supplements';

export const dynamic = 'force-dynamic';

const count = (value: number) => new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(value);
const stateText = (state: string) => state === 'configured' ? '키 설정됨' : '키 필요';

export default async function InsightPage() {
  const tour = await getPohangTourApiData();
  const lead = pickKtoItineraryPlaces(tour.places)[0] ?? tour.places[0];
  const signalPlace = '영일대해수욕장';
  const [related, congestion, visitors] = await Promise.all([
    getRelatedTourPlaces(signalPlace),
    getTourCongestion(signalPlace),
    getVisitorTrend(),
  ]);
  const integrations = getIntegrationStatus();
  const maxForecast = Math.max(...congestion.forecast.map((item) => item.rate), 100);

  return (
    <PageShell
      active="detail"
      aside={
        <>
          <section className="panel dark">
            <h3>API 연결 상태</h3>
            <p>아래 표는 키 설정 여부입니다. 실제 응답 성공 여부는 각 데이터 카드에 별도로 표시합니다.</p>
            <div className="integration-status-list">
              {integrations.map((api) => (
                <div key={api.key}>
                  <span>{api.label}</span>
                  <b className={api.state === 'configured' ? 'ready' : ''}>{stateText(api.state)}</b>
                </div>
              ))}
            </div>
          </section>
        </>
      }
      description="장소와 사진을 가져오는 데서 끝나지 않고, 연관 방문·향후 혼잡·지역 방문자·이동 데이터를 일정 판단 근거로 연결합니다."
      eyebrow="Live data evidence"
      title="POING이 이 여정을 고른 실제 근거"
    >
      <section className="detail-hero photo">
        {lead?.imageUrl && (
          <Image alt={lead.title} fill sizes="(max-width: 1200px) 100vw, 820px" src={lead.imageUrl} unoptimized />
        )}
        <span>{lead?.title ?? '포항 여행'}</span>
      </section>

      <section className="metric-grid">
        <div><strong>관광 장소</strong><span>{tour.connected ? tour.places.length : '키 대기'}</span></div>
        <div><strong>혼잡 집중률</strong><span>{congestion.connected ? `${congestion.rate?.toFixed(1)} / 100` : '데이터 없음'}</span></div>
        <div><strong>기간 추정 방문량</strong><span>{visitors.connected ? count(visitors.totalVisitors) : '데이터 없음'}</span></div>
      </section>

      <section className="panel insight-source-panel">
        <span className="field-title">장소 정보와 사진</span>
        <h3>{tour.connected ? '한국관광공사 데이터가 실제 장소 카드에 적용됐습니다.' : '키와 활용 승인이 완료되면 관광공사 장소 데이터로 바뀝니다.'}</h3>
        <p>{lead?.overview || lead?.address || tour.reason || 'areaBasedList2, detailCommon2, detailIntro2, detailImage2 응답을 기다리고 있습니다.'}</p>
        <div className="tag-row">
          {(lead?.sourceApis ?? ['areaBasedList2', 'detailCommon2', 'detailIntro2', 'detailImage2']).map((api) => <span key={api}>{api}</span>)}
        </div>
        {tour.connected && <small className="source-note">출처: ⓒ한국관광공사</small>}
      </section>

      <section className="insight-live-grid">
        <article className="panel">
          <span className="field-title">연관 관광지 TOP 10 · {signalPlace} 기준</span>
          <div className="insight-ranking">
            {related.items.map((item) => (
              <div key={`${item.rank}-${item.title}`}>
                <b>{String(item.rank).padStart(2, '0')}</b>
                <span><strong>{item.title}</strong><small>{item.reason}</small></span>
              </div>
            ))}
          </div>
          <small className="source-note">{related.source}{related.baseMonth ? ` · ${related.baseMonth}` : ''}</small>
        </article>

        <article className="panel">
          <span className="field-title">향후 30일 집중률 · {signalPlace} 기준</span>
          {congestion.forecast.length ? (
            <div className="forecast-chart">
              {congestion.forecast.map((item) => (
                <i key={item.date} style={{ height: `${Math.max(8, item.rate / maxForecast * 100)}%` }} title={`${item.date} · ${item.rate}`} />
              ))}
            </div>
          ) : <p>{congestion.message}</p>}
          <strong>{congestion.level}</strong>
          <small className="source-note">{congestion.source}</small>
        </article>
      </section>

      <section className="panel">
        <span className="field-title">포항 지역 추정 방문량</span>
        <div className="visitor-summary">
          <div><span>전체</span><strong>{visitors.connected ? count(visitors.totalVisitors) : '-'}</strong></div>
          <div><span>내국인</span><strong>{visitors.connected ? count(visitors.domesticVisitors) : '-'}</strong></div>
          <div><span>외국인</span><strong>{visitors.connected ? count(visitors.foreignVisitors) : '-'}</strong></div>
        </div>
        <p>{visitors.message}</p>
        <small className="source-note">{visitors.source}</small>
      </section>

      <section className="panel">
        <span className="field-title">일정 선택</span>
        <div className="side-actions">
          <Link className="primary-action" href="/plan/confirm">일정에 유지</Link>
          <Link className="secondary-action" href="/travel/modify">다른 장소 보기</Link>
        </div>
      </section>
    </PageShell>
  );
}
