import Link from 'next/link';
import type { ReactNode } from 'react';
import LiveTime from './LiveTime';
import { tripSteps } from '@/lib/poing-content';

type PageShellProps = {
  active: string;
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
  aside?: ReactNode;
};

export default function PageShell({
  active,
  title,
  eyebrow,
  description,
  children,
  aside,
}: PageShellProps) {
  const activeIndex = tripSteps.findIndex((step) => step.key === active);

  return (
    <main className="service-page">
      <aside className="service-sidebar">
        <Link className="wordmark dark" href="/">
          POING
        </Link>
        <div>
          <p className="eyebrow">Start POING</p>
          <h1>
            바다는 길을 열고
            <br />
            하루는 기록이 됩니다
          </h1>
          <p className="sidebar-copy">
            오늘 포항에서 만난 빛과 바람을 POING이 조용히 모아둘게요.
          </p>
        </div>
        <nav className="step-nav" aria-label="POING 여정 단계">
          {tripSteps.map((step, index) => (
            <Link
              key={step.key}
              className={step.key === active ? 'active' : ''}
              href={step.href}
              aria-current={step.key === active ? 'page' : undefined}
            >
              <strong>{String(index + 1).padStart(2, '0')} {step.label}</strong>
              <span>{step.caption}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <section className="service-stage">
        <header className="service-topbar">
          <span>{activeIndex + 1} / {tripSteps.length}</span>
          <LiveTime compact />
        </header>
        <article className="web-screen">
          <div className="window-bar">
            <span>POING</span>
            <strong>{tripSteps[activeIndex]?.label}</strong>
          </div>
          <div className="screen-head">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </div>
          <div className="workspace">
            <div className="main-column">{children}</div>
            {aside && <aside className="side-column">{aside}</aside>}
          </div>
        </article>
      </section>
    </main>
  );
}
