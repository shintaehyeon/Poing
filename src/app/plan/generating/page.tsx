'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageShell from '@/components/poing/PageShell';
import { apiPills, eventTrail, generationSteps, itineraryPlaces } from '@/lib/poing-content';
import type { GeneratedTrip } from '@/lib/use-trip';

export default function GeneratingPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [generatedTrip, setGeneratedTrip] = useState<GeneratedTrip | null>(null);

  const fallbackResult = useMemo(
    () => ({
      generatedAt: new Date().toISOString(),
      places: itineraryPlaces,
      summary: '바다에서 시작해 노을과 시장으로 마무리하는 포항 하루',
    }),
    [],
  );

  useEffect(() => {
    const condition = window.sessionStorage.getItem('poing_condition');

    fetch('/api/trips/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: condition ?? '{}',
    })
      .then((response) => response.json())
      .then((data: GeneratedTrip) => setGeneratedTrip(data))
      .catch(() => setGeneratedTrip(fallbackResult));
  }, [fallbackResult]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current < generationSteps.length - 1) {
          return current + 1;
        }

        window.clearInterval(timer);
        return current;
      });
    }, 620);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeIndex !== generationSteps.length - 1 || !generatedTrip) {
      return;
    }

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem('poing_result', JSON.stringify(generatedTrip));
      router.push('/plan/confirm');
    }, 650);

    return () => window.clearTimeout(timer);
  }, [activeIndex, generatedTrip, router]);

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
            <span className="field-title">실시간 연결 결과</span>
            {generatedTrip ? (
              <div className="integration-checks">
                <span className={generatedTrip.apiConnections?.tour?.connected ? 'ok' : ''}>관광지·사진</span>
                <span className={generatedTrip.apiConnections?.related?.connected ? 'ok' : ''}>연관 관광지</span>
                <span className={generatedTrip.apiConnections?.congestion?.connected ? 'ok' : ''}>혼잡 예측</span>
                <span className={generatedTrip.apiConnections?.visitors?.connected ? 'ok' : ''}>방문자 수</span>
                <span className={generatedTrip.apiConnections?.route?.connected ? 'ok' : ''}>길찾기</span>
                <span className={generatedTrip.apiConnections?.aiSummary?.connected ? 'ok' : ''}>AI 문장</span>
                <span className={generatedTrip.apiConnections?.persistence?.connected ? 'ok' : ''}>여행 저장</span>
              </div>
            ) : (
              <div className="mini-list">
                {eventTrail.slice(0, 3).map((event) => <span key={event.key}>{event.label}</span>)}
              </div>
            )}
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
        <h3>후기에서 반복되는 만족 포인트를 포항의 시간 순서로 다시 엮습니다.</h3>
        <p>
          POING은 동행, 목적, 도착 시간, 일출·일몰, 혼잡 예측 흐름을 한 번에 맞춰 바로 움직일 수 있는
          하루 코스로 정리합니다.
        </p>
      </section>
    </PageShell>
  );
}
