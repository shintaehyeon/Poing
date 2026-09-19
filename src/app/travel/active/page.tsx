'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageShell from '@/components/poing/PageShell';
import PlaceThumb from '@/components/poing/PlaceThumb';
import RouteMap from '@/components/poing/RouteMap';
import { eventTrail } from '@/lib/poing-content';
import { persistTripUpdate, useTrip } from '@/lib/use-trip';

export default function ActiveTravelPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { trip, places } = useTrip();
  useEffect(() => {
    const saved = Number(window.sessionStorage.getItem('poing_current_index'));
    const timer = window.setTimeout(() => {
      if (Number.isInteger(saved) && saved >= 0) setCurrentIndex(Math.min(saved, places.length - 1));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [places.length]);
  const currentPlace = places[Math.min(currentIndex, places.length - 1)];
  const isLastPlace = currentIndex === places.length - 1;

  const moveNext = () => {
    const next = Math.min(currentIndex + 1, places.length - 1);
    setCurrentIndex(next);
    window.sessionStorage.setItem('poing_current_index', String(next));
    void persistTripUpdate(trip, { status: 'active', visited_places: places.slice(0, next).map((place) => place.name) });
  };

  return (
    <PageShell
      active="map"
      aside={
        <>
          <section className="panel soft">
            <span className="field-title">현재 진행</span>
            <ol className="run-list">
              {places.map((place, index) => (
                <li
                  className={index < currentIndex ? 'visited' : index === currentIndex ? 'now' : ''}
                  key={place.id}
                >
                  {place.name}
                </li>
              ))}
            </ol>
          </section>

          <section className="panel dark">
            <h3>기록되는 행동</h3>
            <div className="event-trail">
              {eventTrail.slice(3, 6).map((event) => (
                <span key={event.key}>{event.label}</span>
              ))}
            </div>
          </section>
        </>
      }
      description="여행 중에는 지도와 현재 진행만 크게 보여줍니다. 필요한 순간에만 길찾기, 다음 장소, 일정 변경을 누르면 됩니다."
      eyebrow="Live route"
      title={`지금은 ${currentPlace.name}에서 여행하는 중`}
    >
      <RouteMap large />

      <section className="panel">
        <span className="field-title">현재 장소</span>
        <div className="place-row compact">
          <PlaceThumb alt={currentPlace.imageAlt} src={currentPlace.imageUrl} tone={currentPlace.image} />
          <div>
            <span>{currentPlace.time}</span>
            <h3>{currentPlace.name}</h3>
            <p>{currentPlace.address}</p>
            {trip?.apiConnections?.routeSegments?.[currentIndex] && <p>
              다음 장소 이동: {trip.apiConnections.routeSegments[currentIndex].connected
                ? `${(trip.apiConnections.routeSegments[currentIndex].distanceMeters ?? 0) / 1000}km · ${Math.ceil((trip.apiConnections.routeSegments[currentIndex].durationSeconds ?? 0) / 60)}분 · ${trip.apiConnections.routeSegments[currentIndex].busLines?.join(', ') || trip.apiConnections.routeSegments[currentIndex].source}`
                : trip.apiConnections.routeSegments[currentIndex].message}
            </p>}
            <a className="source-link" href={currentPlace.sourceUrl} rel="noreferrer" target="_blank">
              공식 관광 정보
            </a>
          </div>
        </div>
        <div className="side-actions">
          <a
            className="secondary-action"
            href={trip?.apiConnections?.routeSegments?.[currentIndex]?.landingUrl || `https://map.kakao.com/link/search/${encodeURIComponent(currentPlace.name + ' 포항')}`}
            rel="noreferrer"
            target="_blank"
          >
            길찾기
          </a>
          {isLastPlace ? (
            <Link className="primary-action" href="/travel/finish">
              여행 종료하기
            </Link>
          ) : (
            <button className="primary-action" onClick={moveNext} type="button">
              다음 장소
            </button>
          )}
        </div>
        <Link className="secondary-action full" href="/travel/modify">
          일정 수정하기
        </Link>
      </section>
    </PageShell>
  );
}
