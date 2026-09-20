import { officialPlaceById } from './pohang-official';

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
  { href: '/travel/modify', key: 'replace', label: '변경', caption: '장소 변경' },
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

const itineraryPlaceIdsByRegion: Record<string, string[]> = {
  북포항: ['igari', 'spacewalk', 'hwanho'],
  구도심: ['yeongildae', 'spacewalk', 'jukdo'],
  남포항: ['homigot', 'guryongpo', 'lighthouse'],
  힐링코스: ['igari', 'hwanho', 'spacewalk'],
};

export const buildFallbackItinerary = (region = '구도심'): typeof itineraryPlaces => {
  const ids = itineraryPlaceIdsByRegion[region] ?? itineraryPlaceIdsByRegion.구도심;
  return ids.map((id, index) => {
    const place = officialPlaceById[id];
    const template = itineraryPlaces[index] ?? itineraryPlaces[0];
    const nextPlace = officialPlaceById[ids[index + 1]];
    return {
      ...template,
      id: place.id,
      name: place.shortTitle,
      officialTitle: place.title,
      category: place.category,
      address: place.address,
      imageUrl: place.imageUrl,
      imageAlt: place.imageAlt,
      sourceUrl: place.sourceUrl,
      sourceLabel: place.sourceLabel,
      sourceTag: place.sourceTag,
      description: place.description,
      reason: `${region} 이동 흐름을 고려해 ${index + 1}번째 장면은 ${place.shortTitle}에서 시작하도록 배치했어요.`,
      next: nextPlace ? `${nextPlace.shortTitle}으로 이동` : '여행 기록 생성',
    };
  });
};

export const regionRoutes = [
  {
    id: 'north',
    label: '북포항',
    headline: '바다와 전망이 이어지는 북포항 해안 여행',
    keyword: '북포항 해안',
    description: '이가리 닻 전망대, 청하공진시장, 곤륜산, 스페이스워크를 묶어 바다 전망과 사진 포인트를 넓게 잡습니다.',
    accent: 'green',
    categories: [
      { label: '포항10미', mark: '10' },
      { label: '전망', mark: '전' },
      { label: 'TV촬영지', mark: '촬' },
      { label: '해수욕장', mark: '해' },
      { label: '사진', mark: '샷' },
      { label: '숙소', mark: '숙' },
    ],
    courses: [
      {
        label: '1코스',
        tone: 'orange',
        places: ['이가리 닻 전망대', '청하공진시장', '곤륜산 활공장', '스페이스워크'],
      },
      {
        label: '2코스',
        tone: 'pink',
        places: ['경상북도수목원', '내연산 보경사', '청하공진시장', '이가리 닻 전망대'],
      },
      {
        label: '3코스',
        tone: 'blue',
        places: ['영일대전망대', '스페이스워크', '이가리 닻 전망대', '곤륜산 활공장'],
      },
    ],
  },
  {
    id: 'oldtown',
    label: '구도심',
    headline: '걸어서 이어지는 포항 구도심 미식·야경 여행',
    keyword: '구도심',
    description: '도착 직후 움직이기 쉬운 영일대, 환호공원, 죽도시장, 포항운하를 묶어 포항의 첫인상을 빠르게 잡습니다.',
    accent: 'pink',
    categories: [
      { label: '포항10미', mark: '10' },
      { label: '야경', mark: '야' },
      { label: '체험', mark: '체' },
      { label: '시장', mark: '장' },
      { label: '산책', mark: '길' },
      { label: '맛집', mark: '맛' },
    ],
    courses: [
      {
        label: '1코스',
        tone: 'orange',
        places: ['영일대전망대', '스페이스워크', '죽도시장', '포항운하'],
      },
      {
        label: '2코스',
        tone: 'pink',
        places: ['포항문화원', '학도의용군 전승기념관', '죽도시장', '포항운하'],
      },
      {
        label: '3코스',
        tone: 'blue',
        places: ['Park1538 포스코역사박물관', '포항중앙상가', '영일대전망대', '스페이스워크'],
      },
    ],
  },
  {
    id: 'south',
    label: '남포항',
    headline: '구룡포와 호미곶을 잇는 남포항 시간 여행',
    keyword: '남포항',
    description: '구룡포 근대거리, 호미곶, 연오랑세오녀처럼 포항의 오래된 이야기와 일출 동선을 함께 엮습니다.',
    accent: 'gold',
    categories: [
      { label: '포항10미', mark: '10' },
      { label: '문화', mark: '문' },
      { label: '일출', mark: '해' },
      { label: '해안길', mark: '길' },
      { label: '시장', mark: '장' },
      { label: '숙소', mark: '숙' },
    ],
    courses: [
      {
        label: '1코스',
        tone: 'orange',
        places: ['연오랑세오녀테마공원', '구룡포 일본인 가옥거리', '구룡포과메기문화관', '호미곶 해맞이광장'],
      },
      {
        label: '2코스',
        tone: 'pink',
        places: ['구룡포 주상절리', '국립등대박물관', '호미곶 해맞이광장', '구룡포 일본인 가옥거리'],
      },
      {
        label: '3코스',
        tone: 'blue',
        places: ['Park1538 포스코역사박물관', '연오랑세오녀테마공원', '구룡포과메기문화관', '구룡포 일본인 가옥거리'],
      },
    ],
  },
  {
    id: 'healing',
    label: '힐링코스',
    headline: '내연산과 숲길로 쉬어가는 힐링 여행',
    keyword: '힐링',
    description: '보경사와 내연산, 수목원, 오어사처럼 이동 자체가 느려지는 숲·사찰 중심 코스입니다.',
    accent: 'blue',
    categories: [
      { label: '숲길', mark: '숲' },
      { label: '사찰', mark: '절' },
      { label: '폭포', mark: '폭' },
      { label: '산책', mark: '길' },
      { label: '쉼', mark: '쉼' },
      { label: '숙소', mark: '숙' },
    ],
    courses: [
      {
        label: '1코스',
        tone: 'orange',
        places: ['내연산 보경사', '경상북도수목원', '곡강천생태공원'],
      },
      {
        label: '2코스',
        tone: 'pink',
        places: ['오어사', '곡강천생태공원', '경상북도수목원'],
      },
      {
        label: '3코스',
        tone: 'blue',
        places: ['곤륜산 활공장', '내연산 보경사', '이가리 닻 전망대'],
      },
    ],
  },
];

