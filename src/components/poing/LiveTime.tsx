'use client';

import { useEffect, useState } from 'react';

const getSeoulTime = () => {
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now);
  const date = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(now);

  return { time, date };
};

export default function LiveTime({ compact = false }: { compact?: boolean }) {
  const [seoul, setSeoul] = useState({ time: '--:--', date: '서울' });

  useEffect(() => {
    const initial = window.setTimeout(() => setSeoul(getSeoulTime()), 0);
    const interval = window.setInterval(() => setSeoul(getSeoulTime()), 30_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className={compact ? 'live-chip compact' : 'live-chip'}>
      <strong>{seoul.time}</strong>
      <span>POHANG</span>
      {!compact && <small>{seoul.date}</small>}
    </div>
  );
}
