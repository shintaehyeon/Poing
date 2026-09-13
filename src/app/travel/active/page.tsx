'use client';

import Link from 'next/link';
import { useState } from 'react';
import PageShell from '@/components/poing/PageShell';
import PlaceThumb from '@/components/poing/PlaceThumb';
import RouteMap from '@/components/poing/RouteMap';
import { eventTrail, itineraryPlaces } from '@/lib/poing-content';

export default function ActiveTravelPage() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const currentPlace = itineraryPlaces[currentIndex];
  const isLastPlace = currentIndex === itineraryPlaces.length - 1;

  const moveNext = () => {
    setCurrentIndex((index) => Math.min(index + 1, itineraryPlaces.length - 1));
  };

  return (
    <PageShell
      active="map"
      aside={
        <>
          <section className="panel soft">
            <span className="field-title">현재 진행</span>
            <ol className="run-list">
              {itineraryPlaces.map((place, index) => (
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
      title="지금은 스페이스워크로 가는 중이에요"
    >
      <RouteMap large />

      <section className="panel">
        <span className="field-title">현재 장소</span>
        <div className="place-row compact">
          <PlaceThumb tone={currentPlace.image} />
          <div>
            <span>{currentPlace.time}</span>
            <h3>{currentPlace.name}</h3>
            <p>{currentPlace.address}</p>
          </div>
        </div>
        <div className="side-actions">
          <button type="button">길찾기</button>
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
