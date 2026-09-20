'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { regionRoutes } from '@/lib/poing-content';
import type { KtoPlace } from '@/lib/server/kto-tour';

type RegionalFlowProps = {
  compact?: boolean;
  places?: KtoPlace[];
};

const previewKeyword = (name: string) => {
  if (/영일대/.test(name)) return '영일대';
  if (/스페이스워크|해상스카이워크|환호공원/.test(name)) return '스페이스워크';
  if (/죽도/.test(name)) return '죽도시장';
  if (/호미곶|상생의 손/.test(name)) return '호미곶';
  if (/구룡포.*가옥|구룡포.*근대|구룡포항/.test(name)) return '구룡포 일본인 가옥거리';
  if (/연오랑세오녀/.test(name)) return '연오랑세오녀';
  if (/보경사|내연산/.test(name)) return '내연산 보경사';
  if (/오어사|운제산/.test(name)) return '오어사';
  if (/포항운하/.test(name)) return '포항운하';
  if (/국립등대/.test(name)) return '국립등대박물관';
  if (/과메기문화/.test(name)) return '구룡포과메기문화관';
  if (/이가리/.test(name)) return '이가리 닻 전망대';
  return name.replace(/\s+/g, '');
};

const findPreviewPlace = (name: string, places: KtoPlace[]) => {
  const keyword = previewKeyword(name).replace(/\s+/g, '');
  return places.find((place) => {
    const title = place.title.replace(/\s+/g, '');
    return title.includes(keyword) || keyword.includes(title);
  });
};

export default function RegionalFlow({ compact = false, places = [] }: RegionalFlowProps) {
  const [activeId, setActiveId] = useState(regionRoutes[0].id);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const activeRegion = useMemo(
    () => regionRoutes.find((region) => region.id === activeId) ?? regionRoutes[0],
    [activeId],
  );
  const defaultPreview = useMemo(
    () => activeRegion.courses.flatMap((course) => course.places)
      .map((name) => findPreviewPlace(name, places))
      .find((place): place is KtoPlace => Boolean(place)),
    [activeRegion, places],
  );
  const activePreview = (previewName ? findPreviewPlace(previewName, places) : undefined) ?? defaultPreview;
  const mapUrl = activePreview?.mapX && activePreview.mapY
    ? `https://map.kakao.com/link/map/${encodeURIComponent(activePreview.title)},${activePreview.mapY},${activePreview.mapX}`
    : activePreview ? `/places/${activePreview.contentId}` : '#';

  return (
    <section className={`regional-flow-section ${compact ? 'compact' : ''}`} id="regions">
      <div className="regional-flow-heading">
        <div>
          <p className="eyebrow">Pohang Area Recipe</p>
          <h2>권역별 흐름을 고르면, POING이 오늘의 시간에 맞춥니다.</h2>
        </div>
        <div className="region-tabs" role="tablist" aria-label="포항 권역 선택">
          {regionRoutes.map((region) => (
            <button
              aria-selected={region.id === activeRegion.id}
              className={region.id === activeRegion.id ? 'active' : ''}
              key={region.id}
              onClick={() => {
                setActiveId(region.id);
                setPreviewName(null);
              }}
              role="tab"
              type="button"
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`region-board accent-${activeRegion.accent}`}>
        {activePreview?.imageUrl && (
          <Image
            alt={`${activePreview.title} 실제 사진`}
            className="region-board-photo"
            fill
            key={activePreview.contentId}
            sizes="(max-width: 760px) 100vw, 1180px"
            src={activePreview.imageUrl}
            unoptimized
          />
        )}
        <div className="region-copy">
          <span className="region-kicker">권역별 즐겨퐝</span>
          <h3>
            {activeRegion.headline.split(activeRegion.keyword)[0]}
            <mark>{activeRegion.keyword}</mark>
            {activeRegion.headline.split(activeRegion.keyword)[1]}
          </h3>
          <p>{activeRegion.description}</p>
          {activePreview && (
            <a className="region-location-preview" href={mapUrl} rel="noreferrer" target={mapUrl.startsWith('http') ? '_blank' : undefined}>
              <span>LOCATION</span>
              <strong>{activePreview.title}</strong>
              <small>{activePreview.address}</small>
              <em>지도에서 위치 보기 ↗</em>
            </a>
          )}
          <div className="region-category-grid" aria-label={`${activeRegion.label} 테마`}>
            {activeRegion.categories.map((category) => (
              <span key={category.label}>
                <b>{category.mark}</b>
                {category.label}
              </span>
            ))}
          </div>
        </div>

        <div className="region-course-list">
          {activeRegion.courses.map((course) => (
            <article className={`region-course-row tone-${course.tone}`} key={course.label}>
              <strong>{course.label}</strong>
              <div>
                {course.places.map((placeName, index) => {
                  const matchedPlace = findPreviewPlace(placeName, places);
                  return (
                    <span key={`${course.label}-${placeName}`}>
                      <button
                        aria-label={matchedPlace ? `${placeName} 사진과 위치 보기` : placeName}
                        className={matchedPlace && activePreview?.contentId === matchedPlace.contentId ? 'active' : ''}
                        disabled={!matchedPlace}
                        onFocus={() => matchedPlace && setPreviewName(placeName)}
                        onMouseEnter={() => matchedPlace && setPreviewName(placeName)}
                        type="button"
                      >
                        {placeName}
                      </button>
                      {index < course.places.length - 1 && <i aria-hidden="true">→</i>}
                    </span>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
        {activePreview?.imageCredit && <span className="region-photo-credit">{activePreview.imageCredit}</span>}
      </div>
    </section>
  );
}
