export type IntegrationState = 'configured' | 'missing-key' | 'mock-fallback';

export type IntegrationStatus = {
  key: string;
  label: string;
  purpose: string;
  env: string[];
  state: IntegrationState;
  requiredForMvp: boolean;
};

const hasAnyEnv = (keys: string[]) => keys.some((key) => Boolean(process.env[key]?.trim()));

export const getIntegrationStatus = (): IntegrationStatus[] => {
  const statuses: Array<Omit<IntegrationStatus, 'state'>> = [
    {
      key: 'kto-tour',
      label: '한국관광공사 국문 관광정보 API',
      purpose: 'areaBasedList2, detailCommon2, detailIntro2, detailImage2로 포항 장소 후보와 상세 정보 조회',
      env: ['KTO_SERVICE_KEY', 'TOUR_API_SERVICE_KEY'],
      requiredForMvp: true,
    },
    {
      key: 'kto-photo',
      label: '한국관광공사 관광사진 API',
      purpose: '관광사진 검색 결과를 랜딩, 장소 카드, 기록 화면 이미지 후보로 사용',
      env: ['KTO_PHOTO_SERVICE_KEY', 'KTO_SERVICE_KEY', 'TOUR_API_SERVICE_KEY'],
      requiredForMvp: true,
    },
    {
      key: 'kto-related',
      label: '관광지별 연관 관광지 API',
      purpose: '장소 교체, 다음 장소 추천, 코스 연결성 근거',
      env: ['KTO_RELATED_SERVICE_KEY', 'KTO_SERVICE_KEY', 'TOUR_API_SERVICE_KEY'],
      requiredForMvp: false,
    },
    {
      key: 'kto-congestion',
      label: '관광지 집중률 방문자 추이 예측 API',
      purpose: '혼잡 예상, 일정 변경 추천, 혼잡 회피 근거',
      env: ['KTO_CONGESTION_SERVICE_KEY', 'KTO_SERVICE_KEY', 'TOUR_API_SERVICE_KEY'],
      requiredForMvp: false,
    },
    {
      key: 'kto-visitors',
      label: '빅데이터 지역별 방문자수 API',
      purpose: '인기 장소 가중치, 방문 흐름 시각화, 추천 점수 보강',
      env: ['KTO_VISITOR_SERVICE_KEY', 'KTO_SERVICE_KEY', 'TOUR_API_SERVICE_KEY'],
      requiredForMvp: false,
    },
    {
      key: 'kakao-map',
      label: 'Kakao Maps',
      purpose: '실제 지도 표시와 포항 장소 마커',
      env: ['NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY'],
      requiredForMvp: false,
    },
    {
      key: 'kakao-mobility',
      label: 'Kakao Mobility 길찾기 API',
      purpose: '장소 간 이동 시간, 경로, 대체 코스 계산',
      env: ['KAKAO_REST_API_KEY', 'KAKAO_MOBILITY_API_KEY'],
      requiredForMvp: false,
    },
    {
      key: 'kakao-login',
      label: 'Kakao Login',
      purpose: '계정 인식과 로그인 기반 여행 기록 연결',
      env: ['KAKAO_REST_API_KEY', 'KAKAO_REDIRECT_URI'],
      requiredForMvp: false,
    },
    {
      key: 'supabase',
      label: 'Supabase / PostgreSQL',
      purpose: '여행 생성, 저장, 피드백, 별점, 사용자 행동 로그 저장',
      env: ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
      requiredForMvp: false,
    },
    {
      key: 'openai',
      label: 'OpenAI',
      purpose: '일정 설명, 추천 이유, 여행 기록 문장 생성',
      env: ['OPENAI_API_KEY'],
      requiredForMvp: false,
    },
    {
      key: 'gemini',
      label: 'Gemini',
      purpose: '보조 일정 생성, 추천 문구 생성, 후보 재정렬',
      env: ['GEMINI_API_KEY'],
      requiredForMvp: false,
    },
  ];

  return statuses.map((status) => ({
    ...status,
    state: (status.key === 'supabase' || status.key === 'kakao-login'
      ? status.env.every((envKey) => Boolean(process.env[envKey]?.trim()))
      : hasAnyEnv(status.env)) ? 'configured' : 'missing-key',
  }));
};

export const getMissingRequiredIntegrations = () =>
  getIntegrationStatus().filter((status) => status.requiredForMvp && status.state === 'missing-key');