export type RegionRoute = (typeof regionRoutes)[number];

export const findRegionRoute = (region?: string) =>
  regionRoutes.find((route) => route.id === region || route.label === region) ?? regionRoutes[0];

export const pohangMapRoutes = [
  {
    id: 'north',
    label: '북포항',
    title: '북포항 해안 전망 루트',
    summary: '이가리 닻 전망대와 월포를 따라 북쪽 바다를 크게 쓰는 코스입니다.',
    accent: '#57936f',
    transitFocus: '5000번 + 청하4번',
    shape: 'M365 36 L522 78 L588 176 L528 254 L396 214 L318 142 Z',
    pins: [
      { name: '이가리 닻 전망대', x: 405, y: 103 },
      { name: '월포해수욕장', x: 474, y: 83 },
      { name: '청하공진시장', x: 425, y: 160 },
      { name: '스페이스워크', x: 333, y: 228 },
    ],
    segments: [
      { from: '이가리 닻 전망대', to: '월포해수욕장', km: '5.3km', bus: '청하4번 또는 택시' },
      { from: '월포해수욕장', to: '청하공진시장', km: '4.5km', bus: '청하4번' },
      { from: '청하공진시장', to: '스페이스워크', km: '23.0km', bus: '5000번 + 9000번 환승' },
    ],
  },
  {
    id: 'oldtown',
    label: '구도심',
    title: '구도심 야경·시장 루트',
    summary: '영일대, 환호공원, 죽도시장, 운하를 짧게 연결하는 가장 서비스다운 기본 코스입니다.',
    accent: '#dd3d88',
    transitFocus: '9000번 + 209번',
    shape: 'M250 202 L418 195 L474 305 L394 382 L246 348 L196 265 Z',
    pins: [
      { name: '영일대해수욕장', x: 343, y: 238 },
      { name: '스페이스워크', x: 326, y: 204 },
      { name: '죽도시장', x: 291, y: 305 },
      { name: '포항운하', x: 276, y: 347 },
    ],
    segments: [
      { from: '영일대해수욕장', to: '스페이스워크', km: '2.1km', bus: '9000번 하차 후 도보' },
      { from: '스페이스워크', to: '죽도시장', km: '5.8km', bus: '9000번' },
      { from: '죽도시장', to: '포항운하', km: '1.5km', bus: '209번 또는 도보' },
    ],
  },
  {
    id: 'south',
    label: '남포항',
    title: '남포항 일출·근대거리 루트',
    summary: '구룡포와 호미곶을 한 축으로 잡아 포항의 시간성을 가장 강하게 보여줍니다.',
    accent: '#d08b40',
    transitFocus: '9000번 + 900번',
    shape: 'M302 342 L440 336 L540 438 L450 510 L286 488 L214 406 Z',
    pins: [
      { name: '도구해수욕장', x: 313, y: 353 },
      { name: '연오랑세오녀', x: 363, y: 391 },
      { name: '구룡포 일본인 가옥거리', x: 447, y: 392 },
      { name: '호미곶', x: 518, y: 448 },
    ],
    segments: [
      { from: '도구해수욕장', to: '연오랑세오녀', km: '3.8km', bus: '900번·9000번 인근 하차' },
      { from: '연오랑세오녀', to: '구룡포 일본인 가옥거리', km: '20.4km', bus: '9000번' },
      { from: '구룡포 일본인 가옥거리', to: '호미곶', km: '13.5km', bus: '9000번' },
    ],
  },
  {
    id: 'healing',
    label: '힐링코스',
    title: '숲과 사찰 회복 루트',
    summary: '내연산, 보경사, 수목원처럼 이동보다 머무름이 중요한 코스입니다.',
    accent: '#4b789a',
    transitFocus: '5000번 중심',
    shape: 'M98 112 L278 62 L356 170 L278 328 L108 296 L52 194 Z',
    pins: [
      { name: '보경사', x: 440, y: 92 },
      { name: '내연산 12폭포', x: 412, y: 55 },
      { name: '경상북도수목원', x: 248, y: 142 },
      { name: '오어사', x: 178, y: 358 },
    ],
    segments: [
      { from: '보경사', to: '내연산 12폭포', km: '2.6km', bus: '도보 산책 구간' },
      { from: '내연산 12폭포', to: '경상북도수목원', km: '17.8km', bus: '5000번 + 택시 권장' },
      { from: '경상북도수목원', to: '오어사', km: '39.6km', bus: '자차 또는 택시 권장' },
    ],
  },
];

