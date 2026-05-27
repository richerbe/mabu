# 마부

네이버 플레이스, 블로그, 쇼핑 순위 관리를 위한 광고 운영 대시보드 프로토타입입니다.

## 구현 기능

- 간편 로그인과 워크스페이스 사용자 저장
- 플레이스/콘텐츠 URL, 키워드, 지역 기반 분석 폼
- 예상 순위, 노출 점수, 히든 키워드, 월 예상 노출 카드
- 키워드 순위 비교 테이블과 추적 토글
- 7일 순위 추세 차트
- 자동 모니터링 목록 저장 및 상태 갱신
- 키워드 조합 결과 생성
- 분석 히스토리 저장 및 재조회
- CSV 리포트 다운로드
- 기타 도구: 이미지 대량 리사이징, 글자수세기, 키워드 조합기
- 애드로그 대비 확장 분석 탭: 플레이스 1회 조회, 인플루언서 순위, N 가격비교, N+ 스토어, 지식인 순위, 통합웹 순위, 클립 순위, 블로그 정보 조회, 키워드 검색량, 블로그 노출 확인
- 블로그 지수 진단: 발행 꾸준함, 주제 전문성, 반응 지표 기반 추정 점수와 개선 액션
- AI 블로그 플래너: 수집 링크 기반 프로젝트 스케줄, 완성형 글 작성, AI 이미지 배치 추천, 업로드 사진 변형
- 반응형 사이드바/대시보드 UI

## 실행

```bash
npm install
npm run dev:api
npm run dev
```

로컬 주소: `http://127.0.0.1:5173/`

프론트 개발 서버는 `/api` 요청을 `http://127.0.0.1:5174`의 로컬 API 서버로 프록시합니다.

프로덕션처럼 프론트와 API를 한 서버에서 확인하려면 아래 명령을 사용합니다.

```bash
npm run start:prod
```

프로덕션 로컬 주소: `http://127.0.0.1:5174/`

## 네이버 실데이터 연동

1. `.env.example`을 복사해 `.env` 파일을 만듭니다.
2. 네이버 개발자센터에서 애플리케이션을 만들고 `검색`, `데이터랩(검색어트렌드)` API를 추가합니다.
3. 발급받은 값을 `.env`에 넣습니다.

```bash
NAVER_CLIENT_ID=네이버_개발자센터_클라이언트_ID
NAVER_CLIENT_SECRET=네이버_개발자센터_클라이언트_SECRET
```

4. 월 검색량까지 보려면 네이버 검색광고센터의 API Manager에서 라이선스를 발급받아 추가합니다.

```bash
NAVER_SEARCHAD_API_KEY=검색광고_API_KEY
NAVER_SEARCHAD_SECRET_KEY=검색광고_SECRET_KEY
NAVER_SEARCHAD_CUSTOMER_ID=검색광고_CUSTOMER_ID
```

5. 서버를 다시 시작합니다.

```bash
npm run dev:api
```

연동 후 `키워드 검색량` 탭에서 `키워드 조회`를 누르면 실제 네이버 블로그/카페/지식iN/웹문서 문서량, 데이터랩 추이, 검색광고 월 검색량을 합산해 표시합니다.

## 검증

```bash
npm run lint
npm run build
```

## 배포

마부는 키워드 분석, AI 글쓰기, 유튜브 분석 API가 Express 서버에 붙어 있습니다. 따라서 실제 운영 배포는 프론트와 API를 함께 띄우는 Node 서버 배포를 권장합니다.

### Render 권장

1. GitHub에 이 프로젝트를 올립니다.
2. Render에서 `New` → `Blueprint`를 선택합니다.
3. 저장소를 연결하면 `render.yaml` 설정으로 웹 서비스가 생성됩니다.
4. Render 환경변수에 네이버/OpenAI 키를 입력합니다.
5. 배포 후 발급된 주소를 네이버 개발자센터의 `WEB 설정 > 웹 서비스 URL`에 추가합니다.

### Docker

```bash
docker build -t mabu .
docker run --env-file .env -p 8080:5174 mabu
```

배포 후 주소: `http://localhost:8080/`

### Vercel/Netlify 주의

Vercel/Netlify에 `dist`만 정적 배포하면 화면은 열리지만 `/api` 기능이 동작하지 않습니다. API까지 쓰려면 Render, Railway, Fly.io, VPS, Docker처럼 Node 서버를 실행할 수 있는 곳에 배포하세요.

## 운영 메모

- 현재 데이터는 브라우저 `localStorage`에 저장됩니다. 여러 사용자가 같은 데이터를 공유하려면 백엔드와 인증, DB 연동이 필요합니다.
- 네이버 공식 API 키가 없는 상태에서는 키워드, 순위, 블로그 지수가 추정값으로 표시됩니다.
- 네이버 플레이스 실시간 순위와 블로그 지수는 공식 공개 API가 제한적이므로, 현재는 검색 Open API/데이터랩/검색광고 API에서 확인 가능한 지표를 우선 실데이터로 반영합니다.

## AI 글쓰기 API 연동

`블로그 글쓰기 2.1`의 글 생성은 서버에서 OpenAI Responses API를 호출합니다. 브라우저에는 API 키를 노출하지 않습니다.

```bash
OPENAI_API_KEY=발급받은_OPENAI_API_KEY
OPENAI_MODEL=gpt-4.1-mini
```

설정 후 API 서버를 다시 시작합니다.

```bash
npm run dev:api
```

`OPENAI_API_KEY`가 없거나 API 호출에 실패하면 기존 기본 생성 방식으로 자동 대체됩니다.
