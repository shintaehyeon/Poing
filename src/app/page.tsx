import Link from 'next/link';
import LiveTime from '@/components/poing/LiveTime';
import SunTimes from '@/components/poing/SunTimes';
import { timeSlots } from '@/lib/poing-content';

const searchItems = [
  { label: '지역', value: '포항' },
  { label: '도착', value: '오늘 오후 2:30' },
  { label: '취향', value: '바다 · 노을 · 시장' },
];

const featuredPlaces = [
  {
    title: '영일대 바다 산책',
    meta: '15:00 · 바다 · 가벼운 시작',
    tone: 'sea',
  },
  {
    title: '스페이스워크 노을',
    meta: '19:30 · 전망 · 야경',
    tone: 'sunset',
  },
  {
    title: '죽도시장 저녁',
    meta: '21:00 · 시장 · 기록',
    tone: 'night',
  },
];

export default function LandingPage() {
  return (
    <main className="landing-page">
      <section className="editorial-hero">
        <nav className="editorial-nav" aria-label="POING">
          <div className="nav-left">
            <a href="#journey">여정</a>
            <a href="#places">장소</a>
            <a href="#memory">기록</a>
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

        <span className="hero-marquee" aria-hidden="true">
          POHANG
        </span>

        <div className="editorial-hero-content">
          <section className="hero-statement">
            <p className="eyebrow">Pohang travel companion</p>
            <h1>
              바다가 여는 길,
              <br />
              하루가 시가 됩니다
            </h1>
            <p className="poem-copy">
              여행은 멀리 가는 일이 아니라, 오늘의 마음을 조금 더 선명하게 만나는 일.
              포항의 빛과 바람을 따라 걸으면 POING이 그 시간을 조용히 남깁니다.
            </p>
            <div className="actions">
              <Link className="primary-btn" href="/plan/create">
                내 여정 시작하기
              </Link>
              <a className="ghost-btn" href="#journey">
                포항의 하루 보기
              </a>
            </div>
          </section>

          <SunTimes variant="hero" />
        </div>

        <div className="journey-filter" aria-label="여행 조건">
          {searchItems.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
          <Link className="search-button" href="/plan/create" aria-label="포항 여행 만들기">
            여정 만들기
          </Link>
        </div>
      </section>

      <section className="landing-brief" id="journey">
        <div>
          <p className="eyebrow">POING Journey</p>
          <h2>포항의 하루를 하나의 여정으로</h2>
          <p>
            POING은 많은 선택지를 밀어넣지 않습니다. 몇 가지 조건만 보고, 포항의 시간과 동선을
            사용자가 바로 움직일 수 있는 하루로 엮습니다.
          </p>
        </div>
        <div className="landing-steps">
          <article>
            <span>01</span>
            <strong>계획</strong>
            <p>기간, 도착 시간, 이동수단, 동행만 선택합니다.</p>
          </article>
          <article>
            <span>02</span>
            <strong>진행</strong>
            <p>지도와 다음 장소 중심으로 여행을 이어갑니다.</p>
          </article>
          <article>
            <span>03</span>
            <strong>기록</strong>
            <p>방문한 장소와 후기가 나만의 포항 기록이 됩니다.</p>
          </article>
        </div>
      </section>

      <section className="destination-section" id="places" aria-label="추천 포항 장소">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recommended Route</p>
            <h2>포항 추천 코스</h2>
          </div>
          <Link href="/plan/create">내 여정 시작하기</Link>
        </div>
        <div className="destination-grid">
          {featuredPlaces.map((place) => (
            <article className="destination-card" key={place.title}>
              <div className={`destination-photo ${place.tone}`}>
                <span>POING</span>
              </div>
              <div>
                <strong>{place.title}</strong>
                <p>{place.meta}</p>
                <Link href="/plan/confirm">여정에 담기</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="time-preview" aria-label="포항 시간대별 여정">
        {timeSlots.map((item) => (
          <article key={item.key} className={item.key}>
            <span>{item.time}</span>
            <strong>{item.place}</strong>
            <p>{item.copy}</p>
          </article>
        ))}
      </section>

      <section className="poem-section" id="memory">
        <div>
          <p className="eyebrow">POING Memory</p>
          <h2>지나간 길은 사라지지 않고, 오늘의 문장으로 남습니다.</h2>
          <p>
            여행자는 오래 입력하지 않아도 됩니다. 지나온 장소, 바꾼 일정, 좋았던 순간이 모여
            다음 포항을 더 섬세하게 추천하는 기록이 됩니다.
          </p>
        </div>
        <div className="memory-preview">
          <span>2026 여름</span>
          <strong>바다에서 시작해 시장의 불빛으로 끝난 하루</strong>
          <p>영일대 · 스페이스워크 · 죽도시장</p>
          <Link className="primary-btn" href="/plan/create">
            POING 시작하기
          </Link>
        </div>
      </section>
    </main>
  );
}
