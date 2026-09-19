import { officialPohangPlaces } from '@/lib/pohang-official';
import { straightLineKm } from '@/lib/pohang-coordinates';

const KTO_KOR_SERVICE_BASE = process.env.KTO_KOR_SERVICE_BASE ?? 'https://apis.data.go.kr/B551011/KorService2';
const KTO_PHOTO_SERVICE_BASE =
  process.env.KTO_PHOTO_SERVICE_BASE ?? 'https://apis.data.go.kr/B551011/PhotoGalleryService1';

const POHANG_AREA_CODE = process.env.KTO_POHANG_AREA_CODE ?? '35';
const POHANG_SIGUNGU_CODE = process.env.KTO_POHANG_SIGUNGU_CODE ?? '23';
const MOBILE_OS = process.env.KTO_MOBILE_OS ?? 'ETC';
const MOBILE_APP = process.env.KTO_MOBILE_APP ?? 'POING';

const TOUR_CONTENT_TYPES = [
  { contentTypeId: '12', label: '관광지' },
  { contentTypeId: '14', label: '문화시설' },
  { contentTypeId: '28', label: '레포츠' },
  { contentTypeId: '38', label: '쇼핑' },
  { contentTypeId: '39', label: '음식점' },
];

const FEATURED_PLACE_KEYWORDS = [
  '영일대전망대',
  '환호공원 스페이스워크',
  '죽도시장',
  '호미곶 해맞이광장',
  '이가리 닻 전망대',
  '구룡포 일본인 가옥거리',
  '구룡포 주상절리',
  '국립등대박물관',
  '내연산 보경사 시립공원',
  '오어사',
  '포항운하',
  '도구해수욕장',
  '연오랑세오녀',
  '구룡포과메기문화관',
];

export type KtoPlace = {
  id: string;
  contentId: string;
  contentTypeId: string;
  title: string;
  category: string;
  address: string;
  overview: string;
  tel?: string;
  homepage?: string;
  mapX?: string;
  mapY?: string;
  imageUrl: string;
  images: string[];
  imageCredit?: string;
  sourceLabel: string;
  sourceApis: string[];
  intro?: Record<string, string>;
};

export type KtoPhoto = {
  id: string;
  title: string;
  location?: string;
  imageUrl: string;
  sourceLabel: string;
  photographer?: string;
  license: string;
};

export type KtoDataResult = {
  connected: boolean;
  reason?: string;
  places: KtoPlace[];
  photos: KtoPhoto[];
  apiCalls: string[];
};

type KtoApiEnvelope<T> = {
  resultCode?: string;
  resultMsg?: string;
  response?: {
    header?: {
      resultCode?: string;
      resultMsg?: string;
    };
    body?: {
      items?: {
        item?: T | T[];
      };
    };
  };
  header?: {
    resultCode?: string;
    resultMsg?: string;
  };
  body?: {
    items?: {
      item?: T | T[];
    };
  };
};

type AreaBasedItem = {
  __sourceApi?: string;
  contentid?: string;
  contenttypeid?: string;
  title?: string;
  addr1?: string;
  addr2?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx?: string;
  mapy?: string;
  tel?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
};

type DetailCommonItem = AreaBasedItem & {
  overview?: string;
  homepage?: string;
};

type DetailIntroItem = Record<string, string | undefined>;

type DetailImageItem = {
  originimgurl?: string;
  smallimageurl?: string;
  imgname?: string;
};

type PhotoGalleryItem = {
  galContentId?: string;
  galTitle?: string;
  galPhotographyLocation?: string;
  galWebImageUrl?: string;
  galPhotographer?: string;
};

const serviceKey = () => process.env.KTO_SERVICE_KEY ?? process.env.TOUR_API_SERVICE_KEY ?? '';
const photoServiceKey = () => process.env.KTO_PHOTO_SERVICE_KEY ?? serviceKey();

const toArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const buildOpenApiUrl = (base: string, path: string, key: string, params: Record<string, string | number>) => {
  const search = new URLSearchParams({
    MobileOS: MOBILE_OS,
    MobileApp: MOBILE_APP,
    _type: 'json',
    ...Object.fromEntries(Object.entries(params).map(([paramKey, value]) => [paramKey, String(value)])),
  });

  const encodedKey = key.includes('%') ? key : encodeURIComponent(key);
  return `${base}/${path}?serviceKey=${encodedKey}&${search.toString()}`;
};

const fetchOpenApiItems = async <T>(
  base: string,
  path: string,
  key: string,
  params: Record<string, string | number>,
): Promise<T[]> => {
  const response = await fetch(buildOpenApiUrl(base, path, key, params), {
    signal: AbortSignal.timeout(12000),
    next: { revalidate: 60 * 60 * 6 },
  });

  if (!response.ok) {
    throw new Error(`${path} HTTP ${response.status}`);
  }

  const rawText = await response.text();
  const trimmed = rawText.trim();

  if (trimmed.startsWith('<')) {
    const errMsgMatch = trimmed.match(/<errMsg>(.*?)<\/errMsg>/i) || trimmed.match(/<returnAuthMsg>(.*?)<\/returnAuthMsg>/i);
    const errMsg = errMsgMatch ? errMsgMatch[1] : '공공데이터포털 XML 응답 (인증키 미승인 또는 서비스 에러)';
    throw new Error(`${path}: ${errMsg}`);
  }

  let data: KtoApiEnvelope<T>;
  try {
    data = JSON.parse(rawText) as KtoApiEnvelope<T>;
  } catch {
    throw new Error(`${path}: OpenAPI 응답 JSON 파싱 실패`);
  }

  const header = data.response?.header ?? data.header;
  const body = data.response?.body ?? data.body;
  const code = header?.resultCode ?? data.resultCode;

  if (code && code !== '0000') {
    throw new Error(`${path} ${code}: ${header?.resultMsg ?? data.resultMsg ?? 'OpenAPI error'}`);
  }

  return toArray(body?.items?.item);
};

const safeText = (value?: string) => value?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() ?? '';

const fallbackPlaces = (): KtoPlace[] =>
  officialPohangPlaces.map((place) => ({
    id: place.id,
    contentId: place.id,
    contentTypeId: 'fallback',
    title: place.title,
    category: place.category,
    address: place.address,
    overview: place.description,
    imageUrl: place.imageUrl,
    images: [place.imageUrl],
    sourceLabel: place.sourceLabel,
    sourceApis: ['fallback: official pohang dataset'],
  }));

const mapToKtoPlace = (
  areaItem: AreaBasedItem,
  commonItem?: DetailCommonItem,
  introItem?: DetailIntroItem,
  imageItems: DetailImageItem[] = [],
  categoryLabel = '관광지',
): KtoPlace => {
  const images = imageItems
    .map((image) => image.originimgurl ?? image.smallimageurl)
    .filter((image): image is string => Boolean(image));
  const firstImage = commonItem?.firstimage ?? areaItem.firstimage ?? areaItem.firstimage2 ?? images[0] ?? '';
  const contentId = areaItem.contentid ?? commonItem?.contentid ?? crypto.randomUUID();

  return {
    id: contentId,
    contentId,
    contentTypeId: areaItem.contenttypeid ?? commonItem?.contenttypeid ?? '',
    title: commonItem?.title ?? areaItem.title ?? '포항 장소',
    category: categoryLabel,
    address: [commonItem?.addr1 ?? areaItem.addr1, commonItem?.addr2 ?? areaItem.addr2].filter(Boolean).join(' '),
    overview: safeText(commonItem?.overview),
    tel: commonItem?.tel ?? areaItem.tel,
    homepage: commonItem?.homepage,
    mapX: commonItem?.mapx ?? areaItem.mapx,
    mapY: commonItem?.mapy ?? areaItem.mapy,
    imageUrl: firstImage,
    images: Array.from(new Set([firstImage, ...images].filter(Boolean))),
    intro: Object.fromEntries(
      Object.entries(introItem ?? {})
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => [key, safeText(value)]),
    ),
    sourceLabel: '출처: ⓒ한국관광공사',
    sourceApis: [
      areaItem.__sourceApi ?? 'areaBasedList2',
      ...(commonItem ? ['detailCommon2'] : []),
      ...(introItem ? ['detailIntro2'] : []),
      ...(imageItems.length ? ['detailImage2'] : []),
    ],
  };
};

