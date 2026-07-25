'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generatePOINGItinerary } from '@/lib/ai-engine';

export default function GeneratingPage() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { title: '국문 관광정보 API 연동', detail: '포항 대표 관광지 후보 수집 중...', badge: 'TourAPI 4.0' },
    { title: '관광지별 연관 관광지 분석', detail: '죽도시장 ➔ 영일대 ➔ 환호공원 연계 노드 탐색...', badge: '빅데이터 랩' },
    { title: '지역별 방문자수 흐름 확인', detail: '포항 방문자 상위 인기 스팟 지수 산출 중...', badge: '방문자 API' },
    { title: '관광지 집중률 예측 및 혼잡 우회', detail: '14시 스페이스워크 피크 타임 우회 동선 계산...', badge: '집중률 API' },
    { title: '카카오모빌리티 최단 경로 계산', detail: '이동 시간 26분 절감 최적 경로 바인딩...', badge: 'Mobility' },
    { title: 'POING AI 일정 생성 완수!', detail: '나만의 맞춤 포항 여행 일정을 펼칩니다...', badge: 'AI Fusion' }
  ];

  useEffect(() => {
    // 1. Read condition from sessionStorage
    const saved = sessionStorage.getItem('poing_condition');
    const condition = saved ? JSON.parse(saved) : { durationDays: 1, arrivalTime: '10:00', transport: '차량(자차/렌트)', companion: '커플/친구', selectedTags: [] };

    // 2. Step by step progress timer
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          
          // Generate plan and save in sessionStorage
          const generated = generatePOINGItinerary(condition);
          sessionStorage.setItem('poing_result', JSON.stringify(generated));
          
          setTimeout(() => {
            router.push('/plan/confirm');
          }, 800);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '28px' }}>
      
      {/* Live Pulsing Data Fusion Orb */}
      <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div 
          className="live-pulse" 
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #0066FF, #00C6FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: 'var(--glow-primary)'
          }}
        >
          🔮
        </div>
      </div>

      {/* Main Status Text */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
          POING AI가 일정을 만드는 중입니다
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '6px' }}>
          한국관광공사 OpenAPI 5종과 실시간 데이터를 융합하고 있습니다
        </p>
      </div>

      {/* Live Data Processing Nodes Checklist */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: isCurrent ? '1.5px solid #00C6FF' : isDone ? '1px solid rgba(0, 230, 118, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isCurrent ? 'rgba(0, 102, 255, 0.2)' : isDone ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                opacity: idx > currentStepIndex ? 0.4 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.1rem' }}>
                  {isDone ? '✅' : isCurrent ? '⚡' : '⏳'}
                </span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isCurrent ? '#00C6FF' : '#FFF' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                    {step.detail}
                  </div>
                </div>
              </div>

              <span style={{ 
                fontSize: '0.7rem', 
                padding: '3px 8px', 
                borderRadius: '8px', 
                background: isCurrent ? '#0066FF' : 'rgba(255,255,255,0.1)',
                color: isCurrent ? '#FFF' : '#CBD5E1',
                fontWeight: 600
              }}>
                {step.badge}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
