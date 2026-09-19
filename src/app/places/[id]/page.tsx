import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '@/components/poing/PageShell';
import { findPohangCoordinate } from '@/lib/pohang-coordinates';
import { getNearbyPlaces } from '@/lib/server/kakao-places';
import { getPohangTourApiData } from '@/lib/server/kto-tour';

export const dynamic = 'force-dynamic';

const introLabels: Record<string, string> = {
  usetime: '이용 시간', usetimeculture: '이용 시간', opentimefood: '영업 시간',
  restdate: '휴무일', restdateculture: '휴무일', restdatefood: '휴무일',
  parking: '주차', parkingculture: '주차', parkingfood: '주차',
  usefee: '이용 요금', usefeeculture: '이용 요금',
  infocenter: '문의', infocenterculture: '문의', infocenterfood: '문의',
  firstmenu: '대표 메뉴', treatmenu: '취급 메뉴',
};

export default async function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tour = await getPohangTourApiData();
  const place = tour.places.find((item) => item.contentId === id || item.id === id);
  if (!place) notFound();
  const coordinate = place.mapX && place.mapY
    ? { x: place.mapX, y: place.mapY }
    : findPohangCoordinate(place.title);
  const [restaurants, cafes] = await Promise.all([
    getNearbyPlaces(coordinate, 'FD6'), getNearbyPlaces(coordinate, 'CE7'),
  ]);
  const intro = Object.entries(place.intro ?? {}).filter(([key, value]) => introLabels[key] && value);

  return (
    <PageShell active="detail" eyebrow={place.category} title={place.title} description={place.address || '포항 관광 장소'}>
      <div className="place-detail-layout">
        <div>
          {place.imageUrl && <div className="place-detail-hero"><Image alt={place.title} fill sizes="(max-width: 800px) 100vw, 760px" src={place.imageUrl} unoptimized /></div>}
          <section className="panel">
            <span className="field-title">장소 소개</span>
            <p>{place.overview || '관광공사 장소 정보에 소개가 없습니다.'}</p>
            <small>{place.sourceLabel} · {place.sourceApis.join(', ')}</small>
          </section>
          {place.images.length > 1 && <div className="place-detail-photos">
            {place.images.slice(1, 5).map((image) => <div key={image}><Image alt={`${place.title} 추가 사진`} fill sizes="(max-width: 800px) 45vw, 240px" src={image} unoptimized /></div>)}
          </div>}
          <small className="source-note">{place.imageCredit ?? '사진 제공: 한국관광공사 관광정보 API · 공공누리 유형은 원 출처에서 확인해 주세요.'}</small>
        </div>
        <aside className="place-detail-aside">
          <section className="panel">
            <span className="field-title">방문 정보</span>
            <dl className="place-facts">
              <div><dt>주소</dt><dd>{place.address || '정보 없음'}</dd></div>
              {place.tel && <div><dt>전화</dt><dd>{place.tel}</dd></div>}
              {intro.map(([key, value]) => <div key={key}><dt>{introLabels[key]}</dt><dd>{value}</dd></div>)}
            </dl>
            {coordinate && <a className="secondary-action" href={`https://map.kakao.com/link/search/${encodeURIComponent(place.title + ' 포항')}`} rel="noreferrer" target="_blank">지도에서 보기</a>}
          </section>
        </aside>
      </div>
      <div className="place-nearby-grid">
        {[
          { title: '근처 음식점', result: restaurants },
          { title: '근처 카페', result: cafes },
        ].map(({ title, result }) => <section className="panel" key={title}>
          <span className="field-title">Kakao Local</span>
          <h3>{title}</h3>
          <p>{result.message}</p>
          <ol className="place-nearby-list">
            {result.places.map((nearby) => <li key={nearby.id}>
              <a href={nearby.url} rel="noreferrer" target="_blank"><strong>{nearby.name}</strong><span>{(nearby.distanceMeters / 1000).toFixed(1)}km · {nearby.address}</span></a>
            </li>)}
          </ol>
        </section>)}
      </div>
      <Link className="secondary-action" href="/plan/create">여정으로 돌아가기</Link>
    </PageShell>
  );
}
