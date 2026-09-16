export type OfficialPohangPlace = {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  address: string;
  imageUrl: string;
  imageAlt: string;
  sourceUrl: string;
  sourceLabel: string;
  sourceTag: string;
  description: string;
};

const POHANG_TOUR_BASE = 'https://www.pohang.go.kr/phtour';

export const POHANG_TOUR_HOME = `${POHANG_TOUR_BASE}/index.do`;

export const officialPohangPlaces: OfficialPohangPlace[] = [
  {
    id: 'homigot',
    title: '호미곶 상생의 손',
    shortTitle: '호미곶',
    category: '일출',
    address: '경상북도 포항시 남구 호미곶면 해맞이로150번길 20',
    imageUrl: `${POHANG_TOUR_BASE}/data/tour/image/184/thumb/1661928404382_A.jpg`,
    imageAlt: '호미곶 상생의 손',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?menu_idx=104&tour_info_idx=184`,
    sourceLabel: '포항시 퐝퐝여행 · 상생의 손',
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
    imageUrl: `${POHANG_TOUR_BASE}/data/tour/image/165/thumb/1668846661567_A.jpg`,
    imageAlt: '영일대와 포스코 야경',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?tour_info_idx=165`,
    sourceLabel: '포항시 퐝퐝여행 · 영일대&포스코 야경',
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
    imageUrl: `${POHANG_TOUR_BASE}/data/tour/image/747/thumb/1663231165215_A.jpg`,
    imageAlt: '포항 스페이스워크',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?tour_info_idx=747`,
    sourceLabel: '포항시 퐝퐝여행 · 포항 스페이스워크',
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
    imageUrl: `${POHANG_TOUR_BASE}/data/tour/image/570/thumb/1663230275223_A.jpg`,
    imageAlt: '죽도어시장',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?tour_info_idx=570`,
    sourceLabel: '포항시 퐝퐝여행 · 죽도어시장',
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
    imageUrl: `${POHANG_TOUR_BASE}/data/tour/image/347/thumb/1663227703843_A.jpg`,
    imageAlt: '구룡포 일본인 가옥거리',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?tour_info_idx=347`,
    sourceLabel: '포항시 퐝퐝여행 · 구룡포 일본인 가옥거리',
    sourceTag: '포항12경',
    description:
      '근대 가옥 거리와 항구 풍경이 겹치는 남부권 코스입니다. 호미곶 이후의 오전 일정으로 연결하기 좋습니다.',
  },
  {
    id: 'hwanho',
    title: '환호공원',
    shortTitle: '환호공원',
    category: '공원 · 대체코스',
    address: '경상북도 포항시 북구 환호공원길 30',
    imageUrl: `${POHANG_TOUR_BASE}/data/tour/image/117/thumb/1663231240040_A.jpg`,
    imageAlt: '환호공원',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?tour_info_idx=117`,
    sourceLabel: '포항시 퐝퐝여행 · 환호공원',
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
    imageUrl: `${POHANG_TOUR_BASE}/data/tour/image/740/thumb/1663230524306_A.jpg`,
    imageAlt: '이가리 닻 전망대',
    sourceUrl: `${POHANG_TOUR_BASE}/wmap/tourInformation/view.do?tour_info_idx=740`,
    sourceLabel: '포항시 퐝퐝여행 · 이가리 닻 전망대',
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
