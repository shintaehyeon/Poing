import { apiPills, itineraryPlaces } from '@/lib/poing-content';
import { getPohangSunTimes } from '@/lib/pohang-sun';

type TripCondition = {
  duration?: string;
  arrivalTime?: string;
  transport?: string;
  companion?: string;
};

export async function POST(request: Request) {
  const condition = (await request.json().catch(() => ({}))) as TripCondition;

  return Response.json({
    tripId: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    condition,
    places: itineraryPlaces,
    sun: getPohangSunTimes(),
    summary: '바다에서 시작해 노을과 시장으로 마무리하는 포항 하루',
    dataSources: apiPills,
    nextBackendTargets: ['한국관광공사 국문 관광정보', '관광사진', '관광지별 연관 관광지', 'Supabase trips'],
  });
}
