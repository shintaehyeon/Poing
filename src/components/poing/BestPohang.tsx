'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { bestPohangGroups } from '@/lib/poing-content';
import type { KtoPlace } from '@/lib/server/kto-tour';
import { placePhotoCards } from '@/lib/poing-content';

export default function BestPohang({ places = [] }: { places?: KtoPlace[] }) {
  const [activeId, setActiveId] = useState(bestPohangGroups[0].id);
  const activeGroup = useMemo(
    () => bestPohangGroups.find((group) => group.id === activeId) ?? bestPohangGroups[0],
    [activeId],
  );

  const liveGroups = [
    { id: 'all', label: '전체', items: places.filter((place) => place.imageUrl) },
    ...Array.from(new Set(places.map((place) => place.category))).map((category) => ({
      id: category, label: category, items: places.filter((place) => place.category === category && place.imageUrl),
    })),
  ].filter((group) => group.items.length);
  const activeLiveGroup = liveGroups.find((group) => group.id === activeId) ?? liveGroups[0];
  const groups = liveGroups.length ? liveGroups : [{ id: 'hot', label: '포항 명소', items: bestPohangGroups[0].items }];
  return (
    <section className="best-pohang-section" id="best-pohang">
      <div className="best-title">
        <p className="eyebrow">Best Pohang</p>
        <h2>
          <span>BEST</span> 퐝퐝
        </h2>
        <p>{liveGroups.length ? '한국관광공사 포항 관광 장소에서 사진이 있는 곳을 모았습니다.' : '포항 관광 장소 미리보기'}</p>
      </div>

      <div className="best-layout">
        <nav className="best-tabs" aria-label="BEST 퐝퐝 카테고리">
          {groups.map((group) => (
            <button
              className={group.id === (activeLiveGroup?.id ?? activeGroup.id) ? 'active' : ''}
              key={group.id}
              onClick={() => setActiveId(group.id)}
              type="button"
            >
              {group.label}
            </button>
          ))}
        </nav>

        <div className="best-grid">
          {(activeLiveGroup?.items ?? []).map((item) => (
            <article className="best-card" key={item.contentId}>
              <a href={`/places/${item.contentId}`}>
                <span className="best-photo">
                  <Image
                    alt={item.title}
                    fill
                    sizes="(max-width: 760px) 100vw, (max-width: 1180px) 42vw, 360px"
                    src={item.imageUrl}
                    unoptimized
                  />
                </span>
                <strong>{item.title}</strong>
                {item.imageCredit && <small>{item.imageCredit}</small>}
              </a>
            </article>
          ))}
          {!activeLiveGroup && placePhotoCards.slice(0, 4).map((item) => (
            <article className="best-card" key={item.id}>
              <a href={item.sourceUrl} rel="noreferrer" target="_blank">
                <span className="best-photo"><Image alt={item.imageAlt} fill sizes="(max-width: 760px) 100vw, (max-width: 1180px) 42vw, 360px" src={item.imageUrl} unoptimized /></span>
                <strong>{item.name}</strong>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
