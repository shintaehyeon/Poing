import type { Coordinate } from '@/lib/server/kakao';

const coordinates: Record<string, [number, number]> = {
  '이가리 닻 전망대': [36.1861, 129.3927], 월포해수욕장: [36.2058, 129.3717], 청하공진시장: [36.1974, 129.3398],
  포항해상스카이워크: [36.0701, 129.4059], 영일대해수욕장: [36.0578, 129.3781], 영일대: [36.0578, 129.3781],
  스페이스워크: [36.0664, 129.3917], 죽도시장: [36.0358, 129.3654], 포항운하: [36.0263, 129.3731],
  도구해수욕장: [35.9902, 129.4433], 연오랑세오녀: [36.0078, 129.4779],
  '구룡포 일본인 가옥거리': [35.9912, 129.5595], 호미곶: [36.0761, 129.5685],
  보경사: [36.2517, 129.3193], '내연산 12폭포': [36.2635, 129.2969],
  경상북도수목원: [36.2207, 129.2619], 오어사: [35.9254, 129.4099],
};

export const findPohangCoordinate = (name: string): Coordinate | undefined => {
  const match = Object.entries(coordinates).find(([key]) => name.includes(key) || key.includes(name));
  return match ? { x: String(match[1][1]), y: String(match[1][0]) } : undefined;
};

export const straightLineKm = (a: Coordinate, b: Coordinate) => {
  const lat1 = Number(a.y) * Math.PI / 180;
  const lat2 = Number(b.y) * Math.PI / 180;
  const deltaLat = lat2 - lat1;
  const deltaLon = (Number(b.x) - Number(a.x)) * Math.PI / 180;
  const h = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};
