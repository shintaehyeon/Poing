export const timeSlots = [
  {
    key: 'dawn',
    rail: '06',
    time: '06:00',
    place: '호미곶',
    copy: '동쪽 끝에서 포항의 하루가 시작됩니다.',
  },
  {
    key: 'day',
    rail: '15',
    time: '15:00',
    place: '영일대',
    copy: '바다를 따라 걷고, 다음 풍경으로 천천히 이어집니다.',
  },
  {
    key: 'sunset',
    rail: '19',
    time: '19:30',
    place: '스페이스워크',
    copy: '노을과 야경 사이에서 포항의 밀도가 높아집니다.',
  },
  {
    key: 'night',
    rail: '21',
    time: '21:00',
    place: '죽도시장',
    copy: '하루의 마지막은 불빛과 사람들의 온도로 남습니다.',
  },
];

export const tripSteps = [
  { href: '/plan/create', key: 'create', label: '조건', caption: '4개만 입력' },
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
    name: '영일대',
    address: '경북 포항시 북구 두호동',
    image: 'sea',
    reason: '도착 후 가볍게 걷기 좋고 스페이스워크와 연결성이 높아요.',
    duration: '90분',
    congestion: '보통',
    parking: '가능',
    next: '스페이스워크까지 차량 12분',
  },
  {
    id: 'spacewalk',
    time: '17:30',
    name: '스페이스워크',
    address: '경북 포항시 북구 환호공원길 30',
    image: 'sunset',
    reason: '영일대 산책 이후 노을 시간대에 맞춰 이어지는 코스예요.',
    duration: '70분',
    congestion: '혼잡 예상',
    parking: '가능',
    next: '죽도시장까지 차량 18분',
  },
  {
    id: 'jukdo',
    time: '20:00',
    name: '죽도시장',
    address: '경북 포항시 북구 죽도시장길 13',
    image: 'night',
    reason: '저녁 식사와 시장 산책을 하루의 마지막 기록으로 남기기 좋아요.',
    duration: '80분',
    congestion: '보통',
    parking: '주변 공영',
    next: '여행 기록 생성',
  },
];

export const createOptions = {
  duration: ['당일치기', '1박2일', '2박3일+'],
  transport: ['자차', '대중교통', '도보 중심'],
  companion: ['혼자', '연인', '친구', '가족'],
};

export const generationSteps = [
  '포항 관광지 후보 불러오는 중',
  '관광지별 연관성 확인 중',
  '방문자 흐름 반영 중',
  '혼잡 예상 시간 확인 중',
  '이동 동선 계산 중',
  '일정 문장 정리 중',
];

export const apiPills = [
  '국문 관광정보',
  '관광사진',
  '연관 관광지',
  '지역별 방문자수',
  '집중률 예측',
  '카카오 길찾기',
];

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
