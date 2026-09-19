'use client';

import { useEffect, useState } from 'react';

type Session = { authenticated: boolean; user?: { nickname?: string } };

export default function AuthButton() {
  const [session, setSession] = useState<Session | null>(null);
  const [configured, setConfigured] = useState(false);
  useEffect(() => {
    fetch('/api/auth/session').then((response) => response.json()).then(setSession).catch(() => setSession({ authenticated: false }));
    fetch('/api/tour/pohang/status')
      .then((response) => response.json())
      .then((data: { integrations: Array<{ key: string; state: string }> }) =>
        setConfigured(data.integrations.some((item) => item.key === 'kakao-login' && item.state === 'configured')))
      .catch(() => setConfigured(false));
  }, []);

  if (!session) return <span className="auth-status">계정 확인 중</span>;
  if (!session.authenticated && !configured) return null;
  if (!session.authenticated) {
    return <a className="auth-button" href="/api/auth/kakao/start">카카오로 시작</a>;
  }
  return (
    <button
      className="auth-button signed"
      onClick={() => fetch('/api/auth/logout', { method: 'POST' }).then(() => setSession({ authenticated: false }))}
      type="button"
      title="로그아웃"
    >
      {session.user?.nickname ?? '여행자'}님
    </button>
  );
}
