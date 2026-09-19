'use client';

import { useMemo, useState } from 'react';
import { regionRoutes } from '@/lib/poing-content';

type RegionalFlowProps = {
  compact?: boolean;
};

export default function RegionalFlow({ compact = false }: RegionalFlowProps) {
  const [activeId, setActiveId] = useState(regionRoutes[0].id);
  const activeRegion = useMemo(
    () => regionRoutes.find((region) => region.id === activeId) ?? regionRoutes[0],
    [activeId],
  );

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
              onClick={() => setActiveId(region.id)}
              role="tab"
              type="button"
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`region-board accent-${activeRegion.accent}`}>
        <div className="region-copy">
          <span className="region-kicker">권역별 즐겨퐝</span>
          <h3>
            {activeRegion.headline.split(activeRegion.keyword)[0]}
            <mark>{activeRegion.keyword}</mark>
            {activeRegion.headline.split(activeRegion.keyword)[1]}
          </h3>
          <p>{activeRegion.description}</p>
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
                {course.places.map((place, index) => (
                  <span key={`${course.label}-${place}`}>
                    {place}
                    {index < course.places.length - 1 && <i aria-hidden="true">→</i>}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
