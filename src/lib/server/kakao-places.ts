import type { Coordinate } from './kakao';

export type NearbyPlace = {
  id: string;
  name: string;
  category: string;
  address: string;
  distanceMeters: number;
  phone?: string;
  url: string;
};

export async function getNearbyPlaces(coordinate?: Coordinate, category: 'FD6' | 'CE7' = 'FD6') {
  const key = process.env.KAKAO_REST_API_KEY;
  if (!key || !coordinate) return { connected: false, places: [] as NearbyPlace[], message: '카카오 REST 키 또는 장소 좌표가 없습니다.' };
  const url = new URL('https://dapi.kakao.com/v2/local/search/category.json');
  url.searchParams.set('category_group_code', category);
  url.searchParams.set('x', coordinate.x);
  url.searchParams.set('y', coordinate.y);
  url.searchParams.set('radius', '4000');
  url.searchParams.set('sort', 'distance');
  url.searchParams.set('size', '10');
  try {
    const response = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` }, signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`Kakao Local ${response.status}`);
    const data = await response.json() as { documents?: Array<{
      id: string; place_name: string; category_name: string; road_address_name: string; address_name: string;
      distance: string; phone?: string; place_url: string;
    }> };
    const places = (data.documents ?? []).map((item) => ({
      id: item.id, name: item.place_name, category: item.category_name,
      address: item.road_address_name || item.address_name,
      distanceMeters: Number(item.distance) || 0, phone: item.phone, url: item.place_url,
    }));
    return { connected: true, places, message: '카카오 로컬 검색 결과입니다. 가까운 순서이며 평점 순위가 아닙니다.' };
  } catch {
    return { connected: false, places: [] as NearbyPlace[], message: '근처 장소를 불러오지 못했습니다.' };
  }
}
