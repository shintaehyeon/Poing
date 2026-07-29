'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [activeMood, setActiveMood] = useState<'morning' | 'day' | 'night'>('day');

  const moodDetails = {
    morning: {
      spot: '호미곶 해맞이광장',
      time: '06:30 AM',
      tag: '동해 웅장한 일출',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      desc: '한반도 동쪽 끝에서 맞이하는 가장 특별한 아침 햇살'
    },
    day: {
      spot: '환호공원 스페이스워크',
      time: '14:00 PM',
      tag: '구름 위 스카이 트랙',
      image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
      desc: '영일만 바다를 발아래 두고 구름 위를 걷는 짜릿한 힐링'
    },
    night: {
      spot: '영일대 해상누각 & 죽도시장',
      time: '20:00 PM',
      tag: '바다 누각 야경 & 식도락',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      desc: '파도 소리와 함께 빛나는 해상 누각 조망과 신선한 포항 물회'
    }
  };

  const current = moodDetails[activeMood];

  return (
    <div style={{ padding: '24px 20px 36px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
      {/* Precision Brand Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: 900, 
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #00D2FF 0%, #0066FF 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            POING
          </span>
          <span style={{ 
            fontSize: '0.72rem', 
            padding: '3px 9px', 
            borderRadius: '20px', 
            background: 'rgba(0, 210, 255, 0.12)', 
            color: '#00D2FF', 
            fontWeight: 700,
            border: '1px solid rgba(0, 210, 255, 0.25)'
          }}>
            포항 특화 AI
          </span>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>2026 관광데이터 공모전</div>
      </header>

      {/* Hero Title & Subtitle */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h1 style={{ fontSize: '1.95rem', fontWeight: 800, lineHeight: 1.3, color: '#F8FAFC', letterSpacing: '-0.03em' }}>
          포항만의 감성,<br />
          <span style={{ color: '#00D2FF' }}>AI 빅데이터</span>로 만나는 하루
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.55 }}>
          혼잡도는 낮추고, 이동 시간은 줄여주는<br />포항 최적화 맞춤 여행 동선 생성기
        </p>
      </section>

      {/* Interactive Pohang 24h Live Mood Selector */}
      <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🌊</span> 포항의 24시간 Live Mood
          </span>
          <span style={{ fontSize: '0.78rem', color: '#FFB800', fontWeight: 700 }}>{current.time}</span>
        </div>

        {/* Mood Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px' }}>
          {(['morning', 'day', 'night'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMood(m)}
              style={{
                minHeight: '40px',
                border: 'none',
                borderRadius: '8px',
                background: activeMood === m ? 'linear-gradient(135deg, #0066FF, #00D2FF)' : 'transparent',
                color: activeMood === m ? '#FFFFFF' : '#94A3B8',
                fontWeight: activeMood === m ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {m === 'morning' ? '🌅 아침' : m === 'day' ? '☀️ 낮' : '🌙 야경'}
            </button>
          ))}
        </div>

        {/* Mood Card Preview */}
        <div style={{ 
          position: 'relative', 
          height: '190px', 
          borderRadius: '14px', 
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <img 
            src={current.image} 
            alt={current.spot} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72)' }} 
          />
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            padding: '16px', 
            background: 'linear-gradient(to top, rgba(6, 11, 25, 0.95), transparent)' 
          }}>
            <span style={{ fontSize: '0.68rem', padding: '3px 9px', background: '#FF4D2D', color: '#FFF', borderRadius: '12px', fontWeight: 800 }}>
              {current.tag}
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '6px', color: '#FFF' }}>{current.spot}</h3>
            <p style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '3px' }}>{current.desc}</p>
          </div>
        </div>
      </section>

      {/* Key Competition Proof Stats (Clean Anti-Trope Grid) */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        <div className="glass-card" style={{ padding: '14px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00D2FF' }}>5종</div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '3px' }}>관광공사 API</div>
        </div>
        <div className="glass-card" style={{ padding: '14px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFB800' }}>-38%</div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '3px' }}>혼잡 우회률</div>
        </div>
        <div className="glass-card" style={{ padding: '14px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00E676' }}>26분</div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '3px' }}>동선 절감</div>
        </div>
      </section>

      {/* Main Action Button */}
      <div style={{ marginTop: 'auto' }}>
        <Link href="/plan/create" className="glass-button-primary">
          <span>✨ 포항 여행 만들기</span>
        </Link>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748B', marginTop: '12px' }}>
          조건 입력만으로 3초 만에 만들어지는 개인 맞춤 일정
        </p>
      </div>
    </div>
  );
}
