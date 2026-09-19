type TripLogPayload = {
  event: string;
  tripId?: string;
  ownerId?: string;
  payload?: Record<string, unknown>;
};

export type StoredTrip = {
  id: string;
  owner_id: string;
  condition?: Record<string, unknown>;
  itinerary?: unknown[];
  summary?: string;
  rating?: number;
  review?: string;
  visited_places?: string[];
  status?: 'planned' | 'active' | 'finished';
};

const config = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

const headers = (key: string, prefer?: string) => ({
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  ...(prefer ? { Prefer: prefer } : {}),
});

export const saveTrip = async (trip: StoredTrip) => {
  const { url, key } = config();
  if (!url || !key) return { connected: false, message: 'Supabase 키가 없습니다.' };
  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/trips?on_conflict=id`, {
    method: 'POST',
    headers: headers(key, 'resolution=merge-duplicates,return=minimal'),
    body: JSON.stringify({ ...trip, updated_at: new Date().toISOString() }),
    cache: 'no-store',
  });
  return {
    connected: response.ok,
    message: response.ok ? '여행이 저장되었습니다.' : `Supabase 저장 실패: ${response.status}`,
  };
};

export const getTrips = async (ownerId: string): Promise<StoredTrip[] | null> => {
  const { url, key } = config();
  if (!url || !key) return null;
  const query = new URLSearchParams({ select: '*', owner_id: `eq.${ownerId}`, order: 'created_at.desc', limit: '20' });
  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/trips?${query}`, {
    headers: headers(key),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Supabase 조회 실패: ${response.status}`);
  return (await response.json()) as StoredTrip[];
};

export const saveTripEvent = async ({ event, tripId, ownerId, payload }: TripLogPayload) => {
  const { url, key } = config();

  if (!url || !key) {
    return {
      connected: false,
      source: 'fallback',
      message: 'Supabase 키가 없어 이벤트 저장을 건너뜁니다.',
    };
  }

  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/trip_events`, {
    method: 'POST',
    headers: headers(key, 'return=minimal'),
    body: JSON.stringify({
      event,
      trip_id: tripId,
      owner_id: ownerId,
      payload: payload ?? {},
      created_at: new Date().toISOString(),
    }),
  });

  return {
    connected: response.ok,
    source: 'Supabase REST',
    message: response.ok ? '여행 이벤트를 저장했습니다.' : `Supabase 저장 실패: ${response.status}`,
  };
};
