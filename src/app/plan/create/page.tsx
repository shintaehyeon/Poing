'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageShell from '@/components/poing/PageShell';
import PlaceThumb from '@/components/poing/PlaceThumb';
import SunTimes from '@/components/poing/SunTimes';
import { apiPills, createOptions, itineraryPlaces } from '@/lib/poing-content';

type TripCondition = {
  duration: string;
  arrivalTime: string;
  transport: string;
  companion: string;
};

export default function CreatePlanPage() {
  const router = useRouter();
  const [condition, setCondition] = useState<TripCondition>({
    duration: createOptions.duration[0],
    arrivalTime: '14:30',
    transport: createOptions.transport[0],
    companion: createOptions.companion[1],
  });

  const updateCondition = (key: keyof TripCondition, value: string) => {
    setCondition((current) => ({ ...current, [key]: value }));
  };

  const startGeneration = () => {
    window.sessionStorage.setItem('poing_condition', JSON.stringify(condition));
    router.push('/plan/generating');
  };

  return (
    <PageShell
      active="create"
      aside={
        <>
          <SunTimes />

          <section className="panel soft">
            <span className="field-title">오늘의 기본 흐름</span>
            <div className="route-list">
              {itineraryPlaces.map((place) => (
                <div key={place.id}>
                  <strong>{place.time}</strong>
                  <span>{place.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel dark">
            <h3>POING이 참고할 데이터</h3>
            <p>사용자가 입력을 많이 하지 않아도 장소, 사진, 이동 시간, 혼잡 흐름을 함께 봅니다.</p>
            <div className="api-pills">
              {apiPills.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </section>
        </>
      }
      description="기간, 도착 시간, 이동수단, 동행만 선택하면 POING이 포항의 시간 흐름에 맞춰 일정을 만듭니다."
      eyebrow="Trip setup"
      title="언제 포항에 도착하세요?"
    >
      <section className="panel">
        <div>
          <p className="field-title">여행 기간</p>
          <div className="choice-grid three">
            {createOptions.duration.map((option) => (
              <button
                className={condition.duration === option ? 'selected' : ''}
                key={option}
                onClick={() => updateCondition('duration', option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <label>
          <span className="field-title">도착 시간</span>
          <div className="time-field">
            <span>포항 도착 예정</span>
            <input
              aria-label="도착 시간"
              onChange={(event) => updateCondition('arrivalTime', event.target.value)}
              type="time"
              value={condition.arrivalTime}
            />
          </div>
        </label>

        <div>
          <p className="field-title">이동 수단</p>
          <div className="choice-grid three">
            {createOptions.transport.map((option) => (
              <button
                className={condition.transport === option ? 'selected' : ''}
                key={option}
                onClick={() => updateCondition('transport', option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="field-title">동행</p>
          <div className="choice-grid two">
            {createOptions.companion.map((option) => (
              <button
                className={condition.companion === option ? 'selected' : ''}
                key={option}
                onClick={() => updateCondition('companion', option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button className="primary-action" onClick={startGeneration} type="button">
          내 포항 여행 만들기
        </button>
      </section>

      <section className="panel soft">
        <span className="field-title">도착 후 첫 장면</span>
        <div className="place-row compact">
          <PlaceThumb
            alt={itineraryPlaces[0].imageAlt}
            src={itineraryPlaces[0].imageUrl}
            tone={itineraryPlaces[0].image}
          />
          <div>
            <strong>영일대</strong>
            <p>도착 시간에 맞춰 무리 없는 산책 코스로 시작합니다.</p>
            <a className="source-link" href={itineraryPlaces[0].sourceUrl} rel="noreferrer" target="_blank">
              {itineraryPlaces[0].sourceTag}
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
