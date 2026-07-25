'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ModifyTravelPage() {
  const router = useRouter();
  const [selectedAlternative, setSelectedAlternative] = useState<string>('hwanho_art');

  const alternatives = [
    {
      id: 'hwanho_art',
      title: '환호공원 미술관 & 조각공원',
      category: '문화/산책',
      travelTimeMinutes: 3,
      congestion: '여유',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      reason: '스페이스워크 바로 밑 3분 거리. 현재 혼잡도 [여유] 상태로 대기 없이 조각 예술품 감상 가능.'
    },
    {
      id: 'yeonam_cafe',
      title: '여남 해안 카페거리',
      category: '카페/뷰',
      travelTimeMinutes: 6,
      congestion: '보통',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      reason: '영일만 오션뷰 카페 탐방. 이동 시간 6분으로 다음 일정인 영일대 야경 코스와 최단 바인딩.'
    }
  ];

  const handleApplyChange = () => {
    // Apply changes in prototype session state
    router.push('/travel/active');
  };

  return (
    <div style={{ padding: '20px 20px 32px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
      {/* Top Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/travel/active" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '1.2rem' }}>
          ←
        </Link>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>실시간 일정 수정 & 대체 추천</h2>
      </header>

      {/* Smart Congestion Alert Banner */}
      <section className="glass-card" style={{ padding: '16px', border: '1.5px solid #FF1744', background: 'rgba(255, 23, 68, 0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF1744', fontWeight: 800, fontSize: '0.9rem' }}>
          <span>🚨</span> 관광지 집중률 예측 API 혼잡 경보
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginTop: '6px' }}>
          현재 스페이스워크 [매우 혼잡] (대기 40분)
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#CBD5E1', marginTop: '4px', lineHeight: 1.4 }}>
          POING AI가 대기 시간을 줄이고 동선을 보존할 수 있는 대체 장소를 우회 추천합니다.
        </p>
      </section>

      {/* Alternative Options Selection */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#CBD5E1' }}>💡 AI 대체 추천 장소 목록</div>

        {alternatives.map((alt) => {
          const isSelected = selectedAlternative === alt.id;
          return (
            <div
              key={alt.id}
              onClick={() => setSelectedAlternative(alt.id)}
              className="glass-card"
              style={{
                padding: '14px',
                display: 'flex',
                gap: '14px',
                cursor: 'pointer',
                border: isSelected ? '2px solid #00C6FF' : '1px solid var(--bg-glass-border)',
                background: isSelected ? 'rgba(0, 102, 255, 0.2)' : 'var(--bg-glass)'
              }}
            >
              <div style={{ width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={alt.image} alt={alt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.7rem', color: '#00C6FF', fontWeight: 700 }}>
                      🚗 이동 {alt.travelTimeMinutes}분 | 혼잡 [{alt.congestion}]
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
                    {alt.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', lineHeight: 1.3 }}>
                  {alt.reason}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Re-routing preview summary */}
      <div className="glass-card" style={{ padding: '14px', background: 'rgba(0, 230, 118, 0.1)', border: '1px solid rgba(0, 230, 118, 0.3)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00E676' }}>✅ 동선 재계산 효과</div>
        <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '4px' }}>
          • 대기 시간 <b>40분 절감</b><br />
          • 다음 장소(영일대) 이동 시간 <b>6분 최단 연계 유지</b>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleApplyChange}
          className="glass-button-primary"
          style={{ flex: 1 }}
        >
          <span>✨ 이 장소로 변경 & 동선 재계산</span>
        </button>
      </div>
    </div>
  );
}
