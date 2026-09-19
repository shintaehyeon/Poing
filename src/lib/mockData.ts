import { PohangPlace } from '@/types/poing';
import { officialPlaceById } from './pohang-official';

const official = officialPlaceById;

export const POHANG_MOCK_PLACES: PohangPlace[] = [
  {
    id: 'homigot',
    title: official.homigot.title,
    category: '바다',
    address: official.homigot.address,
    mapx: 129.5707,
    mapy: 36.0792,
    imageUrl: official.homigot.imageUrl,
    description: official.homigot.description,
    recommendedDurationMinutes: 60,
    bestTimeOfDay: '아침',
    visitorRankTopPercent: 3,
    congestionLevel: '보통',
    relatedPlaceIds: ['guryongpo', 'homi_coastal_walk'],
    recommendationReason: '포항 방문자 수 상위 3% 스팟이며, 일출/아침 시간대 감상 시 최고의 만족도를 보입니다.'
  },
  {
    id: 'spacewalk',
    title: official.spacewalk.title,
    category: '산책/공원',
    address: official.spacewalk.address,
    mapx: 129.3822,
    mapy: 36.0645,
    imageUrl: official.spacewalk.imageUrl,
    description: official.spacewalk.description,
    recommendedDurationMinutes: 90,
    bestTimeOfDay: '점심',
    visitorRankTopPercent: 1,
    congestionLevel: '혼잡',
    relatedPlaceIds: ['hwanho_art', 'yeongildae'],
    recommendationReason: '포항 검색량 1위의 킬러 스팟으로 영일대 해수욕장과 연관 동선 바인딩률이 82%에 달합니다.'
  },
  {
    id: 'yeongildae',
    title: official.yeongildae.title,
    category: '바다',
    address: official.yeongildae.address,
    mapx: 129.3789,
    mapy: 36.0560,
    imageUrl: official.yeongildae.imageUrl,
    description: official.yeongildae.description,
    recommendedDurationMinutes: 60,
    bestTimeOfDay: '야경',
    visitorRankTopPercent: 2,
    congestionLevel: '보통',
    relatedPlaceIds: ['spacewalk', 'yeonam_cafe'],
    recommendationReason: '야경 연관 관광지 지수가 매우 높아 저녁 타임에 방문 시 포쇄 야경 조망에 최적입니다.'
  },
  {
    id: 'jukdo_market',
    title: official.jukdo.title,
    category: '시장/식도락',
    address: official.jukdo.address,
    mapx: 129.3662,
    mapy: 36.0361,
    imageUrl: official.jukdo.imageUrl,
    description: official.jukdo.description,
    recommendedDurationMinutes: 90,
    bestTimeOfDay: '점심',
    visitorRankTopPercent: 2,
    congestionLevel: '보통',
    relatedPlaceIds: ['pohang_canal', 'yeongildae'],
    recommendationReason: '점심시간대 방문자 집중률이 높아 식도락 동선 필수 코스로 바인딩되었습니다.'
  },
  {
    id: 'guryongpo',
    title: official.guryongpo.title,
    category: '문화/야경',
    address: official.guryongpo.address,
    mapx: 129.5591,
    mapy: 35.9892,
    imageUrl: official.guryongpo.imageUrl,
    description: official.guryongpo.description,
    recommendedDurationMinutes: 75,
    bestTimeOfDay: '점심',
    visitorRankTopPercent: 4,
    congestionLevel: '여유',
    relatedPlaceIds: ['homigot', 'guryongpo_park'],
    recommendationReason: '호미곶 동선과 연속 방문률이 76%로 높은 연관 스팟입니다.'
  },
  {
    id: 'igari',
    title: official.igari.title,
    category: '바다',
    address: official.igari.address,
    mapx: 129.3941,
    mapy: 36.1832,
    imageUrl: official.igari.imageUrl,
    description: official.igari.description,
    recommendedDurationMinutes: 45,
    bestTimeOfDay: '노을/저녁',
    visitorRankTopPercent: 5,
    congestionLevel: '여유',
    relatedPlaceIds: ['bogyeongsa', 'yeongildae'],
    recommendationReason: '현재 혼잡도 [여유] 상태로 쾌적하게 동해 바다 뷰 사진을 찍기 좋은 드라이브 코스입니다.'
  }
];
