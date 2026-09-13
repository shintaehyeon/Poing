import Link from 'next/link';
import PageShell from '@/components/poing/PageShell';
import PlaceThumb from '@/components/poing/PlaceThumb';
import RouteMap from '@/components/poing/RouteMap';
import { itineraryPlaces } from '@/lib/poing-content';

export default function ConfirmPlanPage() {
  return (
    <PageShell
      active="itinerary"
      aside={
        <>
          <RouteMap />
          <section className="panel soft">
            <span className="field-title">예상 흐름</span>
            <h3>총 3곳, 약 5시간 30분</h3>
            <p>산책, 노을, 저녁 식사가 끊기지 않게 이어지는 코스입니다.</p>
          </section>
        </>
      }
      description="POING이 만든 첫 일정입니다. 마음에 들지 않는 장소는 바꾸거나 빼고, 바로 지도에서 여행을 시작할 수 있어요."
      eyebrow="Day 1"
      title="오늘은 바다에서 시작해 야경으로 마무리해요"
    >
      <section className="timeline">
        {itineraryPlaces.map((place) => (
          <article className="place-row" key={place.id}>
            <PlaceThumb tone={place.image} />
            <div>
              <span>{place.time}</span>
              <h3>{place.name}</h3>
              <p>{place.reason}</p>
              <div className="tag-row">
                <span>{place.duration}</span>
                <span>{place.congestion}</span>
                <span>주차 {place.parking}</span>
              </div>
            </div>
            <div className="row-actions">
              <Link className="secondary-action" href="/insight">
                자세히
              </Link>
              <Link className="secondary-action" href="/travel/modify">
                바꾸기
              </Link>
            </div>
          </article>
        ))}
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
