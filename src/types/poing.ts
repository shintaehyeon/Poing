export type CongestionLevel = '여유' | '보통' | '혼잡';

export interface PohangPlace {
  id: string;
  title: string;
  category: '바다' | '산책/공원' | '시장/식도락' | '문화/야경' | '카페';
  address: string;
  mapx: number; // 경도
  mapy: number; // 위도
  imageUrl: string;
  description: string;
  recommendedDurationMinutes: number;
  bestTimeOfDay: '아침' | '점심' | '노을/저녁' | '야경' | '상시';
  
  // 데이터 API 기반 인사이츠
  visitorRankTopPercent: number; // 지역별 방문자수 API (예: 상위 5%)
  congestionLevel: CongestionLevel; // 관광지 집중률 예측 API
  relatedPlaceIds: string[]; // 연관 관광지 API
  recommendationReason: string; // AI 및 데이터 근거 문구
}

export interface TravelCondition {
  durationDays: number; // 1일, 2일, 3일
  arrivalTime: string; // 예: "10:00"
  transport: '차량(자차/렌트)' | '대중교통/도보';
  companion: '혼자' | '커플/친구' | '가족';
  selectedTags: string[]; // 예: ['#바다뷰', '#식도락_죽도시장', '#야경', '#사진스팟']
}

export interface ItineraryItem {
  order: number;
  place: PohangPlace;
  arrivalTime: string; // "10:30"
  departureTime: string; // "12:00"
  travelTimeFromPreviousMinutes?: number; // 이전 장소로부터 이동시간 (분)
  travelDistanceKm?: number;
  reasonBadge: string; // "방문자 수 상위 5%", "스페이스워크 연계", "현재 혼잡도 여유"
}

export interface DayItinerary {
  day: number;
  title: string; // 예: "Day 1 - 바다와 야경 코스"
  items: ItineraryItem[];
}

export interface POINGInsightReport {
  totalPlacesCount: number;
  apiCallsCount: number;
  congestionAvoidancePercent: number; // 예: 혼잡도 35% 우회 성공
  travelTimeSavedMinutes: number; // 예: 이동동선 25분 단축
  topDataFeaturesUsed: string[];
}
