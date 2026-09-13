import Link from 'next/link';
import PageShell from '@/components/poing/PageShell';
import { apiPills, itineraryPlaces, visitorGroups } from '@/lib/poing-content';

export default function InsightPage() {
  const place = itineraryPlaces[0];

  return (
    <PageShell
      active="detail"
      aside={
        <>
          <section className="panel dark">
            <h3>사용 데이터</h3>
            <p>추천 근거는 장소 정보, 방문 흐름, 혼잡 예상, 이동 시간을 함께 비교해 만듭니다.</p>
            <div className="api-pills">
              {apiPills.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </section>

          <section className="panel soft">
            <span className="field-title">연결성이 높은 장소</span>
            <div className="mini-list">
              <span>스페이스워크</span>
              <span>환호공원</span>
              <span>죽도시장</span>
            </div>
          </section>
        </>
      }
      description="POING은 관광 정보를 나열하지 않고, 지금 여정에 어울리는 이유를 장소별로 보여줍니다."
      eyebrow="Recommendation reason"
      title={`${place.name}가 첫 장소인 이유`}
    >
      <section className="detail-hero">
        <span>{place.name}</span>
      </section>

      <section className="metric-grid">
        <div>
          <strong>추천 시간대</strong>
          <span>{place.time}</span>
        </div>
        <div>
          <strong>예상 체류</strong>
          <span>{place.duration}</span>
        </div>
        <div>
          <strong>혼잡도</strong>
          <span>{place.congestion}</span>
        </div>
      </section>

      <section className="panel">
        <span className="field-title">추천 근거</span>
        <h3>도착 직후 부담 없이 시작할 수 있는 바다 코스입니다.</h3>
        <p>
          방문자 수가 높은 장소이고, 스페이스워크와 연결성이 높습니다. 현재 혼잡도는 보통으로 예상되어
          첫 장소로 유지하기 좋습니다.
        </p>
        <div className="tag-row">
          <span>인기 장소</span>
          <span>연관 코스 높음</span>
          <span>{place.next}</span>
        </div>
      </section>

      <section className="visitor-board">
        {visitorGroups.map((group) => (
          <article className="visitor-group" key={group.title}>
            <strong>{group.title}</strong>
            <span>{group.caption}</span>
            {group.items.map((item) => (
              <div className="visitor-row" key={item.label}>
                <span>{item.label}</span>
                <meter max="100" value={item.value} />
                <b>{item.value}</b>
              </div>
            ))}
          </article>
        ))}
      </section>

      <section className="panel">
        <span className="field-title">장소 선택</span>
        <div className="side-actions">
          <Link className="primary-action" href="/plan/confirm">
            일정에 유지
          </Link>
          <Link className="secondary-action" href="/travel/modify">
            다른 장소 보기
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
