'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageShell from '@/components/poing/PageShell';
import { apiPills, eventTrail, generationSteps, itineraryPlaces } from '@/lib/poing-content';

export default function GeneratingPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const result = useMemo(
    () => ({
      createdAt: new Date().toISOString(),
      places: itineraryPlaces,
      summary: '바다에서 시작해 노을과 시장으로 마무리하는 포항 하루',
    }),
    [],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current < generationSteps.length - 1) {
          return current + 1;
        }

        window.clearInterval(timer);
        window.sessionStorage.setItem('poing_result', JSON.stringify(result));
        window.setTimeout(() => router.push('/plan/confirm'), 650);
        return current;
      });
    }, 620);

    return () => window.clearInterval(timer);
  }, [result, router]);

  return (
    <PageShell
      active="generate"
      aside={
        <>
          <section className="panel dark">
            <h3>활용 데이터</h3>
            <p>화면이 기다림으로 끝나지 않도록, POING이 무엇을 보고 있는지 보여줍니다.</p>
            <div className="api-pills">
              {apiPills.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </section>

          <section className="panel soft">
            <span className="field-title">기록될 행동</span>
            <div className="mini-list">
              {eventTrail.slice(0, 3).map((event) => (
                <span key={event.key}>{event.label}</span>
              ))}
            </div>
          </section>
        </>
      }
      description="장소 후보, 연관 관광지, 방문자 흐름, 혼잡 예상, 이동 시간을 한 번에 맞춰 일정으로 엮습니다."
      eyebrow="Data matching"
      title="포항의 하루를 맞추고 있어요"
    >
      <section className="analysis-grid">
        {generationSteps.map((step, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <article
              className={`analysis-card ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
              key={step}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
              <p>{isDone ? '확인 완료' : isActive ? '현재 분석 중' : '다음 단계에서 확인'}</p>
            </article>
          );
        })}
      </section>

      <section className="panel">
        <span className="field-title">생성 방향</span>
        <h3>도착 후 바다, 노을 시간의 스페이스워크, 저녁 시장으로 이어집니다.</h3>
        <p>
          입력은 적게 받고 추천 근거는 내부에서 계산합니다. 사용자는 일정이 나온 뒤 필요한 장소만 바꾸면 됩니다.
        </p>
      </section>
    </PageShell>
  );
}
