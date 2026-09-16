import { apiPills, findRecipePreset, itineraryPlaces, recipeSource } from '@/lib/poing-content';
import { getPohangSunTimes } from '@/lib/pohang-sun';

type TripCondition = {
  duration?: string;
  arrivalTime?: string;
  transport?: string;
  companion?: string;
  purpose?: string;
};

export async function POST(request: Request) {
  const condition = (await request.json().catch(() => ({}))) as TripCondition;
  const recipe = findRecipePreset(condition.companion ?? '연인', condition.purpose ?? '인생샷 찍기');

  return Response.json({
    tripId: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    condition,
    recipe,
    places: itineraryPlaces,
    sun: getPohangSunTimes(),
    summary: `${recipe.title} 흐름을 바탕으로 바다, 노을, 시장을 잇는 포항 하루`,
    dataSources: [...apiPills, recipeSource.label],
    nextBackendTargets: ['한국관광공사 국문 관광정보', '관광사진', '관광지별 연관 관광지', 'Supabase trips'],
  });
}
