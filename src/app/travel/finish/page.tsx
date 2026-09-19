'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageShell from '@/components/poing/PageShell';
import RouteMap from '@/components/poing/RouteMap';
import { eventTrail } from '@/lib/poing-content';
import { persistTripUpdate, useTrip } from '@/lib/use-trip';

export default function TravelFinishPage() {
  const [rating, setRating] = useState(5);
  const [saved, setSaved] = useState(false);
  const [review, setReview] = useState('');
  const [status, setStatus] = useState('');
  const [storedTrips, setStoredTrips] = useState<Array<{ id: string; summary?: string; rating?: number; status?: string; local?: boolean }>>([]);
  const { trip, places } = useTrip();

  useEffect(() => {
    let local: typeof storedTrips = [];
    try { local = (JSON.parse(window.localStorage.getItem('poing_local_records') ?? '[]') as typeof storedTrips).map((item) => ({ ...item, local: true })); } catch {}
    fetch('/api/trips/records')
      .then((response) => response.json())
      .then((data: { trips?: typeof storedTrips }) => setStoredTrips([...(data.trips ?? []), ...local.filter((item) => !(data.trips ?? []).some((server) => server.id === item.id))]))
      .catch(() => setStoredTrips(local));
  }, [saved]);

  const saveMemory = async () => {
    setStatus('저장 중');
    try {
      const result = await persistTripUpdate(trip, {
        status: 'finished',
        rating,
        review,
        visited_places: places.map((place) => place.name),
      });
      setSaved(result.connected || Boolean(result.local));
      setStatus(result.connected ? '여행과 후기가 서버에 저장되었습니다.' : result.message);
    } catch {
      setStatus('서버 저장을 완료하지 못했습니다.');
    }
  };

  const shareMemory = async () => {
    const text = `${trip?.summary ?? '포항 여행'} · POING`;
    if (navigator.share) {
      await navigator.share({ title: '나의 포항', text, url: window.location.origin }).catch(() => null);
    } else {
      await navigator.clipboard.writeText(text).then(() => setStatus('여행 문구를 복사했습니다.')).catch(() => setStatus('공유할 수 없습니다.'));
    }
  };

  return (
    <PageShell
      active="memory"
      aside={
        <>
          <RouteMap />
          <section className="panel dark">
            <h3>여행에서 남긴 기록</h3>
            <div className="event-trail">
              {eventTrail.slice(4).map((event) => (
                <span key={event.key}>{event.label}</span>
              ))}
            </div>
          </section>
        </>
      }
      description="방문 장소와 후기를 기록합니다. 서버 저장이 연결되지 않은 경우 저장 실패를 분명히 알려드립니다."
      eyebrow="Memory"
      title="오늘의 포항을 기록해요"
    >
      <section className="memory-layout">
        <article className="memory-card">
          <span>{trip?.generatedAt ? new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeZone: 'Asia/Seoul' }).format(new Date(trip.generatedAt)) : '여행 날짜'}</span>
          <h3>{trip?.summary ?? '포항에서 보낸 하루'}</h3>
          <div className="memory-stack">
            {places.map((place) => (
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
              onChange={(event) => setReview(event.target.value)}
              placeholder="오늘 가장 좋았던 순간을 남겨보세요"
              value={review}
            />
          </label>
          <div className="side-actions">
            <button className="primary-action" onClick={saveMemory} type="button">
              {saved ? '저장 완료' : '여행 저장하기'}
            </button>
            <button onClick={shareMemory} type="button">공유하기</button>
          </div>
          {status && <p aria-live="polite">{status}</p>}
        </section>
      </section>

      <section className="panel">
        <span className="field-title">나의 포항 기록</span>
        <div className="record-list">
          {storedTrips.length ? storedTrips.map((item) => (
            <div key={item.id}>
              <strong>{item.summary || '포항에서 보낸 하루'}</strong>
              <span>{item.status === 'finished' ? `여행 완료 · ${item.rating ?? '-'}점` : '여행 계획'} · {item.local ? '이 기기에 저장' : '서버 저장'}</span>
            </div>
          )) : <p>저장한 기록이 아직 없습니다.</p>}
        </div>
        <Link className="secondary-action full" href="/">
          처음으로 돌아가기
        </Link>
      </section>
    </PageShell>
  );
}