export const getPohangTourApiData = async (): Promise<KtoDataResult> => {
  const key = serviceKey();

  if (!key) {
    return {
      connected: false,
      reason: 'KTO_SERVICE_KEY is missing',
      places: fallbackPlaces(),
      photos: [],
      apiCalls: ['fallback'],
    };
  }

  try {
    const areaItems = await fetchOpenApiItems<AreaBasedItem>(KTO_KOR_SERVICE_BASE, 'areaBasedList2', key, {
      pageNo: 1,
      numOfRows: 200,
      arrange: 'O',
      areaCode: POHANG_AREA_CODE,
      sigunguCode: POHANG_SIGUNGU_CODE,
    });
    const featuredPlaces = await Promise.all(FEATURED_PLACE_KEYWORDS.map(async (keyword) => {
      const matches = await fetchOpenApiItems<AreaBasedItem>(KTO_KOR_SERVICE_BASE, 'searchKeyword2', key, {
        pageNo: 1,
        numOfRows: 10,
        keyword,
      }).catch(() => []);
      const match = matches.find((item) => item.title === keyword && item.addr1?.includes('포항'))
        ?? matches.find((item) => item.title?.includes(keyword) && item.addr1?.includes('포항'));
      return match ? { ...match, __sourceApi: 'searchKeyword2' } : undefined;
    }));
    const categoryLabels = new Map(TOUR_CONTENT_TYPES.map((item) => [item.contentTypeId, item.label]));
    const seen = new Set<string>();
    const basePlaces = [...featuredPlaces.flatMap((place) => place ? [place] : []), ...areaItems]
      .filter((item) => categoryLabels.has(item.contenttypeid ?? ''))
      .filter((item) => {
        if (!item.contentid || seen.has(item.contentid)) return false;
        seen.add(item.contentid);
        return true;
      })
      .slice(0, 16)
      .map((item) => ({ ...item, __categoryLabel: categoryLabels.get(item.contenttypeid ?? '') ?? '관광지' }));

    const enriched = await Promise.all(
      basePlaces.map(async (place) => {
        const contentId = place.contentid;
        const contentTypeId = place.contenttypeid;

        if (!contentId || !contentTypeId) {
          return mapToKtoPlace(place, undefined, undefined, [], place.__categoryLabel);
        }

        const [common, intro, images] = await Promise.all([
          fetchOpenApiItems<DetailCommonItem>(KTO_KOR_SERVICE_BASE, 'detailCommon2', key, {
            contentId,
            numOfRows: 1,
            pageNo: 1,
          }).catch(() => []),
          fetchOpenApiItems<DetailIntroItem>(KTO_KOR_SERVICE_BASE, 'detailIntro2', key, {
            contentId,
            contentTypeId,
            numOfRows: 1,
            pageNo: 1,
          }).catch(() => []),
          fetchOpenApiItems<DetailImageItem>(KTO_KOR_SERVICE_BASE, 'detailImage2', key, {
            contentId,
            numOfRows: 8,
            pageNo: 1,
          }).catch(() => []),
        ]);

        return mapToKtoPlace(place, common[0], intro[0], images, place.__categoryLabel);
      }),
    );

    const photos = await getPohangTourPhotos().catch(() => []);
    const named = (value: string) => value.replace(/\s/g, '');
    const withPhotos = enriched.map((place) => {
      const photo = photos.find((item) => {
        const placeName = named(place.title);
        const photoName = named(item.title);
        return photoName.includes(placeName);
      });
      return photo ? {
        ...place,
        imageUrl: photo.imageUrl,
        images: Array.from(new Set([photo.imageUrl, ...place.images])),
        imageCredit: `${photo.sourceLabel}${photo.photographer ? ` · ${photo.photographer}` : ''} · ${photo.license}`,
      } : place;
    });

    if (!enriched.length) {
      return { connected: false, reason: '포항 관광지 응답이 비어 있습니다.', places: fallbackPlaces(), photos, apiCalls: ['areaBasedList2'] };
    }

    return {
      connected: true,
      places: withPhotos,
      photos,
      apiCalls: [
        'areaBasedList2',
        ...(enriched.some((place) => place.sourceApis.includes('searchKeyword2')) ? ['searchKeyword2'] : []),
        ...(enriched.some((place) => place.sourceApis.includes('detailCommon2')) ? ['detailCommon2'] : []),
        ...(enriched.some((place) => place.sourceApis.includes('detailIntro2')) ? ['detailIntro2'] : []),
        ...(enriched.some((place) => place.sourceApis.includes('detailImage2')) ? ['detailImage2'] : []),
        ...(photos.length ? ['gallerySearchList1'] : []),
      ],
    };
  } catch (error) {
    return {
      connected: false,
      reason: error instanceof Error ? error.message : 'KTO OpenAPI request failed',
      places: fallbackPlaces(),
      photos: [],
      apiCalls: ['fallback'],
    };
  }
};