export type PohangMapRoute = (typeof pohangMapRoutes)[number];

export const findPohangMapRoute = (region?: string) =>
  pohangMapRoutes.find((route) => route.id === region || route.label === region) ?? pohangMapRoutes[1];

export const bestPohangGroups = [
  {
    id: 'hot',
    label: '핫플레이스',
    items: [
      { name: '스페이스워크', imageUrl: official.spacewalk.imageUrl, imageAlt: official.spacewalk.imageAlt, sourceUrl: official.spacewalk.sourceUrl },
      { name: '포항 스페이스워크', imageUrl: official.spacewalk.imageUrl, imageAlt: official.spacewalk.imageAlt, sourceUrl: official.spacewalk.sourceUrl },
      { name: '영일대&포스코 야경', imageUrl: official.yeongildae.imageUrl, imageAlt: official.yeongildae.imageAlt, sourceUrl: official.yeongildae.sourceUrl },
      { name: '포항운하', imageUrl: official.jukdo.imageUrl, imageAlt: official.jukdo.imageAlt, sourceUrl: official.jukdo.sourceUrl },
      { name: '철길숲&불의 정원', imageUrl: official.hwanho.imageUrl, imageAlt: official.hwanho.imageAlt, sourceUrl: official.hwanho.sourceUrl },
      { name: '상생의 손', imageUrl: official.homigot.imageUrl, imageAlt: official.homigot.imageAlt, sourceUrl: official.homigot.sourceUrl },
    ],
  },
  {
    id: 'tv-north',
    label: 'TV촬영지(북부)',
    items: [
      { name: '청하공진시장', imageUrl: official.igari.imageUrl, imageAlt: official.igari.imageAlt, sourceUrl: official.igari.sourceUrl },
      { name: '이가리 닻 전망대', imageUrl: official.igari.imageUrl, imageAlt: official.igari.imageAlt, sourceUrl: official.igari.sourceUrl },
      { name: '사방기념공원', imageUrl: official.hwanho.imageUrl, imageAlt: official.hwanho.imageAlt, sourceUrl: official.hwanho.sourceUrl },
      { name: '곤륜산 활공장', imageUrl: official.igari.imageUrl, imageAlt: official.igari.imageAlt, sourceUrl: official.igari.sourceUrl },
      { name: '영일대해수욕장', imageUrl: official.yeongildae.imageUrl, imageAlt: official.yeongildae.imageAlt, sourceUrl: official.yeongildae.sourceUrl },
      { name: '철길숲&불의 정원', imageUrl: official.hwanho.imageUrl, imageAlt: official.hwanho.imageAlt, sourceUrl: official.hwanho.sourceUrl },
    ],
  },
  {
    id: 'tv-south',
    label: 'TV촬영지(남부)',
    items: [
      { name: '구룡포 일본인 가옥거리', imageUrl: official.guryongpo.imageUrl, imageAlt: official.guryongpo.imageAlt, sourceUrl: official.guryongpo.sourceUrl },
      { name: '구룡포항', imageUrl: official.guryongpo.imageUrl, imageAlt: official.guryongpo.imageAlt, sourceUrl: official.guryongpo.sourceUrl },
      { name: '호미곶 해맞이광장', imageUrl: official.homigot.imageUrl, imageAlt: official.homigot.imageAlt, sourceUrl: official.homigot.sourceUrl },
      { name: '호미반도 해안둘레길', imageUrl: official.homigot.imageUrl, imageAlt: official.homigot.imageAlt, sourceUrl: official.homigot.sourceUrl },
      { name: '연오랑세오녀 테마공원', imageUrl: official.guryongpo.imageUrl, imageAlt: official.guryongpo.imageAlt, sourceUrl: official.guryongpo.sourceUrl },
      { name: '장길리복합낚시공원', imageUrl: official.homigot.imageUrl, imageAlt: official.homigot.imageAlt, sourceUrl: official.homigot.sourceUrl },
    ],
  },
  {
    id: 'date',
    label: '데이트코스',
    items: [
      { name: '포항스틸야드', imageUrl: official.yeongildae.imageUrl, imageAlt: official.yeongildae.imageAlt, sourceUrl: official.yeongildae.sourceUrl },
      { name: '포항크루즈', imageUrl: official.jukdo.imageUrl, imageAlt: official.jukdo.imageAlt, sourceUrl: official.jukdo.sourceUrl },
      { name: '포항운하', imageUrl: official.jukdo.imageUrl, imageAlt: official.jukdo.imageAlt, sourceUrl: official.jukdo.sourceUrl },
      { name: '죽도어시장', imageUrl: official.jukdo.imageUrl, imageAlt: official.jukdo.imageAlt, sourceUrl: official.jukdo.sourceUrl },
      { name: '송도해변', imageUrl: official.yeongildae.imageUrl, imageAlt: official.yeongildae.imageAlt, sourceUrl: official.yeongildae.sourceUrl },
      { name: '용한리 해수욕장', imageUrl: official.yeongildae.imageUrl, imageAlt: official.yeongildae.imageAlt, sourceUrl: official.yeongildae.sourceUrl },
    ],
  },
  {
    id: 'healing',
    label: '힐링여행',
    items: [
      { name: '연오랑세오녀 테마공원', imageUrl: official.guryongpo.imageUrl, imageAlt: official.guryongpo.imageAlt, sourceUrl: official.guryongpo.sourceUrl },
      { name: '장기읍성&유배문화체험촌', imageUrl: official.guryongpo.imageUrl, imageAlt: official.guryongpo.imageAlt, sourceUrl: official.guryongpo.sourceUrl },
      { name: '운제산 오어사 사계', imageUrl: official.hwanho.imageUrl, imageAlt: official.hwanho.imageAlt, sourceUrl: official.hwanho.sourceUrl },
      { name: '송도솔밭도시숲', imageUrl: official.yeongildae.imageUrl, imageAlt: official.yeongildae.imageAlt, sourceUrl: official.yeongildae.sourceUrl },
      { name: '경상북도수목원', imageUrl: official.igari.imageUrl, imageAlt: official.igari.imageAlt, sourceUrl: official.igari.sourceUrl },
      { name: '내연산 치유의 숲', imageUrl: official.igari.imageUrl, imageAlt: official.igari.imageAlt, sourceUrl: official.igari.sourceUrl },
    ],
  },
  {
    id: 'market',
    label: '전통시장의 정을 찾아서',
    items: [
      { name: '죽도어시장', imageUrl: official.jukdo.imageUrl, imageAlt: official.jukdo.imageAlt, sourceUrl: official.jukdo.sourceUrl },
      { name: '영일대 북부시장', imageUrl: official.yeongildae.imageUrl, imageAlt: official.yeongildae.imageAlt, sourceUrl: official.yeongildae.sourceUrl },
      { name: '남부종합시장', imageUrl: official.guryongpo.imageUrl, imageAlt: official.guryongpo.imageAlt, sourceUrl: official.guryongpo.sourceUrl },
      { name: '큰동해시장', imageUrl: official.jukdo.imageUrl, imageAlt: official.jukdo.imageAlt, sourceUrl: official.jukdo.sourceUrl },
      { name: '오천시장', imageUrl: official.guryongpo.imageUrl, imageAlt: official.guryongpo.imageAlt, sourceUrl: official.guryongpo.sourceUrl },
      { name: '효자시장', imageUrl: official.jukdo.imageUrl, imageAlt: official.jukdo.imageAlt, sourceUrl: official.jukdo.sourceUrl },
    ],
  },
];

