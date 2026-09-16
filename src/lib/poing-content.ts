import { officialPlaceById, POHANG_RECIPE_URL } from './pohang-official';

const official = officialPlaceById;

export const timeSlots = [
  {
    key: 'dawn',
    rail: '06',
    time: '06:00',
    place: official.homigot.shortTitle,
    copy: '동쪽 끝에서 포항의 하루가 시작됩니다.',
    imageUrl: official.homigot.imageUrl,
    sourceUrl: official.homigot.sourceUrl,
  },
  {
    key: 'day',
    rail: '15',
    time: '15:00',
    place: official.yeongildae.shortTitle,
    copy: '바다를 따라 걷고, 다음 풍경으로 천천히 이어집니다.',
    imageUrl: official.yeongildae.imageUrl,
    sourceUrl: official.yeongildae.sourceUrl,
  },
  {
    key: 'sunset',
    rail: '19',
    time: '19:30',
    place: official.spacewalk.shortTitle,
    copy: '노을과 야경 사이에서 포항의 밀도가 높아집니다.',
    imageUrl: official.spacewalk.imageUrl,
    sourceUrl: official.spacewalk.sourceUrl,
  },
  {
    key: 'night',
    rail: '21',
    time: '21:00',
    place: official.jukdo.shortTitle,
    copy: '하루의 마지막은 불빛과 사람들의 온도로 남습니다.',
    imageUrl: official.jukdo.imageUrl,
    sourceUrl: official.jukdo.sourceUrl,
  },
];

export const tripSteps = [
  { href: '/plan/create', key: 'create', label: '조건', caption: '취향만 입력' },
  { href: '/plan/generating', key: 'generate', label: '생성', caption: '데이터 분석' },
  { href: '/plan/confirm', key: 'itinerary', label: '일정', caption: '코스 확인' },
  { href: '/insight', key: 'detail', label: '근거', caption: '추천 이유' },
  { href: '/travel/active', key: 'map', label: '진행', caption: '지도와 다음 장소' },
  { href: '/travel/modify', key: 'replace', label: '변경', caption: '혼잡 회피' },
  { href: '/travel/finish', key: 'memory', label: '기록', caption: '여행 저장' },
];

export const eventTrail = [
  { key: 'guest_recognized', label: '여행자 인식' },
  { key: 'trip_created', label: '여행 생성' },
  { key: 'itinerary_generated', label: '일정 생성' },
  { key: 'route_clicked', label: '길찾기 선택' },
  { key: 'place_replaced', label: '장소 변경' },
  { key: 'trip_saved', label: '여행 저장' },
];

export const itineraryPlaces = [
  {
    id: 'yeongildae',
    time: '15:00',
    name: official.yeongildae.shortTitle,
    officialTitle: official.yeongildae.title,
    category: official.yeongildae.category,
    address: official.yeongildae.address,
    image: 'sea',
    imageUrl: official.yeongildae.imageUrl,
    imageAlt: official.yeongildae.imageAlt,
    sourceUrl: official.yeongildae.sourceUrl,
    sourceLabel: official.yeongildae.sourceLabel,
    sourceTag: official.yeongildae.sourceTag,
    description: official.yeongildae.description,
    reason: '공식 핫플레이스인 영일대 야경 코스를 도착 직후 가벼운 바다 산책으로 시작해요.',
    duration: '90분',
    congestion: '보통',
    parking: '가능',
    next: '스페이스워크까지 차량 12분',
  },
  {
    id: 'spacewalk',
    time: '17:30',
    name: official.spacewalk.shortTitle,
    officialTitle: official.spacewalk.title,
    category: official.spacewalk.category,
    address: official.spacewalk.address,
    image: 'sunset',
    imageUrl: official.spacewalk.imageUrl,
    imageAlt: official.spacewalk.imageAlt,
    sourceUrl: official.spacewalk.sourceUrl,
    sourceLabel: official.spacewalk.sourceLabel,
    sourceTag: official.spacewalk.sourceTag,
    description: official.spacewalk.description,
    reason: '포항시 핫플레이스인 스페이스워크를 노을 시간대에 맞춰 이어지는 코스로 배치했어요.',
    duration: '70분',
    congestion: '혼잡 예상',
    parking: '가능',
    next: '죽도시장까지 차량 18분',
  },
  {
    id: 'jukdo',
    time: '20:00',
    name: official.jukdo.shortTitle,
    officialTitle: official.jukdo.title,
    category: official.jukdo.category,
    address: official.jukdo.address,
    image: 'night',
    imageUrl: official.jukdo.imageUrl,
    imageAlt: official.jukdo.imageAlt,
    sourceUrl: official.jukdo.sourceUrl,
    sourceLabel: official.jukdo.sourceLabel,
    sourceTag: official.jukdo.sourceTag,
    description: official.jukdo.description,
    reason: '포항 전통시장 코스의 대표 장소라 저녁 식사와 기록 화면으로 자연스럽게 마무리돼요.',
    duration: '80분',
    congestion: '보통',
    parking: '주변 공영',
    next: '여행 기록 생성',
  },
];

