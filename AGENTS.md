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

2. **디자인 시스템 우선 사용 (`DESIGN.md` + `src/app/globals.css`)**
   - UI/UX 수정 전 반드시 루트의 `DESIGN.md`를 먼저 읽고, 그 디자인 계약을 우선합니다.
   - POING의 현재 방향은 포항 여행 매거진처럼 보이는 에디토리얼 웹 서비스입니다.
   - 색상, 타이포, radius, shadow, 카드 패턴은 `DESIGN.md`와 `src/app/globals.css`의 토큰을 우선 사용합니다.
   - 보라색 그라디언트, 추상 장식 blob, 과도한 glassmorphism, 공모전 심사용 문구를 사용자 UI에 넣지 않습니다.
   - 시각 언어를 바꾸는 경우 `DESIGN.md`를 먼저 업데이트한 뒤 CSS와 컴포넌트를 맞춥니다.

3. **한국관광공사 OpenAPI 사용 원칙 (공모전 FAQ 필수 충족)**
   - 데이터 동기화 이슈 방지 및 공모전 호출 로그 검증을 위해 **로컬 DB 저장/캐싱을 금지**하며, **Next.js 백엔드 API Route를 통한 실시간 Fetching 원칙**을 유지합니다.

---

## 🚀 4. PR (Pull Request) & 병합 규칙

1. 파트 개발 완료 시 `feature/part1-frontend` 또는 `feature/part2-backend`에서 `main` 브랜치로 Pull Request를 생성합니다.
2. `npm run build` 실행 시 TypeScript 타입 에러 및 컴파일 에러 0건을 반드시 확인한 후 병합합니다.
