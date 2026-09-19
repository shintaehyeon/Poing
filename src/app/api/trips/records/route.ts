import { NextResponse } from 'next/server';
import { getTripOwner, ownerCookieOptions } from '@/lib/server/trip-owner';
import { getTrips, saveTrip, saveTripEvent, type StoredTrip } from '@/lib/server/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const ownerId = await getTripOwner();
  if (!ownerId) return NextResponse.json({ connected: false, trips: [] });
  try {
    const trips = await getTrips(ownerId);
    return NextResponse.json({ connected: trips !== null, trips: trips ?? [] });
  } catch {
    return NextResponse.json({ connected: false, trips: [] }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<StoredTrip> | null;
  if (!body || !body.id || !/^[a-f0-9-]{36}$/.test(body.id)) {
    return NextResponse.json({ error: '유효한 여행 ID가 필요합니다.' }, { status: 400 });
  }
  const ownerId = (await getTripOwner()) ?? crypto.randomUUID();
  try {
    const current = await getTrips(ownerId);
    const existing = current?.find((trip) => trip.id === body.id);
    if (current && !existing) return NextResponse.json({ error: '이 여행을 수정할 권한이 없습니다.' }, { status: 403 });
    const trip: StoredTrip = {
      ...(existing ?? { id: body.id, owner_id: ownerId }),
      rating: body.rating,
      review: typeof body.review === 'string' ? body.review.slice(0, 1000) : existing?.review,
      visited_places: Array.isArray(body.visited_places) ? body.visited_places.slice(0, 30) : existing?.visited_places,
      itinerary: Array.isArray(body.itinerary) ? body.itinerary.slice(0, 30) : existing?.itinerary,
      status: body.status === 'finished' ? 'finished' : body.status === 'active' ? 'active' : existing?.status ?? 'planned',
    };
    const result = await saveTrip(trip);
    if (result.connected) {
      await saveTripEvent({ event: 'trip_updated', tripId: body.id, ownerId, payload: { status: trip.status, rating: trip.rating } });
    }
    const response = NextResponse.json(result, { status: result.connected ? 200 : 503 });
    if (!ownerId.startsWith('kakao:')) response.cookies.set('poing_guest_id', ownerId, ownerCookieOptions);
    return response;
  } catch {
    return NextResponse.json({ error: '여행 저장에 실패했습니다.' }, { status: 502 });
  }
}
