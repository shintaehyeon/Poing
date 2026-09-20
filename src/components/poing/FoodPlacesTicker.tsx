'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { KtoPlace } from '@/lib/server/kto-tour';

const isCafePlace = (title: string) => /카페|커피|제과|베이커리|로스터|헤이안|페이지|브리즈|파도/i.test(title);

function FoodSet({ duplicate, places }: { duplicate?: boolean; places: KtoPlace[] }) {
  return (
    <div aria-hidden={duplicate ? 'true' : undefined} className="food-ticker-set">
      {places.map((place, index) => {
        const cafe = isCafePlace(place.title);
        const menu = place.intro?.firstmenu ?? place.intro?.treatmenu;
        return (
          <Link
            className="food-place-card food-ticker-card"
            href={`/places/${place.contentId}`}
            key={`${duplicate ? 'copy' : 'original'}-${place.contentId}-${index}`}
            tabIndex={duplicate ? -1 : undefined}
          >
            <span className="food-place-photo">
              <Image
                alt={duplicate ? '' : `${place.title} 사진`}
                fill
                sizes="(max-width: 760px) 82vw, 320px"
                src={place.imageUrl}
                unoptimized
              />
              <em>{cafe ? '카페' : '로컬 맛집'}</em>
            </span>
            <strong>{place.title}</strong>
            <p>{menu || place.address.replace('경상북도 포항시 ', '')}</p>
            <small>출처: {place.imageCredit ?? 'ⓒ한국관광공사'}</small>
          </Link>
        );
      })}
    </div>
  );
}

export default function FoodPlacesTicker({ places }: { places: KtoPlace[] }) {
  if (!places.length) return null;

  const style = {
    '--food-ticker-duration': `${Math.max(places.length * 5, 48)}s`,
  } as CSSProperties;

  return (
    <div className="food-discovery-ticker" style={style}>
      <div className="food-ticker-status">
        <p><i aria-hidden="true" /> 한국관광공사 OpenAPI 음식점·카페 {places.length}곳</p>
        <span>포항의 맛을 따라 계속 흐르는 중</span>
      </div>
      <div className="food-ticker-viewport">
        <div className="food-ticker-track">
          <FoodSet places={places} />
          <FoodSet duplicate places={places} />
        </div>
      </div>
    </div>
  );
}
