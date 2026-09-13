import Link from 'next/link';
import LiveTime from '@/components/poing/LiveTime';
import { timeSlots } from '@/lib/poing-content';

export default function LandingPage() {
  return (
    <>
      <header className="hero">
        <nav className="topbar">
          <Link className="wordmark" href="/">
            POING
          </Link>
          <LiveTime />
        </nav>

        <section className="hero-copy">
          <p className="eyebrow">Pohang time</p>
          <h1>
            포항의 시간을
            <br />
            기록하다
          </h1>
          <p>여행자는 걷고, POING은 조용히 기억합니다.</p>
          <div className="actions">
            <Link className="primary-btn" href="/plan/create">
              내 여정 시작하기
            </Link>
            <a className="ghost-btn" href="#journey">
              POING이 기억하는 방식
            </a>
          </div>
          <div className="hero-flow" aria-label="POING 여행 흐름">
            <span>계획</span>
            <span>진행</span>
            <span>기록</span>
          </div>
        </section>

        <ol className="day-rail" aria-label="포항의 하루">
          {timeSlots.map((item) => (
            <li key={item.key}>
              <span>{item.rail}</span>
              <i />
            </li>
          ))}
        </ol>
      </header>

      <main className="landing-main">
        <section className="landing-brief" id="journey">
          <div>
            <p className="eyebrow">POING Journey</p>
            <h2>포항의 하루를 하나의 여정으로</h2>
            <p>
              몇 가지 조건만 남기면 POING이 포항의 시간, 장소, 동선을 맞춰 하루를 제안합니다.
              여행 중 바뀐 선택과 여행 후 기록은 다음 여정을 더 자연스럽게 만듭니다.
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

        <section className="time-preview" aria-label="포항 시간대별 여정">
          {timeSlots.map((item) => (
            <article key={item.key} className={item.key}>
              <span>{item.time}</span>
              <strong>{item.place}</strong>
              <p>{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="landing-cta">
          <p>오늘의 포항을 POING으로 시작해보세요.</p>
          <Link className="primary-btn" href="/plan/create">
            내 여정 시작하기
          </Link>
        </section>
      </main>
    </>
  );
}