export const createOptions = {
  duration: ['당일치기', '1박2일', '2박3일+'],
  transport: ['자차', '대중교통', '도보 중심'],
  companion: ['혼자', '연인', '친구', '가족', '단체'],
  purpose: ['힐링/산책', '인생샷 찍기', '체험/액티비티', '역사탐방', '쇼핑/전통시장 투어'],
};

export const generationSteps = [
  '포항 관광지 후보 불러오는 중',
  '포항 레시피 조건 매칭 중',
  '관광지별 연관성 확인 중',
  '방문자 흐름 반영 중',
  '혼잡 예상 시간 확인 중',
  '이동 동선 계산 중',
  '일정 문장 정리 중',
];

export const apiPills = [
  '국문 관광정보',
  '관광사진',
  '포항 레시피',
  '연관 관광지',
  '지역별 방문자수',
  '집중률 예측',
  '카카오 길찾기',
];

export const recipeSource = {
  label: '포항시 퐝여행 레시피',
  url: POHANG_RECIPE_URL,
};

export const recipePresets = [
  {
    id: 'hot-place',
    title: '포항 핵심 포인트',
    from: '핫플레이스',
    companions: ['혼자', '친구', '연인', '가족'],
    purposes: ['인생샷 찍기', '체험/액티비티'],
    route: ['영일대', '스페이스워크', '죽도시장'],
    copy: '처음 온 사람도 포항의 인상을 빠르게 잡을 수 있는 대표 장소 중심 코스',
  },
  {
    id: 'date-ocean',
    title: '연인과 낭만의 포항탐험',
    from: '데이트코스',
    companions: ['연인'],
    purposes: ['힐링/산책', '인생샷 찍기'],
    route: ['영일대', '스페이스워크', '죽도시장'],
    copy: '바다 산책, 노을, 야경이 끊기지 않도록 시간대를 맞추는 감성 코스',
  },
  {
    id: 'market-food',
    title: '전통시장의 정을 찾아서',
    from: '전통시장 투어',
    companions: ['혼자', '친구', '가족', '단체'],
    purposes: ['쇼핑/전통시장 투어'],
    route: ['죽도시장', '영일대', '포항운하'],
    copy: '먹거리와 시장의 활기를 중심으로 하루의 밀도를 높이는 식도락 코스',
  },
  {
    id: 'history-south',
    title: '현대에서 과거로 시간 여행',
    from: '역사탐방',
    companions: ['혼자', '친구', '연인', '가족'],
    purposes: ['역사탐방'],
    route: ['호미곶', '구룡포', '죽도시장'],
    copy: '호미반도와 구룡포의 이야기를 따라 남부권으로 확장하는 코스',
  },
];

export const findRecipePreset = (companion: string, purpose: string) =>
  recipePresets.find((preset) => preset.companions.includes(companion) && preset.purposes.includes(purpose)) ??
  recipePresets[0];

export const visitorGroups = [
  {
    title: '외국인 방문 흐름',
    caption: '국가별 방문 추세',
    items: [
      { label: '일본', value: 34 },
      { label: '대만', value: 21 },
      { label: '미국', value: 12 },
      { label: '베트남', value: 8 },
    ],
  },
  {
    title: '국내 유입 흐름',
    caption: '지역별 방문 추세',
    items: [
      { label: '대구', value: 27 },
      { label: '부산', value: 18 },
      { label: '서울', value: 16 },
      { label: '울산', value: 10 },
    ],
  },
];

export const records = [
  { title: '여름, 바다와 야경', meta: '영일대 · 스페이스워크 · 죽도시장' },
  { title: '새벽의 호미곶', meta: '호미곶 · 구룡포 · 카페' },
  { title: '비 오는 날의 포항', meta: '구룡포 · 시장 · 실내 카페' },
];
