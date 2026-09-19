# POING API 연결

키가 없는 서비스는 미리보기 데이터를 사용하며, 화면과 `/api/tour/pohang/status`에 연결 대기 상태를 표시합니다. `.env.example`을 `.env.local`로 복사하고 아래 순서대로 값을 설정한 뒤 서버를 재시작하세요. Vercel 배포 시에도 동일한 환경 변수를 프로젝트 설정에 등록해야 합니다.

1. [한국관광공사 국문 관광정보](https://www.data.go.kr/data/15101578/openapi.do)와 관광사진 API를 활용 신청하고 `KTO_SERVICE_KEY`를 설정합니다. 관광사진 서비스에 별도 키가 필요하면 `KTO_PHOTO_SERVICE_KEY`도 설정합니다. 장소, 소개, 운영 정보, 사진은 서버에서 호출하고 `/plan/create`와 `/insight`에 반영합니다.
2. [연관 관광지](https://www.data.go.kr/data/15128560/openapi.do), [관광지 집중률](https://www.data.go.kr/data/15128555/openapi.do), [지역별 방문자 수](https://www.data.go.kr/data/15101972/openapi.do)도 각각 활용 신청합니다. 승인된 키가 공통 키와 다르면 `KTO_RELATED_SERVICE_KEY`, `KTO_CONGESTION_SERVICE_KEY`, `KTO_VISITOR_SERVICE_KEY`를 각각 설정합니다. 연관 관광지 기본 기준 월은 공개 범위의 `202504`이며 환경 변수로 변경할 수 있습니다.
3. Kakao Developers에서 JavaScript 키, REST API 키, 지도 도메인 및 카카오 로그인 Redirect URI를 등록합니다. `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`, `KAKAO_REST_API_KEY`, `KAKAO_REDIRECT_URI`를 설정합니다. 차량 길찾기는 Kakao Mobility 이용 권한이 승인된 키를 `KAKAO_MOBILITY_API_KEY`에 설정합니다. 차량 길찾기 응답을 대중교통 경로로 표시하지 않습니다.
4. Supabase 프로젝트의 SQL Editor에서 `supabase/schema.sql`을 한 번 실행합니다. 프로젝트 URL과 서버 전용 서비스 역할 키를 `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`에 설정합니다. 서비스 역할 키는 `NEXT_PUBLIC_` 변수에 넣거나 클라이언트에 공개하면 안 됩니다.
5. `OPENAI_API_KEY` 또는 `GEMINI_API_KEY`를 설정하면 일정 문장 생성에 사용합니다. 둘 다 없으면 POING 기본 문장을 표시합니다.

키는 채팅이나 Git에 올리지 마세요. 서비스별 이용 권한, 무료 사용량, 사진 재이용 조건, 도메인 및 리디렉션 설정은 각 제공처에서 확인해야 합니다.

## 확인

`npm run lint`, `npm run build`로 정적 검사를 수행합니다. `/api/tour/pohang/status`는 키 설정 상태, `/api/tour/pohang/places`는 실제 관광 데이터 응답과 연결 성공 여부를 보여줍니다. `/api/trips/generate`의 `apiConnections`는 일정 생성에 사용된 서비스별 성공 여부이며, 키만 등록했다고 성공으로 표시하지 않습니다. 외부 키가 없으면 실제 API 호출의 최종 성공 여부까지 검증할 수 없습니다.
