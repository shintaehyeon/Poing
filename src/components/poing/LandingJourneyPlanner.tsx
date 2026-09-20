'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const regionOptions = ['구도심', '북포항', '남포항', '힐링코스'];
const durationOptions = ['당일치기', '1박2일', '2박3일+'];
const companionOptions = ['혼자', '연인', '친구', '가족', '단체'];
const transportOptions = ['자차', '대중교통', '도보 중심'];

export default function LandingJourneyPlanner() {
  const router = useRouter();
  const [region, setRegion] = useState('구도심');
  const [duration, setDuration] = useState('당일치기');
  const [companion, setCompanion] = useState('연인');
  const [transport, setTransport] = useState('대중교통');

  const startJourney = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const purpose = companion === '연인' ? '인생샷 찍기' : companion === '가족' ? '힐링/산책' : '체험/액티비티';
    window.sessionStorage.setItem('poing_condition', JSON.stringify({
      region,
      duration,
      arrivalTime: '14:30',
      transport,
      companion,
      purpose,
    }));
    router.push('/plan/generating');
  };

  return (
    <form className="landing-journey-planner" onSubmit={startJourney}>
      <div className="landing-planner-title">
        <span>START POING</span>
        <strong>오늘의 포항을 맞춰볼까요?</strong>
      </div>
      <label>
        <span>권역</span>
        <select aria-label="포항 권역" onChange={(event) => setRegion(event.target.value)} value={region}>
          {regionOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label>
        <span>기간</span>
        <select aria-label="여행 기간" onChange={(event) => setDuration(event.target.value)} value={duration}>
          {durationOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label>
        <span>동행</span>
        <select aria-label="여행 동행" onChange={(event) => setCompanion(event.target.value)} value={companion}>
          {companionOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label>
        <span>이동</span>
        <select aria-label="이동 수단" onChange={(event) => setTransport(event.target.value)} value={transport}>
          {transportOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <button type="submit">내 여정 만들기 <span aria-hidden="true">→</span></button>
    </form>
  );
}
