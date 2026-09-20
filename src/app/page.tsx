import Link from 'next/link';
import Image from 'next/image';
import BestPohang from '@/components/poing/BestPohang';
import FoodPlacesTicker from '@/components/poing/FoodPlacesTicker';
import LandingJourneyPlanner from '@/components/poing/LandingJourneyPlanner';
import LiveTime from '@/components/poing/LiveTime';
import RecommendedPlacesTicker, { type RecommendedPlaceItem } from '@/components/poing/RecommendedPlacesTicker';
import RegionalFlow from '@/components/poing/RegionalFlow';
import SunTimes from '@/components/poing/SunTimes';
import { timeSlots } from '@/lib/poing-content';
import { officialPlaceById, POHANG_TOUR_HOME } from '@/lib/pohang-official';
import { getPohangTourApiData } from '@/lib/server/kto-tour';

export const dynamic = 'force-dynamic';

const featuredPlaces = [
  {
    ...officialPlaceById.yeongildae,
    title: '영일대 바다 산책',
    meta: '15:00 · 바다 · 가벼운 시작',
    tone: 'sea',
  },
  {
    ...officialPlaceById.spacewalk,
    title: '스페이스워크 노을',
    meta: '19:30 · 전망 · 야경',
    tone: 'sunset',
  },
  {
    ...officialPlaceById.jukdo,
    title: '죽도시장 저녁',
    meta: '21:00 · 시장 · 기록',
    tone: 'night',
  },
];

const isCafePlace = (title: string) => /카페|커피|제과|베이커리|로스터|헤이안|페이지|브리즈|파도/i.test(title);

