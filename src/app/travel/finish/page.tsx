'use client';

import Link from 'next/link';
import { useState } from 'react';
import PageShell from '@/components/poing/PageShell';
import RouteMap from '@/components/poing/RouteMap';
import { eventTrail, itineraryPlaces, records } from '@/lib/poing-content';

export default function TravelFinishPage() {
  const [rating, setRating] = useState(5);
  const [saved, setSaved] = useState(false);

  return (
    <PageShell
      active="memory"
      aside={
        <>
          <RouteMap />
          <section className="panel dark">
            <h3>다음 추천에 반영</h3>
            <div className="event-trail">
              {eventTrail.slice(4).map((event) => (
                <span key={event.key}>{event.label}</span>
              ))}
            </div>
          </section>
        </>
      }
      description="방문 장소, 실제 진행 순서, 별점, 한 줄 후기를 저장해 다음 추천에 다시 반영합니다."
      eyebrow="Memory"
      title="오늘의 포항이 기록으로 남았어요"
    >
      <section className="memory-layout">
        <article className="memory-card">
          <span>2026 여름</span>
          <h3>바다에서 시작해 시장의 불빛으로 끝난 하루</h3>
          <div className="memory-stack">
            {itineraryPlaces.map((place) => (
              <div key={place.id}>
                <strong>{place.name}</strong>
                <span>{place.time}</span>
              </div>
            ))}
          </div>
        </article>

        <section className="panel">
          <span className="field-title">오늘의 별점</span>
          <div aria-label={`${rating}점`} className="rating">
            {'★'.repeat(rating)}
            {'☆'.repeat(5 - rating)}
          </div>
          <div className="feedback-row">
            {[3, 4, 5].map((score) => (
              <button
                className={rating === score ? 'selected' : ''}
                key={score}
                onClick={() => setRating(score)}
                type="button"
              >
                {score}점
              </button>
            ))}
          </div>
          <label>
            <span className="field-title">한 줄 후기</span>
            <textarea
              className="note-field"
              defaultValue="영일대 산책과 스페이스워크 노을, 죽도시장 저녁까지 자연스럽게 이어졌어요."
            />
          </label>
          <div className="side-actions">
            <button className="primary-action" onClick={() => setSaved(true)} type="button">
              {saved ? '저장 완료' : '여행 저장하기'}
            </button>
            <button type="button">공유하기</button>
          </div>
        </section>
      </section>

      <section className="panel">
        <span className="field-title">나의 포항 기록</span>
        <div className="record-list">
          {records.map((record) => (
            <div key={record.title}>
              <strong>{record.title}</strong>
              <span>{record.meta}</span>
            </div>
          ))}
        </div>
        <Link className="secondary-action full" href="/">
          처음으로 돌아가기
        </Link>
      </section>
    </PageShell>
  );
}
