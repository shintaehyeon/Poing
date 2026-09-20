'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getPohangSunTimes, type PohangSunTimes } from '@/lib/pohang-sun';

type SunTimesProps = {
  variant?: 'hero' | 'panel' | 'inline';
  photo?: {
    src: string;
    alt: string;
    credit?: string;
  };
};

export default function SunTimes({ variant = 'panel', photo }: SunTimesProps) {
  const [sun, setSun] = useState<PohangSunTimes>(() => getPohangSunTimes());

  useEffect(() => {
    let active = true;

    fetch('/api/pohang/sun')
      .then((response) => response.json())
      .then((data: PohangSunTimes) => {
        if (active) {
          setSun(data);
        }
      })
      .catch(() => {
        if (active) {
          setSun(getPohangSunTimes());
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className={`sun-card ${variant}${photo ? ' with-photo' : ''}`} aria-label="오늘의 호미곶 일출과 일몰">
      {variant === 'hero' && photo && (
        <div className="sun-card-photo">
          <Image alt={photo.alt} fill priority sizes="360px" src={photo.src} unoptimized />
          <div className="sun-card-photo-copy">
            <span>오늘의 일출 명소</span>
            <strong>{sun.location}</strong>
          </div>
          {photo.credit && <small>{photo.credit}</small>}
        </div>
      )}
      <div className="sun-card-content">
        <div className="sun-card-head">
          <span>{sun.dateLabel}</span>
          <strong>{sun.location}</strong>
        </div>
        <div className="sun-metrics">
          <div>
            <span>일출</span>
            <strong>{sun.sunrise}</strong>
            <small>{sun.blueHour}</small>
          </div>
          <div>
            <span>일몰</span>
            <strong>{sun.sunset}</strong>
            <small>{sun.goldenHour}</small>
          </div>
          <div>
            <span>남중</span>
            <strong>{sun.solarNoon}</strong>
            <small>빛이 가장 높은 시간</small>
          </div>
        </div>
        <p>해맞이는 일출 30분 전, 노을뷰는 일몰 50분 전부터 여정에 반영합니다.</p>
        <em>{sun.source}</em>
      </div>
    </section>
  );
}