export default async function LandingPage() {
  const tour = await getPohangTourApiData();
  const liveFeatured = featuredPlaces.map((fallback, index) => {
    const term = ['영일대', '스페이스워크', '죽도'][index];
    const place = tour.connected ? tour.places.find((item) => item.title.includes(term)) : undefined;
    return place ? {
      ...fallback,
      title: place.title,
      description: place.overview || fallback.description,
      imageUrl: place.imageUrl || fallback.imageUrl,
      imageAlt: `${place.title} 사진`,
      sourceUrl: `/places/${place.contentId}`,
      id: place.contentId,
    } : { ...fallback, id: fallback.id };
  });
  const heroGalleryPhoto = tour.photos.find((photo) => photo.title.includes('이가리'))
    ?? tour.photos.find((photo) => photo.title.includes('스페이스워크'))
    ?? tour.photos.find((photo) => photo.title.includes('영일대'));
  const heroPlacePhoto = tour.places.find((place) => place.title.includes('이가리') && place.imageUrl)
    ?? tour.places.find((place) => place.title.includes('스페이스워크') && place.imageUrl)
    ?? tour.places.find((place) => place.title.includes('영일대') && place.imageUrl);
  const heroPhoto: { imageUrl: string; sourceLabel: string; photographer?: string } = heroGalleryPhoto
    ?? (heroPlacePhoto ? {
      imageUrl: heroPlacePhoto.imageUrl,
      sourceLabel: heroPlacePhoto.sourceLabel,
    } : {
      imageUrl: officialPlaceById.spacewalk.imageUrl,
      sourceLabel: officialPlaceById.spacewalk.imageCredit,
    });
  const homigotGalleryPhoto = tour.photos.find((photo) => photo.title.includes('호미곶'));
  const homigotPlacePhoto = tour.places.find((place) => place.title.includes('호미곶') && place.imageUrl);
  const homigotPhoto = homigotGalleryPhoto ? {
    src: homigotGalleryPhoto.imageUrl,
    alt: '호미곶 해맞이광장과 상생의 손 실제 사진',
    credit: `${homigotGalleryPhoto.sourceLabel}${homigotGalleryPhoto.photographer ? ` · ${homigotGalleryPhoto.photographer}` : ''}`,
  } : homigotPlacePhoto ? {
    src: homigotPlacePhoto.imageUrl,
    alt: `${homigotPlacePhoto.title} 실제 사진`,
    credit: homigotPlacePhoto.imageCredit ?? homigotPlacePhoto.sourceLabel,
  } : {
    src: officialPlaceById.homigot.imageUrl,
    alt: officialPlaceById.homigot.imageAlt,
    credit: officialPlaceById.homigot.imageCredit,
  };
  const foodPlaces = tour.places.filter((place) => place.contentTypeId === '39' && place.imageUrl);
  const diningPlaces = foodPlaces.filter((place) => !isCafePlace(place.title));
  const cafePlaces = foodPlaces.filter((place) => isCafePlace(place.title));
  const foodHighlights = Array.from(
    { length: Math.max(diningPlaces.length, cafePlaces.length) },
    (_, index) => [diningPlaces[index], cafePlaces[index]],
  )
    .flat()
    .filter((place): place is NonNullable<typeof place> => Boolean(place));
  const apiRecommendedPlaces: RecommendedPlaceItem[] = tour.places
    .filter((place) => place.contentTypeId !== '39' && place.imageUrl)
    .map((place) => ({
      id: place.contentId,
      title: place.title,
      category: place.category,
      address: place.address,
      overview: place.overview,
      imageUrl: place.imageUrl,
      credit: place.imageCredit ?? place.sourceLabel,
      href: `/places/${place.contentId}`,
      travelInfo: place.intro?.usetime
        ?? place.intro?.usetimeculture
        ?? place.intro?.opentime
        ?? place.intro?.infocenter
        ?? place.address,
    }));
  const recommendedPlaces: RecommendedPlaceItem[] = apiRecommendedPlaces.length > 0
    ? apiRecommendedPlaces
    : liveFeatured.map((place) => ({
      id: String(place.id),
      title: place.title,
      category: '포항 명소',
      address: place.meta,
      overview: place.description,
      imageUrl: place.imageUrl,
      credit: 'imageCredit' in place ? String(place.imageCredit ?? '') : undefined,
      href: place.sourceUrl,
      travelInfo: place.meta,
    }));
  const timeSlotKeywords = ['호미곶', '영일대', '스페이스워크', '죽도'];
  const liveTimeSlots = timeSlots.map((slot, index) => {
    const place = tour.places.find((item) => item.title.includes(timeSlotKeywords[index]));
    const mapUrl = place?.mapX && place.mapY
      ? `https://map.kakao.com/link/map/${encodeURIComponent(place.title)},${place.mapY},${place.mapX}`
      : place ? `/places/${place.contentId}` : slot.sourceUrl;

    return {
      ...slot,
      place: place?.title ?? slot.place,
      imageUrl: place?.imageUrl || slot.imageUrl,
      address: place?.address ?? '경상북도 포항시',
      credit: place?.imageCredit ?? place?.sourceLabel ?? '포항 공식 관광정보',
      mapUrl,
    };
  });
  const memoryPlace = liveTimeSlots[3];

  return (
    <main className="landing-page landing-v2">
      <section className="editorial-hero">
        <div className="poing-opening" aria-hidden="true">
          <div className="opening-formula">
            <span>POHANG</span>
            <i>+</i>
            <span>ING</span>
          </div>
          <strong>POING</strong>
          <small>포항의 오늘이 시작되는 중</small>
        </div>

        <Image
          alt="포항 북부 해안과 대표 전망 명소의 실제 풍경"
          className="landing-hero-photo"
          fill
          priority
          sizes="100vw"
          src={heroPhoto.imageUrl}
          unoptimized
        />
        <div className="landing-hero-wash" aria-hidden="true" />

        <nav className="editorial-nav" aria-label="POING">
          <div className="nav-left">
            <a href="#journey">여정</a>
            <a href="#regions">권역</a>
            <a href="#best-pohang">BEST</a>
            <a href="#places">장소</a>
          </div>
          <Link className="wordmark" href="/">
            POING
          </Link>
          <div className="nav-right">
            <LiveTime compact />
            <Link className="round-menu" href="/plan/create" aria-label="여정 시작">
              시작
            </Link>
          </div>
        </nav>

        <span className="hero-photo-credit">
          {heroPhoto.sourceLabel}{heroPhoto.photographer ? ` · ${heroPhoto.photographer}` : ''}
        </span>

        <span className="hero-marquee" aria-hidden="true">
          POHANG
        </span>

        <div className="editorial-hero-content">
          <section className="hero-statement">
            <p className="eyebrow">POHANG + ing</p>
            <h1>
              포항에서,
              <br />
              여행은 지금도 ING
            </h1>
            <p className="poem-copy">
              오늘 도착하는 시간과 취향만 알려주세요. 바다의 빛, 이동 거리, 혼잡 흐름을 맞춰
              지금 바로 움직일 수 있는 포항 하루를 엮어드립니다.
            </p>
            <div className="brand-origin" aria-label="POING 이름 설명">
              <span>POING = POHANG + ING</span>
              <p>걷는 중, 바라보는 중, 기록하는 중. 포항의 지금을 이어가는 여행.</p>
            </div>
            <div className="actions">
              <a className="ghost-btn" href="#regions">
                권역별 포항 보기
              </a>
            </div>
          </section>

          <SunTimes photo={homigotPhoto} variant="hero" />
        </div>

        <LandingJourneyPlanner />
      </section>

      <section className="landing-proof-band" aria-label="POING 실시간 여행 근거">
        <div className="landing-proof-inner">
          <p><span>공식 장소</span><strong>{tour.connected ? `${tour.places.length}곳` : '포항 전역'}</strong><small>한국관광공사 상세·사진</small></p>
          <p><span>오늘의 빛</span><strong>일출부터 노을까지</strong><small>호미곶 태양 시각 계산</small></p>
          <p><span>이동 흐름</span><strong>거리·시간·버스</strong><small>카카오 대중교통 경로</small></p>
          <Link href="/insight">추천 근거 확인하기 →</Link>
        </div>
      </section>

      <div className="landing-band landing-band-regions">
        <RegionalFlow places={tour.places} />
      </div>

      <div className="landing-band landing-band-best"><BestPohang places={tour.connected ? tour.places : []} /></div>

      <div className="landing-band landing-band-routes">
      <section className="destination-section" id="places" aria-label="추천 포항 장소">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recommended Route</p>
            <h2>포항 추천 코스</h2>
          </div>
          <Link href="/plan/create">내 여정 시작하기</Link>
        </div>
        <RecommendedPlacesTicker places={recommendedPlaces} />
        <p className="official-note">
          장소 기본 정보는{' '}
          <a href={POHANG_TOUR_HOME} rel="noreferrer" target="_blank">
            공식 관광정보
          </a>
          와 한국관광공사 OpenAPI를 활용합니다. 각 사진의 재사용 조건은 원 출처에서 별도로 확인해야 합니다.
        </p>
      </section>
      </div>

      {foodHighlights.length > 0 && (
        <section className="food-discovery-section" aria-label="포항 음식점과 카페">
          <div className="food-discovery-heading">
            <div>
              <p className="eyebrow">Eat in Pohang</p>
              <h2>먹으러 가는 포항</h2>
            </div>
            <p>물회 한 그릇부터 바다를 바라보는 카페까지, 포항의 하루를 맛으로 이어갑니다.</p>
          </div>
          <FoodPlacesTicker places={foodHighlights} />
        </section>
      )}

      <section className="time-preview landing-time-band" aria-label="포항 시간대별 여정">
        {liveTimeSlots.map((item) => (
          <article key={item.key} className={`time-place-card ${item.key}`} tabIndex={0}>
            <Image
              alt={`${item.place} 실제 사진`}
              className="time-card-photo"
              fill
              sizes="(max-width: 760px) 82vw, 295px"
              src={item.imageUrl}
              unoptimized
            />
            <div className="time-card-scrim" aria-hidden="true" />
            <div className="time-card-copy">
              <span>{item.time}</span>
              <strong>{item.place}</strong>
              <p>{item.copy}</p>
            </div>
            <a
              className="time-card-location"
              href={item.mapUrl}
              rel="noreferrer"
              target={item.mapUrl.startsWith('http') ? '_blank' : undefined}
            >
              <span>LOCATION</span>
              <strong>{item.address}</strong>
              <em>지도에서 위치 보기 ↗</em>
              <small>{item.credit}</small>
            </a>
          </article>
        ))}
      </section>

      <section className="poem-section" id="memory">
        <div>
          <p className="eyebrow">POING Memory</p>
          <h2 className="poem-heading">
            <span>지나간 길은</span>
            <span>사라지지 않고,</span>
            <span>오늘의 문장으로 남습니다.</span>
          </h2>
          <p className="poem-description">
            여행자는 오래 입력하지 않아도 됩니다. 지나온 장소, 바꾼 일정, 좋았던 순간이 모여
            다음 포항을 더 섬세하게 추천하는 기록이 됩니다.
          </p>
        </div>
        <div className="memory-preview">
          <Image
            alt={`${memoryPlace.place}의 저녁 풍경`}
            className="memory-preview-photo"
            fill
            sizes="(max-width: 760px) 100vw, 480px"
            src={memoryPlace.imageUrl}
            unoptimized
          />
          <div className="memory-preview-overlay" aria-hidden="true" />
          <span>2026 여름</span>
          <strong>바다에서 시작해 시장의 불빛으로 끝난 하루</strong>
          <p>영일대 · 스페이스워크 · 죽도시장</p>
          <Link className="primary-btn" href="/plan/create">
            POING 시작하기
          </Link>
          <small className="memory-photo-credit">{memoryPlace.credit}</small>
        </div>
      </section>
    </main>
  );
}
