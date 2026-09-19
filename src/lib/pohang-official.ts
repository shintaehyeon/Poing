export type OfficialPohangPlace = {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  address: string;
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  sourceUrl: string;
  sourceLabel: string;
  sourceTag: string;
  description: string;
};

const POHANG_TOUR_BASE = 'https://www.pohang.go.kr/phtour';
const COMMONS_IMAGE_BASE = 'https://upload.wikimedia.org/wikipedia/commons';
const TOUR_IMAGE_BASE = 'https://tong.visitkorea.or.kr/cms/resource';

export const POHANG_TOUR_HOME = `${POHANG_TOUR_BASE}/index.do`;
export const POHANG_RECIPE_URL = `${POHANG_TOUR_BASE}/wmap/smartTour/index.do?menu_idx=17`;

export const officialPohangPlaces: OfficialPohangPlace[] = [
  {
    id: 'homigot',
    title: '호미곶 상생의 손',
    shortTitle: '호미곶',
    category: '일출',
    address: '경상북도 포항시 남구 호미곶면 해맞이로150번길 20',
    imageUrl: `${COMMONS_IMAGE_BASE}/8/8a/Homigot_20240113_001.jpg`,
    imageAlt: '호미곶 상생의 손과 해맞이광장 사진',
    imageCredit: 'Wikimedia Commons · Mobius6 · CC BY 4.0',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?menu_idx=104&tour_info_idx=184`,
    sourceLabel: '공식 관광정보 · 장소 정보',
    sourceTag: '포항시 추천 여행지',
    description:
      '포항의 새벽을 가장 먼저 떠올리게 하는 일출 명소입니다. 바다 위 상생의 손과 해맞이광장이 하루의 시작을 선명하게 남깁니다.',
  },
  {
    id: 'yeongildae',
    title: '영일대&포스코 야경',
    shortTitle: '영일대',
    category: '바다 · 야경',
    address: '경상북도 포항시 북구 해안로 95',
    imageUrl: `${COMMONS_IMAGE_BASE}/e/e1/Yeongildae_Beach_at_night_on_March_2nd%2C_2019.jpg`,
    imageAlt: '밤의 영일대 해수욕장 사진',
    imageCredit: 'Wikimedia Commons · Choi2451 · CC BY-SA 4.0',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?tour_info_idx=165`,
    sourceLabel: '공식 관광정보 · 장소 정보',
    sourceTag: '핫플레이스',
    description:
      '도심의 바다 산책과 포스코 야경이 이어지는 코스입니다. 포항에 도착한 뒤 부담 없이 첫 장면을 열기 좋습니다.',
  },
  {
    id: 'spacewalk',
    title: '포항 스페이스워크',
    shortTitle: '스페이스워크',
    category: '전망 · 체험',
    address: '경북 포항시 북구 두호동 산8',
    imageUrl: `${COMMONS_IMAGE_BASE}/5/58/SpaceWalk_%28walkable_sculpture%2C_Pohang_2021%29_Mutter_Genth_01.jpg`,
    imageAlt: '포항 스페이스워크 실제 사진',
    imageCredit: 'Wikimedia Commons · Fixateur · CC BY-SA 4.0',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?tour_info_idx=747`,
    sourceLabel: '공식 관광정보 · 장소 정보',
    sourceTag: '핫플레이스',
    description:
      '환호공원 안에서 바다와 도시를 동시에 보는 체험형 조형물입니다. 노을과 야경 사이의 전환점으로 쓰기 좋습니다.',
  },
  {
    id: 'jukdo',
    title: '죽도어시장',
    shortTitle: '죽도시장',
    category: '전통시장',
    address: '경상북도 포항시 북구 죽도시장13길 13-1',
    imageUrl: 'https://tong.visitkorea.or.kr/cms2/website/79/2649479.jpg',
    imageAlt: '포항 죽도시장 실제 사진',
    imageCredit: '한국관광공사 김지호 · 공공누리 1유형',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?tour_info_idx=570`,
    sourceLabel: '공식 관광정보 · 장소 정보',
    sourceTag: '전통시장 코스',
    description:
      '하루의 끝을 사람의 온도와 음식으로 닫는 포항 대표 시장 코스입니다. 저녁 식사와 기록 화면으로 자연스럽게 이어집니다.',
  },
  {
    id: 'guryongpo',
    title: '구룡포 일본인 가옥거리',
    shortTitle: '구룡포',
    category: '거리 · 문화',
    address: '경상북도 포항시 남구 구룡포읍 구룡포길 153-1',
    imageUrl: `${COMMONS_IMAGE_BASE}/7/72/Guryongpo_Japanese_House_Street_20240113_003.jpg`,
    imageAlt: '구룡포 일본인 가옥거리 사진',
    imageCredit: 'Wikimedia Commons · Mobius6 · CC BY 4.0',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?tour_info_idx=347`,
    sourceLabel: '공식 관광정보 · 장소 정보',
    sourceTag: '포항12경',
    description:
      '근대 가옥 거리와 항구 풍경이 겹치는 남부권 코스입니다. 호미곶 이후의 오전 일정으로 연결하기 좋습니다.',
  },
  {
    id: 'lighthouse',
    title: '국립등대박물관',
    shortTitle: '국립등대박물관',
    category: '박물관 · 바다',
    address: '경상북도 포항시 남구 호미곶면 해맞이로150번길 20',
    imageUrl: `${COMMONS_IMAGE_BASE}/4/41/Lighthouse_museum_entrance.jpg`,
    imageAlt: '포항 국립등대박물관 입구 사진',
    imageCredit: 'Wikimedia Commons · Altostratus · CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lighthouse_museum_entrance.jpg',
    sourceLabel: 'Wikimedia Commons · 공개 라이선스 사진',
    sourceTag: '남포항 문화 코스',
    description:
      '호미곶 해맞이광장 옆에서 등대와 항로표지의 이야기를 만나는 실내외 박물관입니다. 일출 뒤 바닷바람을 피하며 이어가기 좋습니다.',
  },
  {
    id: 'hwanho',
    title: '환호공원',
    shortTitle: '환호공원',
    category: '공원 · 대체코스',
    address: '경상북도 포항시 북구 환호공원길 30',
    imageUrl: `${COMMONS_IMAGE_BASE}/4/41/SpaceWalk_%28walkable_sculpture%2C_Pohang_2021%29_Mutter_Genth_02.jpg`,
    imageAlt: '환호공원 안 포항 스페이스워크 사진',
    imageCredit: 'Wikimedia Commons · Fixateur · CC BY-SA 4.0',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?tour_info_idx=117`,
    sourceLabel: '공식 관광정보 · 장소 정보',
    sourceTag: '연관 관광지',
    description:
      '스페이스워크와 가까운 공원 코스입니다. 혼잡하거나 대기 시간이 길 때 동선을 크게 흔들지 않고 바꿀 수 있습니다.',
  },
  {
    id: 'igari',
    title: '이가리 닻 전망대',
    shortTitle: '이가리 닻전망대',
    category: '바다 · 전망',
    address: '경상북도 포항시 북구 청하면 이가리 산67-3',
    imageUrl: `${TOUR_IMAGE_BASE}/79/3337479_image2_1.jpg`,
    imageAlt: '푸른 바다 위 닻 모양으로 뻗은 이가리 닻 전망대 항공 사진',
    imageCredit: '한국관광공사 관광사진',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?tour_info_idx=740`,
    sourceLabel: '한국관광공사 관광사진 · 장소 이미지',
    sourceTag: 'TV촬영지',
    description:
      '북부 해안 드라이브에 어울리는 전망 포인트입니다. 여유로운 바다 사진 코스로 확장하기 좋습니다.',
  },
];

export const officialPlaceById = officialPohangPlaces.reduce<Record<string, OfficialPohangPlace>>(
  (places, place) => {
    places[place.id] = place;
    return places;
  },
  {},
);

export type KtoLikePlace = {
  id: string;
  contentId?: string;
  title: string;
  category?: string;
  address?: string;
  overview?: string;
  imageUrl?: string;
  homepage?: string;
  sourceLabel?: string;
  contentTypeId?: string;
};

export function normalizeKtoToOfficialPlace(ktoPlace: KtoLikePlace): OfficialPohangPlace {
  return {
    id: ktoPlace.contentId || ktoPlace.id,
    title: ktoPlace.title,
    shortTitle: ktoPlace.title.replace(/경상북도|포항시|해수욕장|전망대|가옥거리/g, '').trim() || ktoPlace.title,
    category: ktoPlace.category || '관광지',
    address: ktoPlace.address || '경상북도 포항시',
    imageUrl: ktoPlace.imageUrl || officialPohangPlaces[0].imageUrl,
    imageAlt: `${ktoPlace.title} 한국관광공사 OpenAPI 사진`,
    imageCredit: '한국관광공사 OpenAPI (areaBasedList2/detailCommon2)',
    sourceUrl: ktoPlace.homepage || 'https://korean.visitkorea.or.kr/',
    sourceLabel: ktoPlace.sourceLabel || '한국관광공사 국문 관광정보 OpenAPI',
    sourceTag: 'ⓒ한국관광공사',
    description: ktoPlace.overview || `${ktoPlace.title}은(는) 한국관광공사 OpenAPI로 조회된 포항의 대표 장소입니다.`,
  };
}
