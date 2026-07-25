import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'POING | 포항 특화 AI 맞춤형 여행 코스',
  description: '한국관광공사 빅데이터와 AI 혼잡도 예측으로 만들어지는 포항만의 맞춤 여행 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <main className="mobile-container">
          {children}
        </main>
        {/* Kakao Maps API SDK Loader */}
        <Script
          src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=7b14041d8e12ff4802c638148b5ffb0b&libraries=services&autoload=false"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
