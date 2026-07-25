# 📜 [POING] 프로젝트 팀 개발 규칙 & 아키텍처 가이드라인 (AGENTS.md)

2026 관광데이터 활용 공모전 **대상(문화체육관광부 장관상)**을 목표로 하는 **POING 2인 개발자 팀 규칙 문서**입니다.

---

## 🌿 1. 브랜치 전략 (Git Branch Strategy)

- **`main`**: Vercel 자동 배포 라이브 프로덕션 브랜치 (직접 commit 금지, PR 거쳐서 병합)
- **`feature/part1-frontend`**: 태현 (프론트엔드 UI/UX, 대화형 Wizard, 📸 카메라 인증, 📮 감성 엽서 Engine)
- **`feature/part2-backend`**: 옥토 (백엔드 TourAPI 5종 Fetcher, POING AI 혼잡우회 알고리즘, Kakao Map SDK)

---

## 📝 2. 커밋 메시지 컨벤션 (Commit Convention)

커밋 시 아래 태그 머리말을 준수합니다:

- `feat:` 새로운 기능 구현 (예: `feat: 대화형 Wizard 5단계 UI 구현`)
- `fix:` 버그 및 에러 수정 (예: `fix: ActiveTravel 카카오 맵 핀 마커 스타일 수정`)
- `style:` UI 디자인, Glassmorphism, CSS 스타일 수정
- `docs:` README 또는 규칙 문서 수정
- `refactor:` 기능 변경 없는 코드 리팩토링

---

## 📐 3. 코딩 표준 & 타입 가이드라인 (Coding & DTO Standard)

1. **타입 안전성 (TypeScript Strict Mode)**
   - 백엔드와 프론트엔드 간 데이터 통신 시 `src/types/poing.ts`에 정의된 `PohangPlace`, `DayItinerary`, `ItineraryItem` DTO 규격을 엄격히 준수합니다.

2. **디자인 시스템 토큰 사용 (`src/app/globals.css`)**
   - 색상이나 스타일 적용 시 전역 CSS 변수를 우선 사용합니다:
     - Primary Ocean Blue: `var(--color-primary)` (`#0066FF`)
     - Sunset Coral: `var(--color-secondary)` (`#FF5E36`)
     - Glassmorphism Card: `class="glass-card"`
     - Button: `class="glass-button-primary"`

3. **한국관광공사 OpenAPI 사용 원칙 (공모전 FAQ 필수 충족)**
   - 데이터 동기화 이슈 방지 및 공모전 호출 로그 검증을 위해 **로컬 DB 저장/캐싱을 금지**하며, **Next.js 백엔드 API Route를 통한 실시간 Fetching 원칙**을 유지합니다.

---

## 🚀 4. PR (Pull Request) & 병합 규칙

1. 파트 개발 완료 시 `feature/part1-frontend` 또는 `feature/part2-backend`에서 `main` 브랜치로 Pull Request를 생성합니다.
2. `npm run build` 실행 시 TypeScript 타입 에러 및 컴파일 에러 0건을 반드시 확인한 후 병합합니다.
