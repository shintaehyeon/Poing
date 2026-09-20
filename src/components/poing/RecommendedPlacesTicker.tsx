'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';

export type RecommendedPlaceItem = {
  id: string;
  title: string;
  category: string;
  address: string;
  overview: string;
  imageUrl: string;
  credit?: string;
  href: string;
  travelInfo?: string;
};

const plainText = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function PlaceSet({ duplicate, places }: { duplicate?: boolean; places: RecommendedPlaceItem[] }) {
  return (
    <div aria-hidden={duplicate ? 'true' : undefined} className="destination-ticker-set">
      {places.map((place, index) => (
        <article className="destination-card destination-ticker-card" key={`${duplicate ? 'copy' : 'original'}-${place.id}-${index}`}>
          <div className="destination-photo">
            <Image
              alt={duplicate ? '' : `${place.title} 사진`}
              fill
              sizes="(max-width: 760px) 82vw, 360px"
              src={place.imageUrl}
              unoptimized
            />
            <span>{place.category}</span>
          </div>
          <div>
            <strong>{place.title}</strong>
            <p className="destination-travel-info">{plainText(place.travelInfo || place.address)}</p>
            <p className="place-description">{plainText(place.overview) || '포항의 풍경과 지역 이야기를 함께 만나는 여행지입니다.'}</p>
            <small>{place.credit || '한국관광공사 OpenAPI'}</small>
            <div className="card-link-row">
              <Link href={place.href} tabIndex={duplicate ? -1 : undefined}>장소 자세히</Link>
              <Link href="/plan/create" tabIndex={duplicate ? -1 : undefined}>여정에 담기</Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function RecommendedPlacesTicker({ places }: { places: RecommendedPlaceItem[] }) {
  if (!places.length) return null;

  const style = {
    '--destination-ticker-duration': `${Math.max(places.length * 6, 54)}s`,
  } as CSSProperties;

  return (
    <div className="destination-ticker" style={style}>
      <div className="destination-ticker-status">
        <p><i aria-hidden="true" /> 한국관광공사 OpenAPI 명소 {places.length}곳</p>
        <span>마우스를 올리면 잠시 멈춰요</span>
      </div>
      <div className="destination-ticker-viewport">
        <div className="destination-ticker-track">
          <PlaceSet places={places} />
          <PlaceSet duplicate places={places} />
        </div>
      </div>
    </div>
  );
}