export const getPohangTourPhotos = async (): Promise<KtoPhoto[]> => {
  const key = photoServiceKey();

  if (!key) return [];

  const keywords = ['영일대', '스페이스워크', '죽도시장', '호미곶', '이가리', '구룡포', '포항운하'];
  const responses = await Promise.all(keywords.map((keyword) => fetchOpenApiItems<PhotoGalleryItem>(
    KTO_PHOTO_SERVICE_BASE, 'gallerySearchList1', key,
    { pageNo: 1, numOfRows: 3, arrange: 'A', keyword },
  ).catch(() => [])));
  const seen = new Set<string>();
  return responses.flat()
    .filter((item) => item.galWebImageUrl && (item.galPhotographyLocation?.includes('포항') || item.galTitle?.includes('포항') || keywords.some((keyword) => item.galTitle?.includes(keyword))))
    .filter((item) => {
      if (!item.galWebImageUrl || seen.has(item.galWebImageUrl)) return false;
      seen.add(item.galWebImageUrl);
      return true;
    })
    .map((item) => ({
      id: item.galContentId ?? item.galWebImageUrl ?? crypto.randomUUID(),
      title: item.galTitle ?? '포항 관광사진',
      location: item.galPhotographyLocation,
      imageUrl: item.galWebImageUrl ?? '',
      sourceLabel: '한국관광공사 포토코리아',
      photographer: item.galPhotographer,
      license: '공공누리 1유형',
    }));
};

export const pickKtoItineraryPlaces = (places: KtoPlace[], region = '구도심', limit = 3) => {
  const namesByRegion: Record<string, string[]> = {
    북포항: ['이가리', '월포', '청하', '스페이스워크', '환호'],
    구도심: ['영일대', '스페이스워크', '죽도', '포항운하'],
    남포항: limit <= 3
      ? ['호미곶', '구룡포 일본인 가옥거리', '국립등대박물관']
      : ['구룡포 일본인 가옥거리', '구룡포 주상절리', '구룡포과메기문화관', '호미곶', '국립등대박물관', '연오랑세오녀', '도구해수욕장'],
    힐링코스: ['내연산', '오어사', '철길숲', '이가리', '환호'],
  };
  const preferredNames = namesByRegion[region] ?? namesByRegion.구도심;
  const selected = preferredNames
    .map((name) => places.find((place) => place.title.includes(name)))
    .filter((place): place is KtoPlace => Boolean(place));
  if (limit > 3) {
    const anchor = selected[0];
    const extras = places.filter((place) => !selected.some((chosen) => chosen.contentId === place.contentId))
      .sort((a, b) => {
        const distance = (place: KtoPlace) => anchor?.mapX && anchor?.mapY && place.mapX && place.mapY
          ? straightLineKm({ x: anchor.mapX, y: anchor.mapY }, { x: place.mapX, y: place.mapY }) : 999;
        return distance(a) - distance(b);
      });
    selected.push(...extras);
  }

  const seen = new Set<string>();
  return selected.filter((place) => {
    if (seen.has(place.contentId)) return false;
    seen.add(place.contentId);
    return true;
  }).slice(0, limit);
};
