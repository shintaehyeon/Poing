'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { ItineraryItem } from '@/types/poing';

export default function ActiveTravelPage() {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<number>(2); // Default visiting 2nd item (죽도시장)
  const [userPhotos, setUserPhotos] = useState<Record<string, string>>({}); // { placeId: base64ImageUrl }

  useEffect(() => {
    const saved = sessionStorage.getItem('poing_result');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.itinerary && parsed.itinerary.length > 0) {
        setItems(parsed.itinerary[0].items);
      }
    }

    const savedPhotos = sessionStorage.getItem('poing_user_photos');
    if (savedPhotos) {
      setUserPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  const handlePhotoUpload = (placeId: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updated = { ...userPhotos, [placeId]: base64 };
        setUserPhotos(updated);
        sessionStorage.setItem('poing_user_photos', JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    }
  };

  const activeItem = items.find(i => i.order === currentOrder) || items[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      
      {/* Top Map Bar */}
      <header style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        padding: '16px 20px', 
        background: 'linear-gradient(to bottom, rgba(11, 19, 43, 0.95), transparent)', 
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/plan/confirm" style={{ color: '#FFF', textDecoration: 'none', fontSize: '1.1rem' }}>
          ← 일정
        </Link>
        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00C6FF' }}>🗺️ 포항 실시간 여행 & 📸 사진 인증</span>
        <Link href="/travel/modify" style={{ color: '#FFB020', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700 }}>
          ⚡ 일정 수정
        </Link>
      </header>

      {/* Simulated Interactive Kakao Map Canvas Area */}
      <div style={{ 
        flex: 1, 
        background: '#0F172A', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Map Background Grid Simulation */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.15, 
          backgroundImage: 'radial-gradient(#00C6FF 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} />

        {/* Pohang Coast Line Simulation Graphic */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path 
            d="M 80 120 L 160 220 L 280 300 L 360 420" 
            fill="none" 
            stroke="#0066FF" 
            strokeWidth="4" 
            strokeDasharray="8 6" 
          />
        </svg>

        {/* Map Pins with User Uploaded Photo Stamps */}
        {items.map((item, idx) => {
          const isVisited = item.order < currentOrder;
          const isCurrent = item.order === currentOrder;
          const photo = userPhotos[item.place.id];

          const offsets = [
            { top: '25%', left: '20%' },
            { top: '40%', left: '42%' },
            { top: '55%', left: '60%' },
            { top: '70%', left: '75%' }
          ];
          const pos = offsets[idx % offsets.length];

          return (
            <div
              key={item.order}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                zIndex: isCurrent ? 5 : 2
              }}
            >
              <div 
                className={isCurrent ? 'live-pulse' : ''}
                style={{
                  width: photo ? '48px' : isCurrent ? '42px' : '32px',
                  height: photo ? '48px' : isCurrent ? '42px' : '32px',
                  borderRadius: photo ? '12px' : '50%',
                  background: isVisited ? '#00E676' : isCurrent ? 'linear-gradient(135deg, #FF5E36, #FFB020)' : '#334155',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: isCurrent ? '1rem' : '0.85rem',
                  boxShadow: isCurrent ? 'var(--glow-secondary)' : 'none',
                  border: photo ? '2px solid #00C6FF' : '2px solid #FFF',
                  overflow: 'hidden'
                }}
              >
                {photo ? (
                  <img src={photo} alt={item.place.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : isVisited ? (
                  '✓'
                ) : (
                  item.order
                )}
              </div>

              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                color: photo ? '#00C6FF' : isCurrent ? '#FFB020' : '#CBD5E1', 
                background: 'rgba(11, 19, 43, 0.85)', 
                padding: '2px 6px', 
                borderRadius: '6px',
                whiteSpace: 'nowrap'
              }}>
                {photo ? '📸 ' : ''}{item.place.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Active Place Card with Photo Upload Camera */}
      {activeItem && (
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '20px', 
          right: '20px', 
          zIndex: 20 
        }}>
          <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#00C6FF', fontWeight: 800 }}>
                ● 현재 장소 ({currentOrder} / {items.length})
              </span>
              <span style={{ fontSize: '0.75rem', color: '#FFD600', fontWeight: 700 }}>
                도착 {activeItem.arrivalTime}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                <img 
                  src={userPhotos[activeItem.place.id] || activeItem.place.imageUrl} 
                  alt={activeItem.place.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                {userPhotos[activeItem.place.id] && (
                  <span style={{ position: 'absolute', top: 2, right: 2, fontSize: '0.7rem', background: '#00C6FF', borderRadius: '4px', padding: '1px 3px' }}>
                    📸
                  </span>
                )}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>{activeItem.place.title}</h3>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>📍 {activeItem.place.address}</p>
              </div>
            </div>

            {/* Live Camera Photo Upload Bar */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <label style={{ 
                flex: 1, 
                padding: '10px', 
                borderRadius: '10px', 
                background: userPhotos[activeItem.place.id] ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 176, 32, 0.2)', 
                border: userPhotos[activeItem.place.id] ? '1px solid #00E676' : '1px solid #FFB020', 
                color: userPhotos[activeItem.place.id] ? '#00E676' : '#FFB020', 
                fontSize: '0.8rem', 
                fontWeight: 700, 
                textAlign: 'center', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <span>📸</span> {userPhotos[activeItem.place.id] ? '인증 사진 다시 찍기' : '현장 인증샷 촬영/업로드'}
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  onChange={(e) => handlePhotoUpload(activeItem.place.id, e)} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>

            {/* Next Place Navigation Button */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              {currentOrder < items.length ? (
                <button
                  onClick={() => setCurrentOrder(currentOrder + 1)}
                  className="glass-button-primary"
                  style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}
                >
                  다음 장소로 이동 (✓ 완료)
                </button>
              ) : (
                <Link href="/travel/finish" className="glass-button-primary" style={{ flex: 1, padding: '12px', fontSize: '0.9rem', textDecoration: 'none' }}>
                  🎉 여행 마무리 & ✉️ 엽서 획득
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
