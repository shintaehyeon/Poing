'use client';

import Link from 'next/link';
import { useState } from 'react';
import PageShell from '@/components/poing/PageShell';
import PlaceThumb from '@/components/poing/PlaceThumb';

const alternatives = [
  {
    id: 'hwanho',
    meta: '스페이스워크 주변, 차량 3분',
    name: '환호공원',
    reason: '대기 시간을 줄이면서 노을 동선을 그대로 이어갈 수 있어요.',
    tone: 'sunset',
  },
  {
    id: 'yeonam',
    meta: '바다 전망 카페, 차량 8분',
    name: '여남 해안 카페거리',
    reason: '비가 오거나 사람이 많을 때 쉬어가기 좋은 대체 코스예요.',
    tone: 'sea',
  },
];

export default function ModifyTravelPage() {
  const [selectedId, setSelectedId] = useState(alternatives[0].id);

  return (
    <PageShell
      active="replace"
      aside={
        <section className="panel dark">
          <h3>변경 후 예상</h3>
          <p>대기 시간은 줄이고, 저녁 죽도시장 도착 시간은 그대로 유지합니다.</p>
          <div className="mini-list">
            <span>대기 40분 감소</span>
            <span>이동 3분</span>
            <span>야경 동선 유지</span>
          </div>
        </section>
      }
      description="혼잡도가 높거나 시간이 부족하면 가까운 장소와 연결성이 높은 장소를 우선 추천합니다."
      eyebrow="Route update"
      title="지금 상황에 맞춰 남은 일정을 바꿀 수 있어요"
    >
      <section className="alert">
        <span>혼잡 예상</span>
        <h3>스페이스워크 대기 시간이 길어질 수 있어요.</h3>
        <p>POING이 가까운 대체 장소를 먼저 보여주고, 선택하면 남은 동선을 다시 계산합니다.</p>
      </section>

      <section className="replace-grid">
        {alternatives.map((place) => (
          <button
            className={`panel ${selectedId === place.id ? 'selected' : ''}`}
            key={place.id}
            onClick={() => setSelectedId(place.id)}
            type="button"
          >
            <PlaceThumb tone={place.tone} />
            <span className="field-title">{place.meta}</span>
            <h3>{place.name}</h3>
            <p>{place.reason}</p>
          </button>
        ))}
      </section>

      <section className="panel">
        <span className="field-title">선택 후</span>
        <p>남은 일정은 환호공원에서 죽도시장으로 이어지는 흐름으로 다시 정리됩니다.</p>
        <div className="side-actions">
          <Link className="primary-action" href="/travel/active">
            이 장소로 변경
          </Link>
          <Link className="secondary-action" href="/plan/confirm">
            변경 취소
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
