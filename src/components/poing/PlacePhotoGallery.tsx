 'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { placePhotoCards } from '@/lib/poing-content';

export default function PlacePhotoGallery() {
  const [live, setLive] = useState<Array<{ id: string; name: string; region: string; imageUrl: string; imageAlt: string; imageCredit: string; sourceUrl: string; caption: string }>>([]);
  useEffect(() => {
    fetch('/api/tour/pohang/places')
      .then((response) => response.json())
      .then((data: { tour?: { connected: boolean; places: Array<{ contentId: string; title: string; category: string; imageUrl: string; overview: string; sourceLabel: string; imageCredit?: string }> } }) => {
        if (!data.tour?.connected) return;
        setLive(data.tour.places.filter((place) => place.imageUrl).slice(0, 8).map((place) => ({
          id: place.contentId, name: place.title, region: place.category,
          imageUrl: place.imageUrl, imageAlt: `${place.title} 관광 사진`,
          imageCredit: place.imageCredit ?? `${place.sourceLabel} · 사진별 공공누리 유형 확인`,
          sourceUrl: `/places/${place.contentId}`, caption: place.overview || '포항 관광정보',
        })));
      }).catch(() => null);
  }, []);
  const cards = live.length ? live : placePhotoCards.slice(0, 4);
  const marqueePlaces = [...cards, ...cards];

  return (
    <section className="place-photo-section" id="place-gallery" aria-label="포항 명소 사진 탐색">
      <div className="planner-section-title">
        <span>Pohang highlight board</span>
        <h3>포항의 대표명소들</h3>
      </div>

      <div className="place-photo-marquee" aria-label="포항 대표명소 사진 슬라이드">
        <div className="place-photo-track">
          {marqueePlaces.map((place, index) => (
            <article aria-hidden={index >= cards.length} className="place-photo-card" key={`${place.id}-${index}`}>
              <a aria-label={`${place.name} 상세 보기`} href={place.sourceUrl} rel="noreferrer" tabIndex={index >= cards.length ? -1 : undefined} target={place.sourceUrl.startsWith('/') ? undefined : '_blank'}>
              <span className="place-photo-image">
                <Image
                  alt={place.imageAlt}
                  fill
                  sizes="(max-width: 760px) 100vw, (max-width: 1180px) 42vw, 320px"
                  src={place.imageUrl}
                  unoptimized
                />
              </span>
              <span className="place-photo-meta">{place.region}</span>
              <strong>{place.name}</strong>
              <p>{place.caption}</p>
              <small>{place.imageCredit}</small>
            </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
