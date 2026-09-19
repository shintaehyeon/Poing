const BASE = 'https://apis.data.go.kr/B551011';
const DISTRICTS = ['47111', '47113'];
const key = (service: string) => {
  const specific = service === 'TarRlteTarService1'
    ? process.env.KTO_RELATED_SERVICE_KEY
    : service === 'TatsCnctrRateService'
      ? process.env.KTO_CONGESTION_SERVICE_KEY
      : process.env.KTO_VISITOR_SERVICE_KEY;
  return specific || process.env.KTO_SERVICE_KEY || process.env.TOUR_API_SERVICE_KEY || '';
};
const stamp = (date: Date) => `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
const amount = (value?: string) => Number(String(value ?? '0').replaceAll(',', '')) || 0;

type Envelope<T> = {
  resultCode?: string;
  resultMsg?: string;
  response?: {
    header?: { resultCode?: string; resultMsg?: string };
    body?: { items?: { item?: T | T[] } };
  };
  header?: { resultCode?: string; resultMsg?: string };
  body?: { items?: { item?: T | T[] } };
};

async function requestItems<T>(service: string, operation: string, params: Record<string, string | number>): Promise<T[]> {
  const query = new URLSearchParams({
    MobileOS: 'ETC',
    MobileApp: 'POING',
    _type: 'json',
    ...Object.fromEntries(Object.entries(params).map(([name, value]) => [name, String(value)])),
  });
  const serviceKey = key(service);
  const encodedKey = serviceKey.includes('%') ? serviceKey : encodeURIComponent(serviceKey);
  const response = await fetch(`${BASE}/${service}/${operation}?serviceKey=${encodedKey}&${query}`, {
    signal: AbortSignal.timeout(10000),
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`${operation} HTTP ${response.status}`);
  const rawText = await response.text();
  const trimmed = rawText.trim();
  if (trimmed.startsWith('<')) {
    const errMsgMatch = trimmed.match(/<errMsg>(.*?)<\/errMsg>/i) || trimmed.match(/<returnAuthMsg>(.*?)<\/returnAuthMsg>/i);
    const errMsg = errMsgMatch ? errMsgMatch[1] : '공공데이터포털 XML 응답';
    throw new Error(`${operation}: ${errMsg}`);
  }
  let data: Envelope<T>;
  try {
    data = JSON.parse(rawText) as Envelope<T>;
  } catch {
    throw new Error(`${operation}: OpenAPI JSON 파싱 실패`);
  }
  const header = data.response?.header ?? data.header;
  const body = data.response?.body ?? data.body;
  const code = header?.resultCode ?? data.resultCode;
  if (code && code !== '0000') {
    throw new Error(data.resultMsg ?? header?.resultMsg ?? `${operation} 응답 오류`);
  }
  const items = body?.items?.item;
  return items ? (Array.isArray(items) ? items : [items]) : [];
}

type RelatedItem = {
  tAtsNm?: string;
  rlteTatsNm?: string;
  rlteRank?: string;
  rlteCtgryLclsNm?: string;
  rlteRegnNm?: string;
  rlteSignguNm?: string;
};

type CongestionItem = { baseYmd?: string; tAtsNm?: string; cnctrRate?: string };
type VisitorItem = {
  baseYmd?: string;
  signguCode?: string;
  touNum?: string;
  touDivNm?: string;
};

export type RelatedPlaceResult = {
  connected: boolean;
  source: string;
  baseMonth?: string;
  reason?: string;
  items: Array<{ title: string; rank: number; reason: string; category?: string; region?: string }>;
};
export type CongestionResult = {
  connected: boolean;
  source: string;
  level: '여유' | '보통' | '혼잡' | '미연결';
  rate?: number;
  message: string;
  forecast: Array<{ date: string; place: string; rate: number }>;
};
export type VisitorTrendResult = {
  connected: boolean;
  source: string;
  popularityScore: number;
  totalVisitors: number;
  domesticVisitors: number;
  foreignVisitors: number;
  period?: { start: string; end: string };
  message: string;
  daily: Array<{ date: string; visitors: number }>;
};

const relatedFallback: RelatedPlaceResult = {
  connected: false,
  source: 'POING 기본 추천',
  reason: '관광공사 키 또는 해당 월 데이터가 없어 기본 추천을 표시합니다.',
  items: [
    { title: '스페이스워크', rank: 1, reason: '영일대와 가까운 전망 코스' },
    { title: '환호공원', rank: 2, reason: '바다 산책과 전망 동선 연결' },
    { title: '죽도시장', rank: 3, reason: '저녁 식사 동선으로 연결' },
  ],
};

export async function getRelatedTourPlaces(keyword = '영일대해수욕장'): Promise<RelatedPlaceResult> {
  if (!key('TarRlteTarService1')) return relatedFallback;
  const baseMonth = process.env.KTO_RELATED_BASE_YM ?? '202504';
  try {
    const responses = await Promise.all(DISTRICTS.map((district) =>
      requestItems<RelatedItem>('TarRlteTarService1', 'searchKeyword1', {
        pageNo: 1, numOfRows: 50, baseYm: baseMonth, areaCd: '47', signguCd: district, keyword,
      }),
    ));
    const items = responses.flat().filter((item) => item.rlteTatsNm)
      .sort((a, b) => amount(a.rlteRank) - amount(b.rlteRank)).slice(0, 10)
      .map((item, index) => ({
        title: item.rlteTatsNm ?? '',
        rank: amount(item.rlteRank) || index + 1,
        reason: `연관 방문 동선: ${item.tAtsNm ?? keyword}`,
        category: item.rlteCtgryLclsNm,
        region: [item.rlteRegnNm, item.rlteSignguNm].filter(Boolean).join(' '),
      }));
    return items.length
      ? { connected: true, source: '한국관광공사 연관 관광지', baseMonth, items }
      : { ...relatedFallback, reason: `${baseMonth} 기준 연관 관광지 데이터가 없습니다.` };
  } catch (error) {
    return { ...relatedFallback, reason: error instanceof Error ? error.message : '연관 관광지 오류' };
  }
}

export async function getTourCongestion(placeName = '영일대해수욕장'): Promise<CongestionResult> {
  const fallback = (message: string): CongestionResult => ({
    connected: false, source: 'POING 기본 예상', level: '미연결', message, forecast: [],
  });
  if (!key('TatsCnctrRateService')) return fallback('관광공사 키가 없어 혼잡 예측을 표시하지 않습니다.');
  try {
    const responses = await Promise.all(DISTRICTS.map((district) =>
      requestItems<CongestionItem>('TatsCnctrRateService', 'tatsCnctrRatedList', {
        pageNo: 1, numOfRows: 100, areaCd: '47', signguCd: district, tAtsNm: placeName,
      }),
    ));
    const forecast = responses.flat().filter((item) => item.baseYmd && item.tAtsNm)
      .map((item) => ({ date: item.baseYmd ?? '', place: item.tAtsNm ?? '', rate: amount(item.cnctrRate) }))
      .sort((a, b) => a.date.localeCompare(b.date)).slice(0, 30);
    if (!forecast.length) return fallback(`${placeName} 예측 데이터가 없습니다.`);
    const rate = forecast[0].rate;
    return {
      connected: true, source: '한국관광공사 집중률 예측',
      level: rate >= 67 ? '혼잡' : rate >= 34 ? '보통' : '여유',
      rate, message: '가장 붐비는 시기를 100으로 본 상대 집중률입니다.', forecast,
    };
  } catch (error) {
    return fallback(error instanceof Error ? error.message : '혼잡 예측 오류');
  }
}

export async function getVisitorTrend(): Promise<VisitorTrendResult> {
  const end = new Date();
  end.setDate(end.getDate() - 45);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  const period = {
    start: process.env.KTO_VISITOR_START_YMD || stamp(start),
    end: process.env.KTO_VISITOR_END_YMD || stamp(end),
  };
  const fallback = (message: string): VisitorTrendResult => ({
    connected: false, source: '미연결', popularityScore: 0, totalVisitors: 0,
    domesticVisitors: 0, foreignVisitors: 0, period, message, daily: [],
  });
  if (!key('DataLabService')) return fallback('관광공사 키가 없어 방문자 수를 표시하지 않습니다.');
  try {
    const items = await requestItems<VisitorItem>('DataLabService', 'locgoRegnVisitrDDList', {
      pageNo: 1, numOfRows: 10000, startYmd: period.start, endYmd: period.end,
    });
    const pohang = items.filter((item) => DISTRICTS.includes(item.signguCode ?? ''));
    const dailyMap = new Map<string, number>();
    for (const item of pohang) {
      if (item.baseYmd) dailyMap.set(item.baseYmd, (dailyMap.get(item.baseYmd) ?? 0) + amount(item.touNum));
    }
    const domesticVisitors = pohang.filter((item) => !item.touDivNm?.includes('외국'))
      .reduce((sum, item) => sum + amount(item.touNum), 0);
    const foreignVisitors = pohang.filter((item) => item.touDivNm?.includes('외국'))
      .reduce((sum, item) => sum + amount(item.touNum), 0);
    const totalVisitors = domesticVisitors + foreignVisitors;
    if (!pohang.length) return fallback('이 기간의 포항 방문자 데이터가 없습니다.');
    return {
      connected: true, source: '한국관광공사 지역별 방문자수', popularityScore: 0,
      totalVisitors, domesticVisitors, foreignVisitors, period,
      message: '포항 남구·북구의 일자별 방문자 수 합계입니다. 중복 없는 누적 관광객 수는 아닙니다.',
      daily: Array.from(dailyMap, ([date, visitors]) => ({ date, visitors })).sort((a, b) => a.date.localeCompare(b.date)),
    };
  } catch (error) {
    return fallback(error instanceof Error ? error.message : '방문자 수 오류');
  }
}
