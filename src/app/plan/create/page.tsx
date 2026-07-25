'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreatePlanPage() {
  const router = useRouter();

  // Current Step Index (0 ~ 4: 총 5단계 문답 Wizard)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Form State
  const [durationDays, setDurationDays] = useState<number | string>(1);
  const [arrivalTime, setArrivalTime] = useState<string>('10:00');
  const [transport, setTransport] = useState<'차량(자차/렌트)' | '대중교통/도보'>('차량(자차/렌트)');
  const [companion, setCompanion] = useState<'혼자' | '커플/친구' | '가족'>('커플/친구');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#바다뷰', '#식도락_죽도시장']);

  // 키워드 옵션 & 공사 빅데이터 베스트 추천 뱃지
  const tagOptions = [
    { tag: '#스페이스워크_야경', rank: '🔥 이번 주 1위', isBest: true },
    { tag: '#바다뷰', rank: '👑 BEST 1위', isBest: true },
    { tag: '#식도락_죽도시장', rank: '👑 BEST 2위', isBest: true },
    { tag: '#동해일출', rank: '👑 BEST 3위', isBest: true },
    { tag: '#야경', isBest: false },
    { tag: '#힐링산책', isBest: false },
    { tag: '#혼잡피하기', isBest: false }
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCreatePlan = () => {
    const condition = {
      durationDays: typeof durationDays === 'number' ? durationDays : 3, // 4일 이상인 경우 3일+로 처리
      arrivalTime,
      transport,
      companion,
      selectedTags,
    };

    sessionStorage.setItem('poing_condition', JSON.stringify(condition));
    router.push('/plan/generating');
  };

  // Progress Bar Percentage
  const progressPercent = ((currentStep + 1) / 5) * 100;

  return (
    <div style={{ padding: '20px 20px 32px', display: 'flex', flexDirection: 'column', minHeight: '100vh', gap: '24px', flex: 1 }}>
      
      {/* Top Header & Progress Bar */}
      <header style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentStep === 0 ? (
            <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← 메인
            </Link>
          ) : (
            <button
              onClick={prevStep}
              style={{ background: 'none', border: 'none', color: '#00C6FF', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 700 }}
            >
              ← 이전 질문
            </button>
          )}

          <span style={{ fontSize: '0.8rem', color: '#FFB020', fontWeight: 800 }}>
            {currentStep + 1} / 5 단계
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #0066FF, #00C6FF)',
              borderRadius: '10px',
              transition: 'width 0.35s ease'
            }}
          />
        </div>
      </header>

      {/* Main Interactive Animated Q&A Cards */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* STEP 1: 여행 기간 */}
        {currentStep === 0 && (
          <section key="step1" className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#00C6FF', fontWeight: 800 }}>STEP 1. 여행 기간</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', marginTop: '4px', lineHeight: 1.35 }}>
                포항 여행,<br />며칠 동안 떠나시나요? 🗓️
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '6px' }}>
                원하시는 여행 일정을 선택해 주세요
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { day: 1, label: '당일치기 포항 코스 (1일)', desc: '핵심 핫플과 물회/야경 알차게 즐기기' },
                { day: 2, label: '1박 2일 포항 힐링 코스 (2일)', desc: '해맞이부터 감성 카페, 동해 바다 완벽 탐방' },
                { day: 3, label: '2박 3일 여유 여행 (3일)', desc: '포항 구석구석 모든 스팟과 휴식까지' },
                { day: '4일이상', label: '4일 이상 장기 여행 / 해당 없음 🌊', desc: '포항 장기 체류 및 맞춤 힐링 스팟 추천' }
              ].map((item) => (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => {
                    setDurationDays(item.day as any);
                    nextStep();
                  }}
                  className="glass-card"
                  style={{
                    padding: '16px 18px',
                    textAlign: 'left',
                    border: durationDays === item.day ? '2px solid #00C6FF' : '1px solid var(--bg-glass-border)',
                    background: durationDays === item.day ? 'rgba(0, 102, 255, 0.25)' : 'var(--bg-glass)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: durationDays === item.day ? '#00C6FF' : '#FFF' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* STEP 2: 포항 도착 시간 */}
        {currentStep === 1 && (
          <section key="step2" className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#00C6FF', fontWeight: 800 }}>STEP 2. 도착 시간</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', marginTop: '4px', lineHeight: 1.35 }}>
                포항에 몇 시쯤<br />도착할 예정이신가요? ⏰
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '6px' }}>
                도착 시각에 맞춰 점심/저녁 동선을 맞춤 배치합니다
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { time: '09:00', label: '오전 9시 이전', icon: '🌅' },
                { time: '10:00', label: '오전 10시 경', icon: '☀️' },
                { time: '12:00', label: '점심 12시 경', icon: '🍱' },
                { time: '14:00', label: '오후 2시 경', icon: '☕' },
                { time: '18:00', label: '오후 6시 이후 (야경 코스)', icon: '🌙' }
              ].map((item) => (
                <button
                  key={item.time}
                  type="button"
                  onClick={() => {
                    setArrivalTime(item.time);
                    nextStep();
                  }}
                  className="glass-card"
                  style={{
                    padding: '16px 12px',
                    textAlign: 'center',
                    border: arrivalTime === item.time ? '2px solid #00C6FF' : '1px solid var(--bg-glass-border)',
                    background: arrivalTime === item.time ? 'rgba(0, 102, 255, 0.25)' : 'var(--bg-glass)',
                    cursor: 'pointer',
                    gridColumn: item.time === '18:00' ? 'span 2' : 'auto'
                  }}
                >
                  <div style={{ fontSize: '1.4rem' }}>{item.icon}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>{item.time}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{item.label}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* STEP 3: 이동 수단 */}
        {currentStep === 2 && (
          <section key="step3" className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#00C6FF', fontWeight: 800 }}>STEP 3. 이동 수단</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', marginTop: '4px', lineHeight: 1.35 }}>
                포항 내에서 어떻게<br />이동하실 계획인가요? 🚗
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '6px' }}>
                이동 수단에 맞는 최적 이동 시간을 계산합니다
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { type: '차량(자차/렌트)', label: '🚘 자차 / 렌트카 이용', desc: '주차장이 편리하고 이동시간이 최적화된 동선' },
                { type: '대중교통/도보', label: '🚌 대중교통 / 도보 / 택시', desc: '버스 환승 및 도보 접근성이 뛰어난 추천 코스' }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setTransport(item.type as any);
                    nextStep();
                  }}
                  className="glass-card"
                  style={{
                    padding: '20px',
                    textAlign: 'left',
                    border: transport === item.type ? '2px solid #00C6FF' : '1px solid var(--bg-glass-border)',
                    background: transport === item.type ? 'rgba(0, 102, 255, 0.25)' : 'var(--bg-glass)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: transport === item.type ? '#00C6FF' : '#FFF' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* STEP 4: 동행 유형 */}
        {currentStep === 3 && (
          <section key="step4" className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#00C6FF', fontWeight: 800 }}>STEP 4. 동행 유형</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', marginTop: '4px', lineHeight: 1.35 }}>
                누구와 함께하는<br />포항 여행인가요? 👥
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '6px' }}>
                동행 스타일에 맞는 장소 체류시간을 설정합니다
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { comp: '혼자', label: '🙋‍♂️ 혼자 떠나는 힐링', desc: '여유로운 산책과 나만의 인생샷 스팟 위주' },
                { comp: '커플/친구', label: '👫 커플 / 친구와 함께', desc: '핫플레이스, 맛집, 야경 감성 가득한 데이트 코스' },
                { comp: '가족', label: '👨‍👩‍👧‍👦 가족과 함께', desc: '편안한 이동 동선과 체험형 명소 위주' }
              ].map((item) => (
                <button
                  key={item.comp}
                  type="button"
                  onClick={() => {
                    setCompanion(item.comp as any);
                    nextStep();
                  }}
                  className="glass-card"
                  style={{
                    padding: '18px',
                    textAlign: 'left',
                    border: companion === item.comp ? '2px solid #00C6FF' : '1px solid var(--bg-glass-border)',
                    background: companion === item.comp ? 'rgba(0, 102, 255, 0.25)' : 'var(--bg-glass)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: companion === item.comp ? '#00C6FF' : '#FFF' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* STEP 5: 취향 키워드 선택 (빅데이터 BEST 뱃지) */}
        {currentStep === 4 && (
          <section key="step5" className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#FFB020', fontWeight: 800 }}>FINAL STEP. 취향 선택</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', marginTop: '4px', lineHeight: 1.35 }}>
                포항에서 꼭 즐기고 싶은<br />키워드를 선택해 주세요 ✨
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#00C6FF', marginTop: '4px', fontWeight: 700 }}>
                📊 한국관광공사 검색 빅데이터 기반 추천 키워드가 표시됩니다
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {tagOptions.map((item) => {
                const isSelected = selectedTags.includes(item.tag);
                return (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => toggleTag(item.tag)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '24px',
                      border: isSelected ? '2px solid #FF5E36' : '1px solid rgba(255, 255, 255, 0.15)',
                      background: isSelected ? 'rgba(255, 94, 54, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#FF5E36' : '#CBD5E1',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 800 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {item.rank && (
                      <span style={{ 
                        fontSize: '0.65rem', 
                        padding: '2px 6px', 
                        borderRadius: '10px', 
                        background: item.rank.includes('1위') ? '#FF5E36' : '#FFB020', 
                        color: '#FFF', 
                        fontWeight: 800 
                      }}>
                        {item.rank}
                      </span>
                    )}
                    <span>{item.tag}</span>
                    {isSelected && <span>✓</span>}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                onClick={handleCreatePlan}
                className="glass-button-primary"
                style={{ padding: '18px' }}
              >
                <span>🚀 AI 포항 여행 동선 만들기</span>
              </button>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
