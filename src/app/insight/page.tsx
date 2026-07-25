'use client';

import Link from 'next/link';

export default function InsightPage() {
  return (
    <div style={{ padding: '20px 20px 36px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
      {/* Top Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/plan/confirm" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '1.2rem' }}>
          ←
        </Link>
        <div>
          <span style={{ fontSize: '0.7rem', color: '#FFB020', fontWeight: 800 }}>2026 관광데이터 공모전 심사용</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>POING Data Engine Insight</h2>
        </div>
      </header>

      {/* Main Mission Statement */}
      <section className="glass-card" style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.2), rgba(0, 198, 255, 0.1))', border: '1px solid rgba(0, 198, 255, 0.3)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#00C6FF' }}>
          💡 POING은 일정을 어떻게 만들었는가?
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#CBD5E1', marginTop: '6px', lineHeight: 1.5 }}>
          단순 랜덤 추천이 아닌 한국관광공사 OpenAPI 5종과 카카오 길찾기 API를 실시간 다중 조합하여 <b>혼잡 우회</b>와 <b>동선 최적화</b>를 구현했습니다.
        </p>
      </section>

      {/* API Utilization Grid Stats */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#CBD5E1' }}>📊 한국관광공사 OpenAPI 활용 지표</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="glass-card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>국문 관광정보 API</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#00C6FF', marginTop: '4px' }}>42곳</div>
            <div style={{ fontSize: '0.75rem', color: '#CBD5E1', marginTop: '2px' }}>포항 스팟 실시간 로딩</div>
          </div>

          <div className="glass-card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>연관 관광지 API</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFB020', marginTop: '4px' }}>128개</div>
            <div style={{ fontSize: '0.75rem', color: '#CBD5E1', marginTop: '2px' }}>장소간 연결 노드 분석</div>
          </div>

          <div className="glass-card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>집중률 예측 API</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FF1744', marginTop: '4px' }}>-38%</div>
            <div style={{ fontSize: '0.75rem', color: '#CBD5E1', marginTop: '2px' }}>14시 피크 혼잡 우회</div>
          </div>

          <div className="glass-card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>카카오 길찾기 API</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#00E676', marginTop: '4px' }}>26분</div>
            <div style={{ fontSize: '0.75rem', color: '#CBD5E1', marginTop: '2px' }}>최단 동선 이동시간 절감</div>
          </div>
        </div>
      </section>

      {/* Detailed Recommendation Proof Case Study */}
      <section className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFB020' }}>
          🔍 [영일대 해수욕장] 추천 데이터 근거 분석 예시
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: '#CBD5E1' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
            • <b>방문자 수 API</b>: 포항 방문자 수 상위 2% 랭크 스팟
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
            • <b>연관 관광지 API</b>: 죽도시장 ➔ 영일대 바인딩 지수 82%
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
            • <b>집중률 예측 API</b>: 18:00 야경 타임 혼잡도 [보통] 예측
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
            • <b>카카오모빌리티</b>: 환호공원 스페이스워크에서 차로 8분 거리
          </div>
        </div>
      </section>

      <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
        <Link href="/plan/confirm" className="glass-button-primary" style={{ textDecoration: 'none' }}>
          <span>확인 완료 (일정 화면 돌아가기)</span>
        </Link>
      </div>
    </div>
  );
}