export const placePhotoCards = [
  {
    id: 'yeongildae-photo',
    name: official.yeongildae.shortTitle,
    region: '구도심',
    imageUrl: official.yeongildae.imageUrl,
    imageAlt: official.yeongildae.imageAlt,
    imageCredit: official.yeongildae.imageCredit,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Yeongildae_Beach_at_night_on_March_2nd,_2019.jpg',
    caption: '야경과 바다 산책을 한 번에 잡는 POING 기본 출발점',
  },
  {
    id: 'spacewalk-photo',
    name: official.spacewalk.shortTitle,
    region: '구도심',
    imageUrl: official.spacewalk.imageUrl,
    imageAlt: official.spacewalk.imageAlt,
    imageCredit: official.spacewalk.imageCredit,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:SpaceWalk_(walkable_sculpture,_Pohang_2021)_Mutter_Genth_01.jpg',
    caption: '노을 시간대 추천 근거가 가장 잘 보이는 체험형 전망 장소',
  },
  {
    id: 'homigot-photo',
    name: official.homigot.shortTitle,
    region: '남포항',
    imageUrl: official.homigot.imageUrl,
    imageAlt: official.homigot.imageAlt,
    imageCredit: official.homigot.imageCredit,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Homigot_20240113_001.jpg',
    caption: '일출 시간 계산과 가장 잘 맞물리는 포항의 상징 장소',
  },
  {
    id: 'guryongpo-photo',
    name: official.guryongpo.shortTitle,
    region: '남포항',
    imageUrl: official.guryongpo.imageUrl,
    imageAlt: official.guryongpo.imageAlt,
    imageCredit: official.guryongpo.imageCredit,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Guryongpo_Japanese_House_Street_20240113_003.jpg',
    caption: '근대 거리와 호미곶을 이어 남포항 시간 여행을 만듭니다.',
  },
  {
    id: 'jukdo-photo',
    name: official.jukdo.shortTitle,
    region: '구도심',
    imageUrl: official.jukdo.imageUrl,
    imageAlt: official.jukdo.imageAlt,
    imageCredit: official.jukdo.imageCredit,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea-Seoul-Garak_Fish_Market-02.jpg',
    caption: '정확한 죽도시장 사진은 관광사진 API 연결 시 교체 예정입니다.',
  },
  {
    id: 'igari-photo',
    name: official.igari.shortTitle,
    region: '북포항',
    imageUrl: official.igari.imageUrl,
    imageAlt: official.igari.imageAlt,
    imageCredit: official.igari.imageCredit,
    sourceUrl: official.igari.sourceUrl,
    caption: '닻 모양 전망대와 푸른 바다가 한 번에 보이는 북포항 대표 사진 포인트',
  },
];

