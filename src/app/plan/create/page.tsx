'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageShell from '@/components/poing/PageShell';
import PlaceThumb from '@/components/poing/PlaceThumb';
import PlacePhotoGallery from '@/components/poing/PlacePhotoGallery';
import PohangRouteMap from '@/components/poing/PohangRouteMap';
import SunTimes from '@/components/poing/SunTimes';
import LiveTourData from '@/components/poing/LiveTourData';
import {
  apiPills,
  buildFallbackItinerary,
  createOptions,
  findRecommendationMode,
  findRegionRoute,
  recommendationModes,
  regionRoutes,
} from '@/lib/poing-content';
import { officialPlaceById } from '@/lib/pohang-official';

type TripCondition = {
  region: string;
  duration: string;
  arrivalTime: string;
  transport: string;
  companion: string;
  purpose: string;
};

export default function CreatePlanPage() {
  const router = useRouter();
  const [activePlannerTab, setActivePlannerTab] = useState('ai');
  const [activeRecommendationId, setActiveRecommendationId] = useState('couple-sunset');
  const [condition, setCondition] = useState<TripCondition>({
    region: '구도심',
    duration: createOptions.duration[0],
    arrivalTime: '14:30',
    transport: createOptions.transport[0],
    companion: createOptions.companion[1],
    purpose: createOptions.purpose[1],
  });

  const selectedRegion = findRegionRoute(condition.region);
  const regionItinerary = buildFallbackItinerary(selectedRegion.label);
  const activeRecommendation = findRecommendationMode(activeRecommendationId);
  const routePreview = activeRecommendation.route.slice(0, condition.duration === '당일치기' ? 4 : 6);
  const regionLeadPlace = officialPlaceById[activeRecommendation.primaryPlaceId] ?? officialPlaceById.yeongildae;

  const regionToRecommendation: Record<string, string> = {
    북포항: 'healing-view',
    구도심: 'compact-first',
    남포항: 'history-south',
    힐링코스: 'healing-view',
  };

  const purposeToRecommendation: Record<string, string> = {
    '힐링/산책': 'healing-view',
    '인생샷 찍기': 'couple-sunset',
    '체험/액티비티': 'compact-first',
    역사탐방: 'history-south',
    '쇼핑/전통시장 투어': 'market-local',
  };

  const updateCondition = (key: keyof TripCondition, value: string) => {
    setCondition((current) => ({ ...current, [key]: value }));
  };

  const selectRegion = (value: string) => {
    updateCondition('region', value);
    setActiveRecommendationId(regionToRecommendation[value] ?? 'compact-first');
  };

  const selectCompanion = (value: string) => {
    updateCondition('companion', value);
    if (condition.region !== '구도심') return;
    if (value === '연인') setActiveRecommendationId('couple-sunset');
    if (value === '가족' || value === '단체') setActiveRecommendationId('family-easy');
    if (value === '혼자') setActiveRecommendationId('healing-view');
  };

  const selectPurpose = (value: string) => {
    updateCondition('purpose', value);
    if (condition.region === '구도심') {
      setActiveRecommendationId(purposeToRecommendation[value] ?? activeRecommendationId);
    }
  };

  const selectRecommendation = (modeId: string) => {
    const mode = findRecommendationMode(modeId);
    setActiveRecommendationId(mode.id);
    setCondition((current) => ({
      ...current,
      companion: mode.companions[0] ?? current.companion,
      purpose: mode.purposes[0] ?? current.purpose,
      region: mode.defaultRegion,
    }));
  };

  const startGeneration = () => {
    window.sessionStorage.setItem('poing_condition', JSON.stringify(condition));
    router.push('/plan/generating');
  };

  const movePlannerTab = (tab: string, targetId?: string) => {
    setActivePlannerTab(tab);
    if (tab === 'records') {
      router.push('/travel/finish');
      return;
    }
    if (targetId) {
      requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  return (
    <PageShell
      active="create"
      variant="planner"
      aside={
        <>
          <SunTimes />

          <section className="panel soft">
            <span className="field-title">선택 권역 코스</span>
            <div className="region-hint">
              <strong>{selectedRegion.label}</strong>
              <p>{selectedRegion.headline}</p>
              <div>
                {selectedRegion.courses[0].places.slice(0, 5).map((place) => (
                  <span key={place}>{place}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="panel soft">
            <span className="field-title">선택 권역의 장소 순서 · 시간은 생성 후 계산</span>
            <div className="route-list">
              {regionItinerary.map((place, index) => (
                <div key={place.id}>
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <span>{place.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel dark">
            <h3>POING이 참고할 데이터</h3>
            <p>연결된 장소·사진·이동·혼잡 데이터를 활용하며, 아직 연결되지 않은 항목은 미리보기로 구분합니다.</p>
            <div className="api-pills">
              {apiPills.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </section>
        </>
      }
      description="검색하듯 조건을 고르면, POING이 권역 코스와 오늘의 일출·일몰 시간을 맞춰 바로 움직일 수 있는 여정을 만듭니다."
      eyebrow="Pohang trip search"
      title="포항 여행을 바로 맞춰볼까요?"
    >
      <section className="trip-search-card" id="ai-planner" aria-label="포항 여행 조건 검색">
        <div className="planner-tabs" aria-label="여행 서비스 메뉴">
          <button
            className={activePlannerTab === 'ai' ? 'active' : ''}
            onClick={() => movePlannerTab('ai', 'ai-planner')}
            type="button"
          >
            맞춤 일정
          </button>
          <button
            className={activePlannerTab === 'regions' ? 'active' : ''}
            onClick={() => movePlannerTab('regions', 'route-map')}
            type="button"
          >
            권역 코스
          </button>
          <button
            className={activePlannerTab === 'places' ? 'active' : ''}
            onClick={() => movePlannerTab('places', 'place-gallery')}
            type="button"
          >
            명소 탐색
          </button>
          <button
            className={activePlannerTab === 'records' ? 'active' : ''}
            onClick={() => movePlannerTab('records')}
            type="button"
          >
            내 기록
          </button>
        </div>

        <div className="planner-search-grid">
          <div className="planner-search-field destination-field">
            <span>여행지</span>
            <strong>포항</strong>
            <small>POING은 포항만 집중합니다</small>
          </div>

          <div className="planner-search-field">
            <span>권역</span>
            <div className="compact-choice-row">
              {regionRoutes.map((option) => (
                <button
                  className={condition.region === option.label ? 'selected' : ''}
                  key={option.id}
                  onClick={() => selectRegion(option.label)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="planner-search-field">
            <span>기간</span>
            <div className="compact-choice-row">
              {createOptions.duration.map((option) => (
                <button
                  className={condition.duration === option ? 'selected' : ''}
                  key={option}
                  onClick={() => updateCondition('duration', option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label className="planner-search-field time-search-field">
            <span>도착 시간</span>
            <input
              aria-label="도착 시간"
              onChange={(event) => updateCondition('arrivalTime', event.target.value)}
              type="time"
              value={condition.arrivalTime}
            />
            <small>일출·노을 시간을 함께 계산</small>
          </label>
        </div>

        <div className="planner-option-grid">
          <div>
            <span>이동 수단</span>
            <div className="compact-choice-row">
              {createOptions.transport.map((option) => (
                <button
                  className={condition.transport === option ? 'selected' : ''}
                  key={option}
                  onClick={() => updateCondition('transport', option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span>동행</span>
            <div className="compact-choice-row wrap">
              {createOptions.companion.map((option) => (
                <button
                  className={condition.companion === option ? 'selected' : ''}
                  key={option}
                  onClick={() => selectCompanion(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="purpose-field">
            <span>여행 목적</span>
            <div className="compact-choice-row wrap">
              {createOptions.purpose.map((option) => (
                <button
                  className={condition.purpose === option ? 'selected' : ''}
                  key={option}
                  onClick={() => selectPurpose(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="planner-search-submit" onClick={startGeneration} type="button">
          내 조건으로 여정 만들기
        </button>
      </section>

      <PohangRouteMap activeRegionId={selectedRegion.id} onSelectRegion={selectRegion} />

      <PlacePhotoGallery />

      <LiveTourData />

      <section className="planner-match-section">
        <article className="planner-match-card">
          <span>코스 미리보기</span>
          <h3>{selectedRegion.label} · {activeRecommendation.title}</h3>
          <p>{activeRecommendation.copy}</p>
          <div className="planner-route-preview">
            {routePreview.map((place) => (
              <strong key={place}>{place}</strong>
            ))}
          </div>
          <div className="api-pills">
            {activeRecommendation.signals.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </article>

        <article className="planner-place-card">
          <PlaceThumb
            alt={regionLeadPlace.imageAlt}
            src={regionLeadPlace.imageUrl}
            tone={
              selectedRegion.id === 'south'
                ? 'dawn'
                : selectedRegion.id === 'north'
                  ? 'sea'
                  : selectedRegion.id === 'healing'
                    ? 'forest'
                    : 'sunset'
            }
          />
          <div>
            <span>첫 장면</span>
            <strong>{regionLeadPlace.shortTitle}</strong>
            <p>{`${activeRecommendation.from}의 첫 장면입니다. 선택한 방향에 맞춰 사진과 남은 장소가 함께 바뀝니다.`}</p>
          </div>
        </article>
      </section>

      <section className="planner-recipe-section">
        <div className="planner-section-title">
          <span>POING directions</span>
          <h3>후기에서 자주 남는 만족 포인트를 주제별 코스로 다시 묶었습니다.</h3>
        </div>
        <div className="planner-recipe-grid">
          {recommendationModes.map((recipe) => {
            const recipePlace = officialPlaceById[recipe.primaryPlaceId] ?? officialPlaceById.yeongildae;

            return (
              <button
                className={activeRecommendation.id === recipe.id ? 'active' : ''}
                key={recipe.id}
                onClick={() => selectRecommendation(recipe.id)}
                type="button"
              >
                <span className="direction-card-photo">
                  <Image
                    alt={recipePlace.imageAlt}
                    fill
                    sizes="(max-width: 760px) 84vw, (max-width: 1180px) 28vw, 240px"
                    src={recipePlace.imageUrl}
                    unoptimized
                  />
                </span>
                <span>{recipe.from}</span>
                <strong>{recipe.title}</strong>
                <p>{recipe.copy}</p>
              </button>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
