'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ItineraryItem } from '@/types/poing';

export default function TravelFinishPage() {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [userPhotos, setUserPhotos] = useState<Record<string, string>>({});
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('스페이스워크와 영일대 야경, 신선한 물회까지 완벽했던 포항 하루!');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // 감성 여유 로딩 상태 (Poetic Transition Loading)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  const travelQuotes = [
    { quote: "여행은 새로운 풍경을 찾는 것이 아니라, 새로운 눈을 갖는 것이다.", author: "마르셀 프루스트" },
    { quote: "바다가 부르는 소리에 발걸음을 멈추고, 포항의 노을 속에서 나를 만납니다.", author: "포항의 기억" },
    { quote: "길을 잃는 것은 곧, 생각지도 못했던 새로운 풍경을 만나는 시작이다.", author: "여행자의 일기" }
  ];

  useEffect(() => {
    const savedResult = sessionStorage.getItem('poing_result');
    if (savedResult) {
      const parsed = JSON.parse(savedResult);
      if (parsed.itinerary && parsed.itinerary.length > 0) {
        setItems(parsed.itinerary[0].items);
      }
    }

    const savedPhotos = sessionStorage.getItem('poing_user_photos');
    if (savedPhotos) {
      setUserPhotos(JSON.parse(savedPhotos));
    }

    // 1초마다 감성 시/명언 전환
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % travelQuotes.length);
    }, 1200);

    // 2.5초 후 감성 엽서 천천히 페이드인 오픈
    const timer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(quoteInterval);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(quoteInterval);
    };
  }, []);

  const handleShare = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 감성 힐링 로딩 화면 (Poetic Transition Layer)
  if (isLoading) {
    const currentQuote = travelQuotes[quoteIndex];
    return (
      <div style={{ 
        padding: '32px 20px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        gap: '28px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #050A18 0%, #0B132B 100%)'
      }}>
        {/* Soft Wave Pulse Animation */}
        <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            className="live-pulse" 
            style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.4), rgba(0, 198, 255, 0.4))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              border: '1px solid rgba(0, 198, 255, 0.6)'
            }}
          >
            🌊
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#00C6FF', fontWeight: 800 }}>POHANG TRAVEL MEMORY</span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF' }}>
            포항에서 당신의 여정은 어떠하셨나요?
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
            오늘 거쳐온 동선과 추억 사진을 엽서에 천천히 담고 있습니다...
          </p>
        </div>

        {/* Rolling Travel Quote Card */}
        <div 
          className="glass-card animate-slide-in" 
          key={quoteIndex}
          style={{ 
            padding: '20px', 
            maxWidth: '360px', 
            background: 'rgba(255, 255, 255, 0.04)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            marginTop: '12px'
          }}
        >
          <p style={{ fontSize: '0.9rem', color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{currentQuote.quote}"
          </p>
          <div style={{ fontSize: '0.75rem', color: '#FFB020', marginTop: '8px', fontWeight: 700 }}>
            — {currentQuote.author}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-in" style={{ padding: '24px 20px 36px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
      {/* Header */}
      <header style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '2rem' }}>📮</span>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
          나만의 포항 여행 엽서 완성!
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>
          오늘 거쳐온 포항의 동선과 인증 사진으로 만든 감성 엽서입니다.
        </p>
      </header>

      {/* POHANG EMOTIONAL TRAVEL POSTCARD CARD */}
      <section 
        className="glass-card" 
        style={{ 
          padding: '20px', 
          background: 'linear-gradient(180deg, #1C2541 0%, #0B132B 100%)', 
          border: '2px solid #00C6FF',
          borderRadius: '24px',
          boxShadow: 'var(--glow-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Pohang Stamp Branding */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ 
              fontSize: '0.65rem', 
              padding: '3px 8px', 
              background: '#FF5E36', 
              color: '#FFF', 
              borderRadius: '12px', 
              fontWeight: 800 
            }}>
              POSTCARD FROM POHANG 🌊
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFF', marginTop: '6px' }}>
              영일대 & 포항 동해 힐링 하루
            </h3>
          </div>

          {/* Postal Retro Seal Stamp */}
          <div style={{ 
            width: '52px', 
            height: '52px', 
            borderRadius: '50%', 
            border: '2px dashed #FFB020', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#FFB020',
            fontSize: '0.6rem',
            fontWeight: 800,
            transform: 'rotate(-12deg)',
            background: 'rgba(255, 176, 32, 0.1)'
          }}>
            <span>POHANG</span>
            <span>2026.07.24</span>
          </div>
        </div>

        {/* User Photos 4-Grid Album */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {items.slice(0, 4).map((item, idx) => {
            const photo = userPhotos[item.place.id] || item.place.imageUrl;
            return (
              <div 
                key={item.order} 
                style={{ 
                  height: '100px', 
                  borderRadius: '10px', 
                  overflow: 'hidden', 
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.15)' 
                }}
              >
                <img src={photo} alt={item.place.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  padding: '4px 6px', 
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  fontSize: '0.65rem',
                  color: '#FFF',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.order}. {item.place.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pohang Travel Route Map Graphic Simulation */}
        <div style={{ 
          height: '70px', 
          background: 'rgba(0,0,0,0.4)', 
          borderRadius: '12px', 
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid rgba(0, 198, 255, 0.2)'
        }}>
          <div style={{ fontSize: '1.2rem' }}>🗺️</div>
          <div style={{ flex: 1, fontSize: '0.75rem', color: '#CBD5E1', lineHeight: 1.4 }}>
            <b>실제 포항 동선</b>: 호미곶 ➔ 죽도시장 ➔ 환호공원 ➔ 영일대 누각<br />
            <span style={{ color: '#00C6FF' }}>총 이동 48.3km (이동동선 26분 절감 달성)</span>
          </div>
        </div>

        {/* Postcard Rating & Review Quote */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 12px', borderRadius: '10px', fontSize: '0.8rem', color: '#FFF' }}>
          <div style={{ color: '#FFB020', fontWeight: 700, fontSize: '0.9rem' }}>
            {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
          </div>
          <p style={{ fontStyle: 'italic', marginTop: '4px', color: '#E2E8F0', lineHeight: 1.3 }}>
            "{comment}"
          </p>
        </div>

      </section>

      {/* Rating Adjustment */}
      <section className="glass-card" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 600 }}>엽서 별점 수정:</span>
        <div style={{ display: 'flex', gap: '4px', fontSize: '1.4rem', cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} onClick={() => setRating(star)} style={{ color: star <= rating ? '#FFB020' : '#475569' }}>
              ★
            </span>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={handleShare}
          className="glass-button-primary"
        >
          <span>{isCopied ? '✨ 엽서 카드 링크 복사 완료!' : '📮 포항 감성 엽서 공유 / 다운로드'}</span>
        </button>

        <Link href="/" style={{ textDecoration: 'none', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
          메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