export const createOptions = {
  region: regionRoutes.map((route) => route.label),
  duration: ['당일치기', '1박2일', '2박3일+'],
  transport: ['자차', '대중교통', '도보 중심'],
  companion: ['혼자', '연인', '친구', '가족', '단체'],
  purpose: ['힐링/산책', '인생샷 찍기', '체험/액티비티', '역사탐방', '쇼핑/전통시장 투어'],
};

export const generationSteps = [
  '포항 관광지 후보 불러오는 중',
  '선택한 여행 취향 정리하는 중',
  '권역별 코스 흐름 맞추는 중',
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

export const recommendationModes = [
  {
    id: 'compact-first',
    title: '처음 온 사람을 위한 컴팩트 코스',
    from: '대표 코스',
    defaultRegion: '구도심',
    primaryPlaceId: 'yeongildae',
    companions: ['혼자', '친구', '연인', '가족'],
    purposes: ['인생샷 찍기', '체험/액티비티'],
    route: ['영일대해수욕장', '스페이스워크', '죽도시장'],
    copy:
      '도착 후 바로 걷기 좋은 바다, 사진이 남는 전망, 저녁 식사까지 한 번에 이어지는 가장 짧고 선명한 포항 입문 코스입니다.',
    signals: ['첫 방문', '짧은 이동', '야경', '저녁 식사'],
  },
  {
    id: 'couple-sunset',
    title: '연인과 걷는 노을 코스',
    from: '연인 코스',
    defaultRegion: '구도심',
    primaryPlaceId: 'spacewalk',
    companions: ['연인'],
    purposes: ['힐링/산책', '인생샷 찍기'],
    route: ['영일대해수욕장', '스페이스워크', '환호공원', '죽도시장'],
    copy:
      '바다 산책으로 몸을 풀고, 노을 시간에 스페이스워크를 넣어 사진과 대화가 자연스럽게 이어지도록 맞춘 코스입니다.',
    signals: ['노을', '사진', '산책', '야식'],
  },
  {
    id: 'family-easy',
    title: '가족과 가기 좋은 쉬운 코스',
    from: '가족 코스',
    defaultRegion: '구도심',
    primaryPlaceId: 'yeongildae',
    companions: ['가족', '단체'],
    purposes: ['체험/액티비티', '쇼핑/전통시장 투어'],
    route: ['영일대해수욕장', '환호공원', '포항운하', '죽도시장'],
    copy:
      '동선이 복잡하지 않고 중간에 쉬어가기 좋은 장소를 우선 배치했습니다. 아이나 부모님과 함께 움직여도 부담이 적습니다.',
    signals: ['쉬운 이동', '휴식', '식사 선택지', '주차'],
  },
  {
    id: 'market-local',
    title: '먹거리 중심 로컬 코스',
    from: '시장 코스',
    defaultRegion: '구도심',
    primaryPlaceId: 'jukdo',
    companions: ['혼자', '친구', '가족', '단체'],
    purposes: ['쇼핑/전통시장 투어'],
    route: ['죽도시장', '포항운하', '영일대해수욕장'],
    copy:
      '후기에서 반복되는 만족 포인트인 회, 물회, 시장 구경을 중심에 두고 바다 산책으로 마무리하는 로컬 밀도 높은 코스입니다.',
    signals: ['물회', '시장 구경', '저녁', '로컬 분위기'],
  },
  {
    id: 'history-south',
    title: '남포항 시간여행 코스',
    from: '역사 코스',
    defaultRegion: '남포항',
    primaryPlaceId: 'guryongpo',
    companions: ['혼자', '친구', '연인', '가족'],
    purposes: ['역사탐방'],
    route: ['구룡포 일본인 가옥거리', '구룡포 근대문화역사관', '호미곶', '국립등대박물관'],
    copy:
      '구룡포의 오래된 골목과 호미곶의 일출 상징을 묶어, 사진보다 이야기가 오래 남는 남포항 코스입니다.',
    signals: ['근대거리', '일출', '역사', '남포항'],
  },
  {
    id: 'healing-view',
    title: '숨 고르는 바다 전망 코스',
    from: '힐링 코스',
    defaultRegion: '북포항',
    primaryPlaceId: 'igari',
    companions: ['혼자', '연인', '친구'],
    purposes: ['힐링/산책', '인생샷 찍기'],
    route: ['이가리 닻전망대', '월포해수욕장', '청하공진시장', '스페이스워크'],
    copy:
      '북쪽 바다를 넓게 보는 전망 포인트를 먼저 두고, 사람이 붐비는 중심지보다 여유로운 해안선을 따라 움직입니다.',
    signals: ['전망대', '해안 드라이브', '사진', '여유'],
  },
];

export type RecommendationMode = (typeof recommendationModes)[number];

export const findRecipePreset = (companion: string, purpose: string, region?: string) => {
  const regionPreset = recommendationModes.find(
    (preset) => preset.defaultRegion === region && preset.companions.includes(companion) && preset.purposes.includes(purpose),
  );
  if (regionPreset) return regionPreset;
  if (region === '힐링코스') return recommendationModes.find((preset) => preset.id === 'healing-view') ?? recommendationModes[0];
  const regionFallback = recommendationModes.find((preset) => preset.defaultRegion === region);
  return regionFallback ??
    recommendationModes.find((preset) => preset.companions.includes(companion) && preset.purposes.includes(purpose)) ??
    recommendationModes[0];
};

export const findRecommendationMode = (modeId?: string) =>
  recommendationModes.find((mode) => mode.id === modeId) ?? recommendationModes[0];

export const recipePresets = recommendationModes;

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
