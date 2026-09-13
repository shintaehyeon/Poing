import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'POING | 포항의 시간을 기록하다',
  description: '포항의 하루를 계획하고, 여행 중 조용히 기록하는 포항 전용 여행 웹 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
