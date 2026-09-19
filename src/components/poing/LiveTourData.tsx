'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Place = {
  contentId: string;
  title: string;
  category: string;
  address: string;
  overview: string;
  imageUrl: string;
  sourceLabel: string;
  imageCredit?: string;
};

type TourPayload = {
  tour: { connected: boolean; reason?: string; places: Place[]; photos: Array<{ id: string; title: string; imageUrl: string; photographer?: string; license?: string }> };
  related: {
    connected: boolean;
    source: string;
    items: Array<{ title: string; rank: number; reason: string; category?: string }>;
  };
  congestion: {
    connected: boolean;
    source: string;
    level: string;
    rate?: number;
    forecast: Array<{ date: string; rate: number }>;
  };
  visitors: {
    connected: boolean;
    source: string;
    totalVisitors: number;
    domesticVisitors: number;
    foreignVisitors: number;
    period?: { start: string; end: string };
    daily: Array<{ date: string; visitors: number }>;
  };
};

const formatCount = (value: number) => new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(value);

export default function LiveTourData() {
  const [payload, setPayload] = useState<TourPayload | null>(null);
  const [failed, setFailed] = useState(false);
  const [category, setCategory] = useState('전체');

  useEffect(() => {
    fetch('/api/tour/pohang/places')
      .then((response) => {
        if (!response.ok) throw new Error('tour data');
        return response.json() as Promise<TourPayload>;
      })
      .then(setPayload)
      .catch(() => setFailed(true));
  }, []);

  const categories = useMemo(
    () => ['전체', ...Array.from(new Set(payload?.tour.places.map((place) => place.category) ?? []))],
    [payload],
  );
  const places = useMemo(
    () => payload?.tour.places.filter((place) => category === '전체' || place.category === category).slice(0, 8) ?? [],
    [category, payload],
  );

  if (failed) {
    return <section className="live-data-board"><p>관광 데이터를 불러오지 못했습니다. 잠시 뒤 다시 확인해 주세요.</p></section>;
  }

  if (!payload) {
    return (
      <section className="live-data-board loading" aria-live="polite">
        <span>한국관광공사 데이터를 불러오는 중</span>
        <div />
      </section>
    );
  }

  const maxVisitor = Math.max(...payload.visitors.daily.map((item) => item.visitors), 1);
  const photoTitles = new Set<string>();
  const galleryPhotos = payload.tour.photos.filter((photo) => {
    if (photoTitles.has(photo.title)) return false;
    photoTitles.add(photo.title);
    return true;
  }).slice(0, 8);

  return (
    <section className="live-data-board" id="live-tour-data">
      <div className="live-data-heading">
        <div>
          <span>Official tourism data</span>
          <h3>지금 연결된 포항 관광 데이터</h3>
          <p>관광지 정보와 사진, 연관 방문, 혼잡 예측, 지역 방문자 수를 한 화면에서 확인합니다.</p>
        </div>
        <strong className={payload.tour.connected ? 'connected' : 'fallback'}>
          {payload.tour.connected ? '관광공사 실데이터' : 'API 키 대기 · 미리보기'}
        </strong>
      </div>

      <div className="live-data-metrics">
        <article>
          <span>포항 장소 후보</span>
          <strong>{formatCount(payload.tour.places.length)}</strong>
          <small>areaBasedList2 + 상세 3종</small>
        </article>
        <article>
          <span>영일대 향후 집중률</span>
          <strong>{payload.congestion.connected ? `${payload.congestion.rate?.toFixed(1) ?? '-'}` : '-'}</strong>
          <small>{payload.congestion.level} · 향후 예측 상대값, 실시간 아님</small>
        </article>
        <article>
          <span>기간 방문자</span>
          <strong>{payload.visitors.connected ? formatCount(payload.visitors.totalVisitors) : '-'}</strong>
          <small>남구·북구 기간 추정 방문량, 순방문자 아님</small>
        </article>
        <article>
          <span>연관 장소</span>
          <strong>{payload.related.connected ? payload.related.items.length : '-'}</strong>
          <small>티맵 이동 데이터 기반</small>
        </article>
      </div>

      <div className="live-data-tabs" aria-label="관광 정보 유형">
        {categories.map((label) => (
          <button className={category === label ? 'active' : ''} key={label} onClick={() => setCategory(label)} type="button">
            {label}
          </button>
        ))}
      </div>

      <div className="live-place-grid">
        {places.map((place) => (
          <article key={place.contentId}>
            <Link className="live-place-link" href={`/places/${place.contentId}`}>
            <div className="live-place-image">
              {place.imageUrl ? (
                <Image alt={place.title} fill sizes="(max-width: 760px) 82vw, 280px" src={place.imageUrl} unoptimized />
              ) : (
                <span>POING</span>
              )}
            </div>
            <div>
              <span>{place.category}</span>
              <h4>{place.title}</h4>
              <p>{place.address || place.overview || '포항 관광 정보'}</p>
              <small>{place.sourceLabel}</small>
              {place.imageCredit && <small>{place.imageCredit}</small>}
              <span>장소 정보 · 근처 맛집/카페 보기 →</span>
            </div>
            </Link>
          </article>
        ))}
      </div>

      {payload.tour.photos.length > 0 && (
        <div className="official-photo-gallery">
          <div>
            <strong>포항 관광사진</strong>
            <small>한국관광공사 관광사진 정보 API</small>
          </div>
          <div className="official-photo-row">
            {galleryPhotos.map((photo) => (
              <figure key={photo.id}>
                <div><Image alt={photo.title} fill sizes="(max-width: 760px) 70vw, 260px" src={photo.imageUrl} unoptimized /></div>
                <figcaption>{photo.title} · {photo.photographer ? `${photo.photographer} · ` : ''}{photo.license ?? '출처 확인'}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      <div className="tour-signal-grid">
        <article>
          <span>연관 관광지 TOP 5</span>
          <div className="ranked-signal-list">
            {payload.related.items.slice(0, 5).map((item) => (
              <div key={`${item.rank}-${item.title}`}>
                <b>{String(item.rank).padStart(2, '0')}</b>
                <strong>{item.title}</strong>
                <small>{item.category || item.reason}</small>
              </div>
            ))}
          </div>
        </article>
        <article>
          <span>포항 방문 흐름</span>
          {payload.visitors.daily.length ? (
            <div className="visitor-bars" aria-label="일자별 포항 방문자 수">
              {payload.visitors.daily.map((item) => (
                <i
                  key={item.date}
                  style={{ height: `${Math.max(12, (item.visitors / maxVisitor) * 100)}%` }}
                  title={`${item.date}: ${formatCount(item.visitors)}명`}
                />
              ))}
            </div>
          ) : (
            <p>키 연결 후 포항 남구·북구 방문자 흐름이 표시됩니다.</p>
          )}
          <small>{payload.visitors.source}</small>
        </article>
      </div>
    </section>
  );
}
