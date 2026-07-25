'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DayItinerary, POINGInsightReport, ItineraryItem } from '@/types/poing';

export default function ConfirmPlanPage() {
  const [itinerary, setItinerary] = useState<DayItinerary[]>([]);
  const [insight, setInsight] = useState<POINGInsightReport | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState<ItineraryItem | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('poing_result');
    if (saved) {
      const parsed = JSON.parse(saved);
      setItinerary(parsed.itinerary);
      setInsight(parsed.insight);
    }
  }, []);

  if (!itinerary.length) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
        일정을 불러오는 중입니다...
      </div>
    );
  }

  const currentDayData = itinerary.find(d => d.day === selectedDay) || itinerary[0];

  return (
    <div style={{ padding: '20px 20px 32px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#00C6FF', fontWeight: 700 }}>POING AI MATCHED</span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
            포항 추천 여행 일정
          </h2>
        </div>
        <Link href="/insight" style={{ textDecoration: 'none' }}>
          <span style={{ 
            fontSize: '0.75rem', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            background: 'rgba(255, 176, 32, 0.2)', 
            color: '#FFB020', 
            fontWeight: 700,
            border: '1px solid rgba(255, 176, 32, 0.4)'
          }}>
            📊 추천 근거 Insight
          </span>
        </Link>
      </header>

      {/* Day Selector Tabs */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {itinerary.map((d) => (
          <button
            key={d.day}
            onClick={() => setSelectedDay(d.day)}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: '12px',
              border: selectedDay === d.day ? '2px solid #0066FF' : '1px solid rgba(255, 255, 255, 0.1)',
              background: selectedDay === d.day ? 'linear-gradient(135deg, #0066FF, #00C6FF)' : 'rgba(255, 255, 255, 0.05)',
              color: '#FFF',
              fontWeight: selectedDay === d.day ? 800 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      {/* Insight Quick Summary Badge Banner */}
      {insight && (
        <div className="glass-card" style={{ padding: '12px 16px', background: 'rgba(0, 102, 255, 0.12)', border: '1px solid rgba(0, 198, 255, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
            ⚡ <b>혼잡 우회 {insight.congestionAvoidancePercent}%</b> | 이동동선 <b>{insight.travelTimeSavedMinutes}분 절감</b>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#00C6FF', fontWeight: 700 }}>AI 최적화</span>
        </div>
      )}

      {/* Timeline Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {currentDayData.items.map((item, idx) => (
          <div key={item.order} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Travel Time connector if not first item */}
            {idx > 0 && item.travelTimeFromPreviousMinutes !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '24px', color: '#64748B', fontSize: '0.75rem' }}>
                <span>↓ 🚗 차로 {item.travelTimeFromPreviousMinutes}분 ({item.travelDistanceKm}km) 이동</span>
              </div>
            )}

            {/* Place Card */}
            <div 
              className="glass-card" 
              onClick={() => setSelectedPlaceForModal(item)}
              style={{ cursor: 'pointer', display: 'flex', gap: '14px', padding: '14px' }}
            >
              {/* Left Image Thumbnail */}
              <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                <img src={item.place.imageUrl} alt={item.place.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ 
                  position: 'absolute', 
                  top: '4px', 
                  left: '4px', 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  background: '#0066FF', 
                  color: '#FFF', 
                  fontSize: '0.7rem', 
                  fontWeight: 800, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {item.order}
                </span>
              </div>

              {/* Right Details */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#FFB020', fontWeight: 700 }}>
                      ⏰ {item.arrivalTime} ~ {item.departureTime}
                    </span>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: item.place.congestionLevel === '여유' ? '#00E676' : item.place.congestionLevel === '보통' ? '#FFD600' : '#FF1744', 
                      fontWeight: 700 
                    }}>
                      ● {item.place.congestionLevel}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
                    {item.place.title}
                  </h4>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', color: '#CBD5E1' }}>
                    {item.reasonBadge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Place Detail & Reason Modal */}
      {selectedPlaceForModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.75)', 
          backdropFilter: 'blur(8px)',
          display: 'flex', 
          alignItems: 'flex-end', 
          justifyContent: 'center', 
          zIndex: 100 
        }}>
          <div className="glass-card" style={{ 
            width: '100%', 
            maxWidth: '480px', 
            borderBottomLeftRadius: 0, 
            borderBottomRightRadius: 0, 
            padding: '24px', 
            maxHeight: '85vh', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#00C6FF', fontWeight: 700 }}>AI 추천 데이터 근거</span>
              <button 
                onClick={() => setSelectedPlaceForModal(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ height: '160px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={selectedPlaceForModal.place.imageUrl} alt={selectedPlaceForModal.place.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF' }}>{selectedPlaceForModal.place.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>📍 {selectedPlaceForModal.place.address}</p>
              <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '8px', lineHeight: 1.4 }}>{selectedPlaceForModal.place.description}</p>
            </div>

            {/* Public Data Proof List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFB020' }}>📊 관광 빅데이터 추천 증빙</div>
              <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>• <b>지역별 방문자수 API</b>: 포항 방문자 상위 {selectedPlaceForModal.place.visitorRankTopPercent}% 인기 스팟</div>
              <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>• <b>관광지 집중률 예측 API</b>: 현재 혼잡도 [{selectedPlaceForModal.place.congestionLevel}]</div>
              <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>• <b>AI 동선 근거</b>: {selectedPlaceForModal.place.recommendationReason}</div>
            </div>

            <button 
              onClick={() => setSelectedPlaceForModal(null)}
              className="glass-button-primary"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '10px' }}>
        <Link href="/travel/active" style={{ flex: 1, textDecoration: 'none' }} className="glass-button-primary">
          <span>🗺️ 지도에서 여행 시작하기</span>
        </Link>
      </div>
    </div>
  );
}
