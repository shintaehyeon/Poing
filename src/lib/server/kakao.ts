export type TravelMode = 'car' | 'transit' | 'walk';
export type Coordinate = { x: string; y: string };
export type KakaoRouteSummary = {
  connected: boolean;
  source: string;
  mode: TravelMode;
  distanceMeters?: number;
  durationSeconds?: number;
  busLines?: string[];
  transfers?: number;
  landingUrl?: string;
  message: string;
};

const modeLabel = { car: '차량', transit: '대중교통', walk: '도보' };

export const getKakaoRouteSummary = async (
  origin?: Coordinate,
  destination?: Coordinate,
  mode: TravelMode = 'car',
): Promise<KakaoRouteSummary> => {
  const key = process.env.KAKAO_MOBILITY_API_KEY ?? process.env.KAKAO_REST_API_KEY;
  const fallback = (message: string): KakaoRouteSummary => ({ connected: false, source: '미연결', mode, message });
  if (!key || !origin || !destination) return fallback(`${modeLabel[mode]} 경로를 계산할 키 또는 좌표가 없습니다.`);

  const url = mode === 'car'
    ? new URL('https://apis-navi.kakaomobility.com/v1/directions')
    : new URL(`https://dapi.kakao.com/v2/routing/${mode === 'walk' ? 'walk' : 'publictraffic'}`);
  if (mode === 'car') {
    url.searchParams.set('origin', `${origin.x},${origin.y}`);
    url.searchParams.set('destination', `${destination.x},${destination.y}`);
    url.searchParams.set('priority', 'RECOMMEND');
  } else {
    url.searchParams.set('start_x', origin.x);
    url.searchParams.set('start_y', origin.y);
    url.searchParams.set('end_x', destination.x);
    url.searchParams.set('end_y', destination.y);
  }

  try {
    const response = await fetch(url, {
      headers: { Authorization: `KakaoAK ${key}` },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 60 * 10 },
    });
    if (!response.ok) throw new Error(`Kakao ${response.status}`);
    const data = await response.json() as {
      properties?: { landingURL?: string };
      route?: { properties?: { totalDistance?: number; totalTime?: number; landingUrl?: string } };
      routes?: Array<{
        summary?: { distance?: number; duration?: number };
        properties?: { totalDistance?: number; totalTime?: number; transfers?: number };
        steps?: Array<{ properties?: { vehicles?: Array<{ name?: string }> } }>;
      }>;
    };
    const car = data.routes?.[0]?.summary;
    const route = mode === 'walk' ? data.route?.properties : data.routes?.[0]?.properties;
    const distanceMeters = mode === 'car' ? car?.distance : route?.totalDistance;
    const durationSeconds = mode === 'car' ? car?.duration : route?.totalTime;
    if (typeof distanceMeters !== 'number' || typeof durationSeconds !== 'number') throw new Error('경로 없음');
    const busLines = mode === 'transit'
      ? Array.from(new Set(data.routes?.[0]?.steps?.flatMap((step) => step.properties?.vehicles?.map((vehicle) => vehicle.name).filter((name): name is string => Boolean(name)) ?? []) ?? []))
      : undefined;
    return {
      connected: true,
      source: `Kakao ${modeLabel[mode]} 길찾기`, mode, distanceMeters, durationSeconds, busLines,
      transfers: data.routes?.[0]?.properties?.transfers,
      landingUrl: mode === 'walk' ? data.route?.properties?.landingUrl : data.properties?.landingURL,
      message: `${modeLabel[mode]} 경로를 계산했습니다.`,
    };
  } catch {
    if (mode === 'transit') {
      const walking = await getKakaoRouteSummary(origin, destination, 'walk');
      if (walking.connected) return { ...walking, message: '버스 경로가 없어 도보 경로로 안내합니다.' };
    }
    return fallback(`${modeLabel[mode]} 경로를 불러오지 못했습니다.`);
  }
};
