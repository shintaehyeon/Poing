'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { bestPohangGroups } from '@/lib/poing-content';
import type { KtoPlace } from '@/lib/server/kto-tour';
import { placePhotoCards } from '@/lib/poing-content';

const PAGE_SIZE = 6;
const ROLL_INTERVAL_MS = 5000;

export default function BestPohang({ places = [] }: { places?: KtoPlace[] }) {
  const [activeId, setActiveId] = useState('all');
  const [pageIndex, setPageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeGroup = useMemo(
    () => bestPohangGroups.find((group) => group.id === activeId) ?? bestPohangGroups[0],
    [activeId],
  );

  const liveGroups = useMemo(() => [
    { id: 'all', label: '전체', items: places },
    ...Array.from(new Set(places.map((place) => place.category))).map((category) => ({
      id: category,
      label: category,
      items: places.filter((place) => place.category === category),
    })),
  ].filter((group) => group.items.length), [places]);
  const activeLiveGroup = liveGroups.find((group) => group.id === activeId) ?? liveGroups[0];
  const groups = liveGroups.length ? liveGroups : [{ id: 'hot', label: '포항 명소', items: bestPohangGroups[0].items }];
  const pageCount = Math.max(1, Math.ceil((activeLiveGroup?.items.length ?? 0) / PAGE_SIZE));
  const normalizedPageIndex = Math.min(pageIndex, pageCount - 1);
  const firstVisibleIndex = normalizedPageIndex * PAGE_SIZE;
  const visiblePlaces = activeLiveGroup?.items.slice(firstVisibleIndex, firstVisibleIndex + PAGE_SIZE) ?? [];

  useEffect(() => {
    if (!activeLiveGroup || pageCount <= 1 || isPaused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setPageIndex((current) => (current + 1) % pageCount);
    }, ROLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [activeLiveGroup, isPaused, pageCount]);

  const selectGroup = (id: string) => {
    setActiveId(id);
    setPageIndex(0);
  };

  const movePage = (direction: -1 | 1) => {
    setPageIndex((current) => (current + direction + pageCount) % pageCount);
  };

  return (
    <section className="best-pohang-section" id="best-pohang">
      <div className="best-title">
        <p className="eyebrow">Best Pohang</p>
        <h2>
          <span>BEST</span> 퐝퐝
        </h2>
        <p>{liveGroups.length ? `한국관광공사 OpenAPI가 전한 포항 ${places.length}곳을 천천히 둘러보세요.` : '포항 관광 장소 미리보기'}</p>
      </div>

      <div className="best-layout">
        <nav className="best-tabs" aria-label="BEST 퐝퐝 카테고리">
          {groups.map((group) => (
            <button
              className={group.id === (activeLiveGroup?.id ?? activeGroup.id) ? 'active' : ''}
              key={group.id}
              onClick={() => selectGroup(group.id)}
              type="button"
            >
              <span>{group.label}</span>
              <small>{group.items.length}</small>
            </button>
          ))}
        </nav>

        <div
          className="best-showcase"
          onBlur={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {activeLiveGroup && (
            <div className="best-roll-meta">
              <p>
                <span>한국관광공사 OpenAPI</span>
                <strong>{firstVisibleIndex + 1}-{Math.min(firstVisibleIndex + PAGE_SIZE, activeLiveGroup.items.length)} / {activeLiveGroup.items.length}</strong>
              </p>
              {pageCount > 1 && (
                <div className="best-roll-actions">
                  <button aria-label="이전 장소 보기" onClick={() => movePage(-1)} title="이전" type="button">←</button>
                  <button aria-label="다음 장소 보기" onClick={() => movePage(1)} title="다음" type="button">→</button>
                </div>
              )}
            </div>
          )}

          <div
            aria-live={isPaused ? 'polite' : 'off'}
            className="best-grid best-grid-rolling"
            key={`${activeLiveGroup?.id ?? 'fallback'}-${normalizedPageIndex}`}
          >
            {visiblePlaces.map((item) => (
              <article className="best-card" key={item.contentId}>
                <a href={`/places/${item.contentId}`}>
                  <span className="best-photo">
                    {item.imageUrl ? (
                      <Image
                        alt={item.title}
                        fill
                        sizes="(max-width: 760px) 100vw, (max-width: 1180px) 42vw, 360px"
                        src={item.imageUrl}
                        unoptimized
                      />
                    ) : (
                      <span className="best-photo-empty">사진 준비 중</span>
                    )}
                  </span>
                  <strong>{item.title}</strong>
                  {item.address && <span className="best-card-address">{item.address}</span>}
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

          {activeLiveGroup && pageCount > 1 && (
            <div className="best-roll-progress" aria-label="장소 묶음 선택">
              <div>
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    aria-label={`${index + 1}번째 장소 묶음 보기`}
                    aria-current={index === normalizedPageIndex ? 'true' : undefined}
                    className={index === normalizedPageIndex ? 'active' : ''}
                    key={index}
                    onClick={() => setPageIndex(index)}
                    type="button"
                  />
                ))}
              </div>
              <span>{isPaused ? '잠시 멈춤' : '5초마다 다음 장소'}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
