import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  BarChart3,
  Bell,
  BookOpenCheck,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Combine,
  Download,
  FileImage,
  Gauge,
  Link2,
  ListChecks,
  LogOut,
  MessageCircleQuestion,
  PenLine,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  TextCursorInput,
  TrendingUp,
} from 'lucide-react'
import './App.css'

const tools = [
  { id: 'dashboard', label: '대시보드', icon: Activity, badge: 'Home' },
  { id: 'marketing-design', label: '마케팅 설계', icon: Sparkles, badge: '전략' },
  { id: 'place', label: '플레이스 분석', icon: Store, badge: '인기' },
  { id: 'rank', label: '순위 비교', icon: BarChart3, badge: '추천' },
  { id: 'blog', label: '블로그 검사', icon: BookOpenCheck },
  { id: 'blog-writer', label: '블로그 글쓰기 2.1', icon: PenLine, badge: 'AI' },
  { id: 'blog-planner', label: 'AI 블로그 플래너', icon: PenLine, badge: 'AI' },
  { id: 'blog-index', label: '블로그 지수 진단', icon: Gauge, badge: '추정' },
  { id: 'shop', label: '쇼핑 순위', icon: ShoppingBag },
  { id: 'seller-keyword', label: '키워드 분석', icon: BarChart3, badge: 'Seller' },
  { id: 'seller-finder', label: '키워드 찾기', icon: Search, badge: 'Seller' },
  { id: 'seller-product', label: '상품 분석', icon: ShoppingBag, badge: 'Seller' },
  { id: 'seller-rank', label: '상품 순위', icon: TrendingUp, badge: 'Seller' },
  { id: 'seller-ai', label: '셀러 AI', icon: Sparkles, badge: 'AI' },
  { id: 'combo', label: '키워드 조합', icon: Combine },
  { id: 'auto', label: '자동완성/연관검색', icon: MessageCircleQuestion },
  { id: 'place-once', label: '플레이스 1회 조회', icon: Search },
  { id: 'influencer', label: '쇼핑 커넥트 글쓰기', icon: Sparkles, badge: 'New' },
  { id: 'campaign', label: '제품 체험단', icon: Bell, badge: 'Brand' },
  { id: 'finder', label: '인플루언서 찾기', icon: TrendingUp, badge: 'Brand' },
  { id: 'price', label: 'N 가격비교', icon: ShoppingBag, badge: 'HOT' },
  { id: 'nstore', label: 'N+ 스토어', icon: Store },
  { id: 'kin', label: '지식인 순위', icon: MessageCircleQuestion },
  { id: 'web', label: '통합웹 순위', icon: Activity },
  { id: 'clip', label: '클립 순위', icon: FileImage },
  { id: 'blog-info', label: '블로그 정보 조회', icon: BookOpenCheck },
  { id: 'volume', label: '키워드 검색량', icon: BarChart3 },
  { id: 'blog-exposure', label: '블로그 노출 확인', icon: Search },
  { id: 'content-automation', label: '콘텐츠 자동화', icon: Sparkles, badge: 'Auto' },
]

const toolGroups = [
  { id: 'dashboard', label: '대시보드', toolIds: ['dashboard'] },
  { id: 'marketing', label: '마케팅 설계', toolIds: ['marketing-design'] },
  { id: 'place', label: '플레이스 전용', toolIds: ['place', 'rank', 'place-once'] },
  { id: 'blog', label: '블로그 전용', toolIds: ['blog', 'blog-writer', 'blog-planner', 'blog-index', 'blog-info', 'blog-exposure'] },
  { id: 'store', label: '셀러 전용', toolIds: ['seller-keyword', 'seller-finder', 'seller-product', 'seller-rank', 'seller-ai', 'shop', 'price', 'nstore'] },
  { id: 'brand', label: '브랜드/협업 전용', toolIds: ['influencer', 'campaign', 'finder'] },
  { id: 'automation', label: '자동화', toolIds: ['content-automation'] },
  { id: 'kin', label: '지식인 전용', toolIds: ['kin'] },
  { id: 'search', label: '검색/콘텐츠 전용', toolIds: ['auto', 'web', 'clip', 'volume', 'combo'] },
]

const utilities = [
  { id: 'image-resize', label: '이미지 대량 리사이징', icon: FileImage },
  { id: 'character-count', label: '글자수세기', icon: TextCursorInput },
  { id: 'keyword-combo', label: '키워드 조합기', icon: Combine },
]

const toolConfigs = {
  'marketing-design': {
    headline: '플레이스 링크를 기준으로 네이버 카페, 블로그, 플레이스 상위노출 전략을 설계합니다.',
    urlLabel: '네이버 플레이스 URL',
    keywordLabel: '핵심 업종 키워드',
    locationLabel: '상권/지역',
    primaryMetric: '전략 완성도',
    tableEyebrow: '마케팅 설계',
    tableTitle: '상위노출 키워드 설계',
    trendTitle: '채널별 우선순위',
    trendNote: '플레이스는 저장/리뷰, 블로그는 검색 의도, 카페는 질문형 침투를 함께 설계해야 네이버 전체 노출면을 잡을 수 있습니다.',
    defaultKeyword: '강남 샤브샤브',
    tags: ['강남 샤브샤브', '역삼 점심', '강남 회식', '샤브샤브 맛집', '단체 예약', '주차 가능'],
    rows: baseRows('강남 샤브샤브', 5),
    cards: ['플레이스 링크 기반 진단', '경쟁 키워드 장악도 분석', '블로그/카페/플레이스 실행 플랜'],
  },
  place: {
    headline: '플레이스 URL을 기준으로 대표 키워드와 숨은 노출 기회를 찾습니다.',
    urlLabel: '네이버 플레이스 URL',
    keywordLabel: '대표 키워드',
    locationLabel: '상권/지역',
    primaryMetric: '예상 현재 순위',
    tableEyebrow: '플레이스 키워드',
    tableTitle: '히든 키워드 후보',
    trendTitle: '플레이스 순위 변화',
    trendNote: '저장 수와 방문 리뷰가 함께 오르면 지도 노출 방어력이 좋아집니다.',
    defaultKeyword: '강남 샤브샤브',
    tags: ['강남 샤브샤브', '역삼 점심', '회식 장소', '마라탕 맛집', '단체 예약', '주차 가능'],
    rows: baseRows('강남 샤브샤브', 4),
    cards: ['대표 키워드 누락 확인', '저장/리뷰 증감 추적', '상권별 경쟁 매장 비교'],
  },
  rank: {
    headline: '키워드별 업체 순위, 저장 수, 리뷰 증가를 나란히 비교합니다.',
    urlLabel: '비교할 업체 또는 캠페인 URL',
    keywordLabel: '비교 키워드',
    locationLabel: '비교 지역',
    primaryMetric: '평균 노출 순위',
    tableEyebrow: '순위 비교분석',
    tableTitle: '경쟁 키워드 순위',
    trendTitle: '비교 순위 흐름',
    trendNote: '상승 키워드는 광고 예산을 늘리고 하락 키워드는 콘텐츠 보강 대상으로 분류하세요.',
    defaultKeyword: '역삼 점심 맛집',
    tags: ['역삼 점심 맛집', '강남 회식', '선릉 맛집', '삼성역 점심', '단체 예약', '주말 영업'],
    rows: baseRows('역삼 점심 맛집', 7),
    cards: ['업체별 순위 비교', '전일 대비 변동 감지', '하락 키워드 우선순위화'],
  },
  blog: {
    headline: '블로그 글의 노출 가능성, 키워드 밀도, 발행 후 변화를 점검합니다.',
    urlLabel: '블로그 글 URL',
    keywordLabel: '검사 키워드',
    locationLabel: '카테고리/주제',
    primaryMetric: '노출 적합도',
    tableEyebrow: '블로그 검사',
    tableTitle: '포스팅 점검 항목',
    trendTitle: '블로그 노출 변화',
    trendNote: '제목과 첫 문단의 키워드 일치도를 높이면 초기 노출 안정성이 좋아집니다.',
    defaultKeyword: '강남 맛집 후기',
    tags: ['강남 맛집 후기', '역삼 점심 추천', '샤브샤브 리뷰', '내돈내산', '예약 팁', '주차 정보'],
    rows: baseRows('블로그 포스팅', 9),
    cards: ['제목/본문 키워드 검사', '누락 이미지 ALT 점검', '발행 히스토리 확인'],
  },
  'blog-writer': {
    headline: '키워드, 제목, 말투, 글자 수를 설정해 상위노출형 블로그 글을 빠르게 작성합니다.',
    urlLabel: '참고 링크',
    keywordLabel: '메인 키워드',
    locationLabel: '글 타입',
    primaryMetric: '작성 준비도',
    tableEyebrow: '블로그 글쓰기 2.1',
    tableTitle: '작성 인사이트',
    trendTitle: '실시간 주제',
    trendNote: '메인 키워드, 글 타입, 제목 구조를 먼저 잡아야 글 생성 품질이 올라갑니다.',
    defaultKeyword: '강남 맛집 후기',
    tags: ['강남 맛집 후기', '카페 리뷰', '제품 후기', '여행 후기', '병원 후기', '육아 정보'],
    rows: baseRows('블로그 글쓰기', 6),
    cards: ['글 타입별 템플릿', '실데이터 기반 인사이트', '해시태그/제목/본문 자동 생성'],
  },
  'blog-planner': {
    headline: '수집한 경쟁 블로그 링크를 바탕으로 내 블로그 운영 전략과 완성형 글을 만듭니다.',
    urlLabel: '경쟁 블로그 링크',
    keywordLabel: '목표 키워드',
    locationLabel: '블로그 주제',
    primaryMetric: '콘텐츠 준비도',
    tableEyebrow: 'AI 블로그 플래너',
    tableTitle: '콘텐츠 프로젝트',
    trendTitle: '발행 스케줄',
    trendNote: '상위 노출은 한 편의 글보다 주제 묶음, 발행 주기, 내부 링크, 설득 구조가 함께 쌓일 때 안정됩니다.',
    defaultKeyword: '강남 샤브샤브 맛집',
    tags: ['강남 샤브샤브 맛집', '역삼 점심 추천', '강남 회식 장소', '샤브샤브 후기', '주차 가능한 맛집', '단체 예약 맛집'],
    rows: baseRows('블로그 콘텐츠', 6),
    cards: ['경쟁 글 구조 분석', '발행 스케줄 자동 설계', '완성형 블로그 글 작성'],
  },
  'blog-index': {
    headline: '블로그의 주제 일관성, 발행 꾸준함, 반응 지표를 종합해 성장 지수를 추정합니다.',
    urlLabel: '블로그 홈 URL',
    keywordLabel: '대표 주제 키워드',
    locationLabel: '운영 카테고리',
    primaryMetric: '블로그 지수 추정',
    tableEyebrow: '블로그 지수',
    tableTitle: '성장 지표 진단',
    trendTitle: '지수 개선 흐름',
    trendNote: '블로그 지수는 네이버 공식 공개 점수가 아니라 운영 지표를 기반으로 추정한 내부 진단값입니다.',
    defaultKeyword: '강남 맛집 블로그',
    tags: ['맛집 리뷰', '병원 마케팅', '여행 후기', '제품 리뷰', '지역 정보', '전문 칼럼'],
    rows: baseRows('블로그 지수', 5),
    cards: ['주제 전문성 추정', '발행/반응 균형 점검', '다음 개선 액션 제안'],
  },
  shop: {
    headline: '쇼핑 상품의 가격비교, 스토어 순위, 검색 노출 변화를 모니터링합니다.',
    urlLabel: '상품 또는 스토어 URL',
    keywordLabel: '상품 키워드',
    locationLabel: '카테고리',
    primaryMetric: '상품 노출 순위',
    tableEyebrow: '쇼핑 순위',
    tableTitle: '상품 키워드 현황',
    trendTitle: '쇼핑 순위 추세',
    trendNote: '가격 경쟁력과 리뷰 증가 속도가 함께 유지될 때 쇼핑 순위가 안정적입니다.',
    defaultKeyword: '무선 미니 청소기',
    tags: ['무선 미니 청소기', '차량용 청소기', '핸디 청소기', '저소음 청소기', '가성비', '선물 추천'],
    rows: baseRows('무선 미니 청소기', 6),
    cards: ['가격비교 순위 체크', '스토어 리뷰 증가 추적', '상품명 키워드 최적화'],
  },
  'seller-keyword': {
    headline: '상품 키워드의 검색량, 경쟁강도, 평균가, 상위 상품 패턴을 한 화면에서 분석합니다.',
    urlLabel: '참고 상품 URL',
    keywordLabel: '상품 키워드',
    locationLabel: '카테고리',
    primaryMetric: '키워드 기회도',
    tableEyebrow: '셀러 키워드 분석',
    tableTitle: '키워드 데이터',
    trendTitle: '시장 추이',
    trendNote: '검색량만 보지 말고 상품 수, 구매 의도, 평균가를 같이 봐야 팔릴 키워드를 고를 수 있습니다.',
    defaultKeyword: '텀블러',
    tags: ['텀블러', '차량용 방향제', '무선 청소기', '도킹형 보조배터리', '아기 물티슈', '여행용 파우치'],
    rows: baseRows('셀러 키워드', 8),
    cards: ['요약정보', '그래프', '네이버 TOP 상품', '연관키워드', '상품소싱'],
  },
  'seller-finder': {
    headline: '카테고리와 필터로 아직 덜 crowded한 황금 키워드를 찾고 바로 엑셀로 내보냅니다.',
    urlLabel: '참고 시장 URL',
    keywordLabel: '시드 키워드',
    locationLabel: '상품 카테고리',
    primaryMetric: '발굴 키워드 수',
    tableEyebrow: '키워드 찾기',
    tableTitle: '황금 키워드 후보',
    trendTitle: '필터 기준',
    trendNote: '검색량 5,000~50,000, 경쟁강도 낮음, 쇼핑전환 높음 조합을 먼저 보는 것이 안정적입니다.',
    defaultKeyword: '도시락통',
    tags: ['도시락통', '화장품 정리함', '반려동물 장난감', '휴대용 선풍기', '유아 식판', '운동 양말'],
    rows: baseRows('키워드 찾기', 10),
    cards: ['카테고리 탐색', '황금키워드 필터', '엑셀 다운로드'],
  },
  'seller-product': {
    headline: '등록된 상품 URL을 진단해 상품 등록, 판매 관리, 키워드 점수를 분리해서 보여줍니다.',
    urlLabel: '상품 상세 URL',
    keywordLabel: '대표 키워드',
    locationLabel: '판매 포인트',
    primaryMetric: '상품 진단 점수',
    tableEyebrow: '상품 분석',
    tableTitle: '상품 진단 리포트',
    trendTitle: '개선 우선순위',
    trendNote: '상세페이지 품질과 판매관리, 키워드 세팅이 함께 맞아야 노출과 전환이 같이 올라갑니다.',
    defaultKeyword: '무선 청소기',
    tags: ['무선 청소기', '에어프라이어', '블루투스 이어폰', '휴대용 믹서기', '수납 정리함', '목베개'],
    rows: baseRows('상품 분석', 7),
    cards: ['상품 등록 점수', '판매 관리 점수', '키워드 점수'],
  },
  'seller-rank': {
    headline: '상위 판매 상품의 가격, 리뷰, 구성, 키워드 사용 패턴을 비교해 순위 흐름을 읽습니다.',
    urlLabel: '비교 상품 URL',
    keywordLabel: '순위 키워드',
    locationLabel: '비교 마켓',
    primaryMetric: '상위 상품 강도',
    tableEyebrow: '상품 순위',
    tableTitle: 'TOP 상품 비교',
    trendTitle: '순위 변화',
    trendNote: '상위 상품은 상품명 키워드, 대표 이미지, 리뷰 속도, 가격 구성이 함께 움직입니다.',
    defaultKeyword: '차량용 방향제',
    tags: ['차량용 방향제', '물걸레 청소포', '노트북 거치대', '여행용 캐리어', '수건세트', '여름 파자마'],
    rows: baseRows('상품 순위', 9),
    cards: ['TOP 상품 비교', '가격/리뷰 흐름', '상위권 패턴'],
  },
  'seller-ai': {
    headline: '실데이터를 바탕으로 상품명, 상세페이지 구조, 광고 문구, 판매 포인트를 AI로 정리합니다.',
    urlLabel: '상품 링크',
    keywordLabel: '메인 키워드',
    locationLabel: '상품 카테고리',
    primaryMetric: 'AI 제작 준비도',
    tableEyebrow: '셀러 AI',
    tableTitle: 'AI 제작 결과',
    trendTitle: '콘텐츠 제작',
    trendNote: '잘 팔리는 상품명은 키워드, 사용 장면, 차별 포인트가 한 줄 안에서 균형을 이룹니다.',
    defaultKeyword: '휴대용 선풍기',
    tags: ['휴대용 선풍기', '텀블러', '무선 조명', '베개커버', '손목보호대', '욕실선반'],
    rows: baseRows('셀러 AI', 6),
    cards: ['상품명 제안', '상세페이지 초안', '광고 문구', '판매 포인트'],
  },
  'content-automation': {
    headline: '유튜브 영상 링크 하나로 블로그, 워드프레스, 스레드, 릴스 콘텐츠를 한 번에 변환합니다.',
    urlLabel: '유튜브 영상 URL',
    keywordLabel: '변환 키워드',
    locationLabel: '콘텐츠 목적',
    primaryMetric: '자동화 준비도',
    tableEyebrow: '콘텐츠 자동화',
    tableTitle: '멀티 플랫폼 결과',
    trendTitle: '플랫폼별 변환',
    trendNote: '영상의 핵심 메시지는 유지하고, 플랫폼마다 제목 구조, 문장 길이, CTA, 이미지/영상 배치를 다르게 가져갑니다.',
    defaultKeyword: '유튜브 콘텐츠 재활용',
    tags: ['유튜브 요약', '블로그 변환', '워드프레스 SEO', '스레드 글', '릴스 기획', '콘텐츠 자동화'],
    rows: baseRows('콘텐츠 자동화', 6),
    cards: ['유튜브 메타 분석', '네이버 블로그 글', '워드프레스 SEO 글', '스레드 문장', '릴스 기획'],
  },
  combo: {
    headline: '지역, 니즈, 상품명을 조합해 광고 소재용 롱테일 키워드를 만듭니다.',
    urlLabel: '참고 URL',
    keywordLabel: '기준 키워드',
    locationLabel: '확장 지역',
    primaryMetric: '생성 키워드 수',
    tableEyebrow: '키워드 조합기',
    tableTitle: '롱테일 키워드',
    trendTitle: '조합 활용도',
    trendNote: '전환 의도가 포함된 롱테일 키워드는 블로그와 플레이스 설명문에 우선 반영하세요.',
    defaultKeyword: '피부관리',
    tags: ['피부관리', '웨딩케어', '여드름 관리', '남자 피부관리', '강남 피부샵', '예약 할인'],
    rows: baseRows('피부관리 키워드', 10),
    cards: ['지역+서비스 조합', '니즈+가격 조합', '콘텐츠 제목 후보 생성'],
  },
  auto: {
    headline: '자동완성, 연관검색, 추천검색 노출 여부를 매일 확인합니다.',
    urlLabel: '브랜드 또는 콘텐츠 URL',
    keywordLabel: '시드 키워드',
    locationLabel: '검색 영역',
    primaryMetric: '노출 감지 수',
    tableEyebrow: '검색어 모니터링',
    tableTitle: '자동완성/연관검색',
    trendTitle: '추천어 감지 추세',
    trendNote: '브랜드명 주변 추천어가 바뀌면 광고 문구와 FAQ를 함께 조정하는 것이 좋습니다.',
    defaultKeyword: '마부',
    tags: ['마부', '마케팅 부스트', '광고 분석툴', '플레이스 순위', '블로그 노출', '쇼핑 순위'],
    rows: baseRows('광고 분석툴', 3),
    cards: ['자동완성 노출 확인', '연관검색어 생성 감지', '브랜드 검색어 리스크 확인'],
  },
  'place-once': {
    headline: '키워드 하나로 현재 플레이스 순위와 경쟁 지표를 빠르게 조회합니다.',
    urlLabel: '플레이스 URL 또는 업체명',
    keywordLabel: '조회 키워드',
    locationLabel: '조회 지역',
    primaryMetric: '현재 조회 순위',
    tableEyebrow: '1회 순위 조회',
    tableTitle: '즉시 조회 결과',
    trendTitle: '최근 기준 비교',
    trendNote: '1회 조회는 빠른 현황 확인용이며, 반복 추적은 추적 추가로 관리하는 것이 좋습니다.',
    defaultKeyword: '홍대 맛집',
    tags: ['홍대 맛집', '강남 피부과', '성수 카페', '부산 횟집', '제주 렌트카', '대전 한의원'],
    rows: baseRows('홍대 맛집', 5),
    cards: ['현재 순위 즉시 확인', '경쟁 업체 지표 비교', '추적 전 빠른 검증'],
  },
  influencer: {
    headline: '제품 링크를 넣으면 실제 상품 정보와 네이버 키워드 데이터를 바탕으로 홍보 글을 작성합니다.',
    urlLabel: '제품 링크',
    keywordLabel: '대표 키워드',
    locationLabel: '콘텐츠 방향',
    primaryMetric: '상품 콘텐츠 준비도',
    tableEyebrow: '쇼핑 커넥트',
    tableTitle: '상품 분석 결과',
    trendTitle: '상품 키워드 추세',
    trendNote: '상품명만이 아니라 사용 상황, 차별점, 후기 맥락까지 함께 잡아야 설득력이 올라갑니다.',
    defaultKeyword: '단백질 쉐이크',
    tags: ['단백질 쉐이크', '뷰티 디바이스', '유아용품', '주방가전', '건강식품', '생활용품'],
    rows: baseRows('단백질 쉐이크', 11),
    cards: ['상품 링크 분석', '실검색 데이터 결합', '홍보용 완성형 글 작성'],
  },
  campaign: {
    headline: '제품 체험단 모집 조건, 크리에이터 가이드, 발행 일정까지 한 번에 설계합니다.',
    urlLabel: '체험단 모집 페이지',
    keywordLabel: '제품/캠페인 키워드',
    locationLabel: '캠페인 목표',
    primaryMetric: '캠페인 준비도',
    tableEyebrow: '제품 체험단',
    tableTitle: '체험단 캠페인 현황',
    trendTitle: '체험단 진행 흐름',
    trendNote: '체험단은 모집보다 선정 기준과 발행 가이드가 더 중요합니다.',
    defaultKeyword: '두피 세럼 체험단',
    tags: ['두피 세럼 체험단', '육아템 체험단', '생활가전 체험단', '뷰티 디바이스 체험단', '반려동물 간식 체험단', '건강식품 체험단'],
    rows: baseRows('두피 세럼 체험단', 8),
    cards: ['모집 조건 설계', '발행 가이드 작성', '후기 회수 일정 관리'],
  },
  finder: {
    headline: '키워드, 반응률, 콘텐츠 톤, 예상 단가를 기준으로 협업할 인플루언서를 추립니다.',
    urlLabel: '찾고 싶은 카테고리',
    keywordLabel: '핵심 키워드',
    locationLabel: '협업 목표',
    primaryMetric: '매칭 적합도',
    tableEyebrow: '인플루언서 찾기',
    tableTitle: '후보 인플루언서 목록',
    trendTitle: '후보 비교 흐름',
    trendNote: '팔로워 수보다 반응률과 콘텐츠 결이 브랜드에 맞는지가 더 중요합니다.',
    defaultKeyword: '홈카페 인플루언서',
    tags: ['홈카페 인플루언서', '육아 블로거', '뷰티 릴스', '러닝 크리에이터', '반려동물 유튜버', '자취 리뷰어'],
    rows: baseRows('홈카페 인플루언서', 10),
    cards: ['채널 적합도 비교', '예상 단가 추정', '협업 제안 메시지 생성'],
  },
  price: {
    headline: '네이버 가격비교 영역에서 상품의 순위, 가격 경쟁력, 리뷰 지표를 확인합니다.',
    urlLabel: '가격비교 상품 URL',
    keywordLabel: '가격비교 키워드',
    locationLabel: '상품군',
    primaryMetric: '가격비교 순위',
    tableEyebrow: 'N 가격비교',
    tableTitle: '가격비교 상품 현황',
    trendTitle: '가격비교 순위 추세',
    trendNote: '최저가만이 아니라 배송비, 리뷰 수, 묶음 구성까지 함께 점검해야 순위 방어가 됩니다.',
    defaultKeyword: '로봇청소기',
    tags: ['로봇청소기', '공기청정기', '무선이어폰', '캠핑의자', '가습기', '저소음 선풍기'],
    rows: baseRows('로봇청소기', 4),
    cards: ['가격 경쟁력 확인', '리뷰 증가 추적', '최저가 변동 감지'],
  },
  nstore: {
    headline: '네이버 플러스 스토어 상품의 검색 노출과 스토어 신뢰 지표를 추적합니다.',
    urlLabel: 'N+ 스토어 상품 URL',
    keywordLabel: '스토어 키워드',
    locationLabel: '스토어 카테고리',
    primaryMetric: '스토어 노출 순위',
    tableEyebrow: 'N+ 스토어',
    tableTitle: '스토어 상품 순위',
    trendTitle: '스토어 노출 추세',
    trendNote: '스토어찜, 리뷰, 배송 만족도가 함께 개선될 때 상품 노출이 오래 유지됩니다.',
    defaultKeyword: '단백질 쉐이크',
    tags: ['단백질 쉐이크', '비타민', '홍삼 선물', '다이어트 도시락', '강아지 간식', '홈트 용품'],
    rows: baseRows('단백질 쉐이크', 6),
    cards: ['스토어 상품 순위', '찜/리뷰 지표 추적', '상품명 키워드 점검'],
  },
  kin: {
    headline: '지식인 답변과 질문 영역에서 브랜드/키워드 노출 여부를 확인합니다.',
    urlLabel: '지식인 답변 또는 브랜드 URL',
    keywordLabel: '질문 키워드',
    locationLabel: '질문 카테고리',
    primaryMetric: '답변 노출 순위',
    tableEyebrow: '지식인 순위',
    tableTitle: '질문 키워드 노출',
    trendTitle: '지식인 노출 추세',
    trendNote: '질문 의도에 맞는 답변 제목과 최신성이 지식인 노출 유지에 중요합니다.',
    defaultKeyword: '여드름 치료',
    tags: ['여드름 치료', '이사 견적', '세무 상담', '임플란트 가격', '다이어트 방법', '피부관리 비용'],
    rows: baseRows('여드름 치료', 13),
    cards: ['질문 노출 확인', '답변 최신성 점검', '브랜드 언급 감지'],
  },
  web: {
    headline: '네이버 통합웹 영역에서 웹사이트 URL 노출 순위와 검색 문맥을 기록합니다.',
    urlLabel: '웹사이트 URL',
    keywordLabel: '웹 검색 키워드',
    locationLabel: '검색 문맥',
    primaryMetric: '웹 노출 순위',
    tableEyebrow: '통합웹 순위',
    tableTitle: '웹사이트 노출 현황',
    trendTitle: '통합웹 노출 추세',
    trendNote: '타이틀, 설명문, 페이지 속도, 검색 의도 일치도가 통합웹 노출에 영향을 줍니다.',
    defaultKeyword: '광고 분석 솔루션',
    tags: ['광고 분석 솔루션', '마케팅 대행', '병원 홈페이지', '랜딩페이지 제작', 'SEO 컨설팅', '브랜드 검색'],
    rows: baseRows('광고 분석 솔루션', 9),
    cards: ['웹사이트 순위 체크', '검색 문맥 점검', 'SEO 개선 후보 정리'],
  },
  clip: {
    headline: '네이버 클립 영역에서 숏폼 콘텐츠의 키워드 노출 순위를 확인합니다.',
    urlLabel: '클립 URL',
    keywordLabel: '클립 키워드',
    locationLabel: '콘텐츠 주제',
    primaryMetric: '클립 노출 순위',
    tableEyebrow: '클립 순위',
    tableTitle: '숏폼 콘텐츠 현황',
    trendTitle: '클립 노출 추세',
    trendNote: '초반 반응, 제목 키워드, 썸네일 문구가 클립 검색 노출에 직접적인 영향을 줍니다.',
    defaultKeyword: '강남 맛집 릴스',
    tags: ['강남 맛집 릴스', '피부관리 영상', '제품 리뷰 숏폼', '카페 브이로그', '운동 루틴', '여행 클립'],
    rows: baseRows('강남 맛집 릴스', 7),
    cards: ['클립 노출 순위', '썸네일 문구 점검', '숏폼 반응 추적'],
  },
  'blog-info': {
    headline: '블로그의 발행 빈도, 카테고리 집중도, 영향력 지표를 조회합니다.',
    urlLabel: '블로그 홈 URL',
    keywordLabel: '대표 주제',
    locationLabel: '블로그 카테고리',
    primaryMetric: '블로그 영향 점수',
    tableEyebrow: '블로그 정보',
    tableTitle: '블로그 영향력 지표',
    trendTitle: '블로그 성장 추세',
    trendNote: '발행 주기와 주제 일관성이 높을수록 블로그 단위의 신뢰 지표가 좋아집니다.',
    defaultKeyword: '맛집 블로그',
    tags: ['맛집 블로그', '뷰티 블로그', '병원 블로그', '육아 블로그', '여행 블로그', '리뷰 블로그'],
    rows: baseRows('맛집 블로그', 12),
    cards: ['발행 빈도 확인', '주제 집중도 분석', '영향력 지표 추정'],
  },
  volume: {
    headline: '키워드의 월간 검색량, 경쟁도, 콘텐츠 발행량을 함께 비교합니다.',
    urlLabel: '참고 URL',
    keywordLabel: '검색량 키워드',
    locationLabel: '검색 매체',
    primaryMetric: '월 검색량',
    tableEyebrow: '키워드 검색량',
    tableTitle: '검색량/경쟁도 비교',
    trendTitle: '검색량 추세',
    trendNote: '검색량이 높은 키워드보다 전환 의도가 명확하고 경쟁도가 낮은 키워드를 우선 공략하세요.',
    defaultKeyword: '강남 맛집',
    tags: ['강남 맛집', '피부과 추천', '이사 견적', '다이어트 식단', '로봇청소기', '제주 숙소'],
    rows: baseRows('강남 맛집', 2),
    cards: ['월 검색량 조회', '경쟁도 비교', '콘텐츠 발행량 확인'],
  },
  'blog-exposure': {
    headline: '특정 블로그 포스팅이 목표 키워드에서 실제로 노출되는지 확인합니다.',
    urlLabel: '블로그 포스팅 URL',
    keywordLabel: '노출 확인 키워드',
    locationLabel: '검색 영역',
    primaryMetric: '노출 확인 순위',
    tableEyebrow: '블로그 노출 확인',
    tableTitle: '포스팅 노출 결과',
    trendTitle: '포스팅 노출 추세',
    trendNote: '노출이 안 되는 포스팅은 제목, 첫 문단, 이미지 설명, 발행 카테고리를 먼저 점검하세요.',
    defaultKeyword: '역삼 점심 추천',
    tags: ['역삼 점심 추천', '강남 샤브샤브', '피부관리 후기', '이사 준비', '병원 상담', '제품 사용법'],
    rows: baseRows('역삼 점심 추천', 15),
    cards: ['포스팅 노출 여부', '목표 키워드 순위', '수정 우선순위 제안'],
  },
}

function baseRows(keyword, startRank) {
  return [
    { keyword, today: startRank, yesterday: startRank + 2, save: '1,240+', blog: 1188, visit: 2190 },
    { keyword: `${keyword} 추천`, today: startRank + 2, yesterday: startRank + 3, save: '980+', blog: 872, visit: 1634 },
    { keyword: `${keyword} 예약`, today: startRank + 5, yesterday: startRank + 4, save: '720+', blog: 611, visit: 1428 },
    { keyword: `${keyword} 후기`, today: startRank + 1, yesterday: startRank + 4, save: '1,100+', blog: 1024, visit: 1870 },
  ]
}

const baseRankRows = [
  { keyword: '강남 샤브샤브', today: 4, yesterday: 6, save: '1,240+', blog: 1188, visit: 2190 },
  { keyword: '역삼 점심 맛집', today: 8, yesterday: 11, save: '980+', blog: 872, visit: 1634 },
  { keyword: '강남 회식 장소', today: 12, yesterday: 10, save: '720+', blog: 611, visit: 1428 },
  { keyword: '마라샹궈 맛집', today: 5, yesterday: 7, save: '1,100+', blog: 1024, visit: 1870 },
]

const defaultTrackedItems = [
  { id: 1, title: '강남 샤브샤브 플레이스', channel: 'Place', status: '상승', change: '+6', color: 'green' },
  { id: 2, title: '여름 프로모션 블로그', channel: 'Blog', status: '검토', change: '2건', color: 'amber' },
  { id: 3, title: '스마트스토어 대표상품', channel: 'Shopping', status: '유지', change: '3위', color: 'blue' },
]

const dates = ['05.25', '05.24', '05.23', '05.22', '05.21', '05.20', '05.19']

const platformMarketingStatus = [
  {
    platform: '네이버 플레이스',
    toolId: 'place',
    status: '운영중',
    focus: '저장/리뷰/지도 노출',
    progress: 72,
    metric: '4위',
    next: '후기 키워드 2개 보강',
    accent: 'green',
  },
  {
    platform: '네이버 블로그',
    toolId: 'blog-planner',
    status: '작성 필요',
    focus: 'SEO 글 발행',
    progress: 46,
    metric: '3건 대기',
    next: '경쟁글 기반 주제 10개 확정',
    accent: 'blue',
  },
  {
    platform: '스마트스토어',
    toolId: 'seller-product',
    status: '점검중',
    focus: '상품명/가격/리뷰',
    progress: 64,
    metric: '12위',
    next: '대표상품 키워드 재배치',
    accent: 'amber',
  },
  {
    platform: '콘텐츠 자동화',
    toolId: 'content-automation',
    status: '준비됨',
    focus: '유튜브 → 블로그/스레드/릴스',
    progress: 58,
    metric: '4채널',
    next: '영상 링크 넣고 변환 실행',
    accent: 'teal',
  },
  {
    platform: '인플루언서/체험단',
    toolId: 'campaign',
    status: '모집 전',
    focus: '협업 글/제품 체험',
    progress: 35,
    metric: '5명 후보',
    next: '제품 USP와 원고 방향 정리',
    accent: 'rose',
  },
]

const contentCalendarPatterns = [
  { platform: '블로그', status: '작성', toolId: 'blog-planner', accent: 'blue' },
  { platform: '플레이스', status: '운영', toolId: 'place', accent: 'green' },
  { platform: '쇼핑', status: '점검', toolId: 'seller-product', accent: 'amber' },
  { platform: '릴스/스레드', status: '기획', toolId: 'content-automation', accent: 'teal' },
  { platform: '블로그', status: '발행', toolId: 'influencer', accent: 'rose' },
  { platform: '지식인', status: '대기', toolId: 'kin', accent: 'slate' },
  { platform: '리포트', status: '리뷰', toolId: 'rank', accent: 'violet' },
]

const fourWeekContentTitles = [
  [
    '경쟁글 분석 기반 SEO 글 발행',
    '리뷰 답변/저장 유도 문구 점검',
    '대표상품 키워드와 가격비교 확인',
    '유튜브 영상 숏폼 기획 변환',
    '상품 링크 기반 설득형 글 작성',
    '질문형 키워드 답변 소재 정리',
    '주간 성과/순익/다음 액션 정리',
  ],
  [
    '경쟁 블로그 링크 3개 분석',
    '플레이스 사진/메뉴 정보 보강',
    '상위 상품 리뷰 키워드 수집',
    '릴스 3개 훅 문장 제작',
    '네이버 블로그 완성글 발행',
    '지식인 답변 후보 5개 작성',
    '광고비 대비 순익 리포트',
  ],
  [
    '키워드 묶음별 내부 링크 설계',
    '방문 리뷰 요청 메시지 점검',
    '상품명 A/B 키워드 교체안',
    '스레드 문장 7개 예약 소재',
    '체험단 후기 가이드 원고',
    '질문형 롱테일 키워드 확장',
    '다음 주 콘텐츠 우선순위 결정',
  ],
  [
    '상위노출 글 리라이트 점검',
    '플레이스 순위 변화 체크',
    '스마트스토어 상세페이지 개선',
    '유튜브 영상 재가공 자동화',
    '제품 비교형 설득글 작성',
    '지식인 노출 답변 업데이트',
    '4주 운영 회고와 다음 목표 설정',
  ],
]

function buildFourWeekContentCalendar(startDate = new Date(2026, 4, 26)) {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']

  return Array.from({ length: 28 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    const pattern = contentCalendarPatterns[index % contentCalendarPatterns.length]
    const weekIndex = Math.floor(index / 7)
    const monthLabel = String(date.getMonth() + 1).padStart(2, '0')
    const dayLabel = String(date.getDate()).padStart(2, '0')

    return {
      ...pattern,
      week: `${weekIndex + 1}주차`,
      day: weekdays[date.getDay()],
      date: `${monthLabel}.${dayLabel}`,
      title: fourWeekContentTitles[weekIndex][index % 7],
    }
  })
}

const contentCalendarItems = buildFourWeekContentCalendar()

const defaultTopicIdeas = [
  { id: 1, title: '강남 샤브샤브 선택 기준 5가지', platform: '블로그', intent: '비교 탐색', angle: '처음 방문자가 실패하지 않는 기준', keyword: '강남 샤브샤브' },
  { id: 2, title: '스마트스토어 대표상품 구매 전 체크리스트', platform: '쇼핑', intent: '구매 직전', angle: '가격, 리뷰, 구성 비교', keyword: '대표상품 추천' },
  { id: 3, title: '유튜브 영상 하나로 만드는 릴스/스레드 기획', platform: '릴스/스레드', intent: '재활용', angle: '짧게 나눠 발행하는 콘텐츠 루틴', keyword: '콘텐츠 자동화' },
]

function createTopicIdeas(prompt, baseKeyword) {
  const seed = prompt.trim() || `${baseKeyword} 마케팅`
  const cleanSeed = seed.replace(/\s+/g, ' ').slice(0, 34)
  return [
    {
      id: Date.now(),
      title: `${cleanSeed} 선택 전 꼭 확인할 기준`,
      platform: '블로그',
      intent: '비교 탐색',
      angle: '검색자가 결정을 내리기 전에 필요한 판단 기준',
      keyword: cleanSeed,
    },
    {
      id: Date.now() + 1,
      title: `${cleanSeed} 후기에서 반복되는 장점과 불안요소`,
      platform: '블로그',
      intent: '후기 검증',
      angle: '실제 후기를 근거로 신뢰를 만드는 글',
      keyword: cleanSeed,
    },
    {
      id: Date.now() + 2,
      title: `${cleanSeed} 숏폼으로 15초 안에 설명하기`,
      platform: '릴스/스레드',
      intent: '관심 유도',
      angle: '짧은 훅, 핵심 장면, 댓글 유도',
      keyword: cleanSeed,
    },
  ]
}

function buildGeneratedContent(topic, day) {
  const platform = topic.platform || day.platform
  const title = `${day.date} ${platform} 콘텐츠: ${topic.title}`
  const hook = `${topic.keyword || topic.title}를 찾는 사람은 빠르게 결론을 알고 싶어합니다. 첫 문단에서 핵심 기준과 추천 이유를 먼저 제시하세요.`
  const body = [
    `1. 검색 의도: ${topic.intent || '정보 탐색'} 의도를 가진 독자가 바로 이해할 수 있게 문제 상황을 짚습니다.`,
    `2. 핵심 각도: ${topic.angle || '선택 기준'}을 중심으로 장점, 비교 포인트, 주의사항을 나눕니다.`,
    `3. 구성: 결론 → 기준 3가지 → 실제 예시 → 자주 묻는 질문 → 문의/저장 CTA 순서로 작성합니다.`,
    `4. 이미지: 첫 이미지는 결과를 보여주고, 중간 이미지는 비교 기준, 마지막 이미지는 행동을 유도하는 화면으로 배치합니다.`,
  ]
  const cta = platform.includes('블로그')
    ? '마지막 문단에는 저장, 댓글, 문의 중 하나로 이어지는 문장을 넣으세요.'
    : platform.includes('쇼핑')
      ? '가격, 리뷰, 구성 차이를 한눈에 보여주고 상품 상세로 이동하게 만드세요.'
      : '첫 3초 훅과 마지막 댓글 유도 문장을 반드시 분리하세요.'

  return { id: Date.now(), title, platform, hook, body, cta, sourceTopic: topic.title }
}

function buildMonthCalendar(calendarPlan, visibleMonth = new Date()) {
  const now = new Date()
  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []

  for (let index = 0; index < firstDay; index += 1) {
    cells.push({ id: `blank-${index}`, blank: true })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day)
    const monthLabel = String(month + 1).padStart(2, '0')
    const dayLabel = String(day).padStart(2, '0')
    const key = `${monthLabel}.${dayLabel}`
    const baseItems = contentCalendarItems.filter((item) => item.date === key)
    const plannedItems = (calendarPlan[key] || []).map((item) => ({
      platform: item.platform,
      title: item.title,
      status: item.status,
    }))
    cells.push({
      id: key,
      day,
      date: key,
      isToday: date.toDateString() === now.toDateString(),
      items: [...baseItems, ...plannedItems],
    })
  }

  return { title: `${year}년 ${month + 1}월`, cells }
}

function readStorage(key, fallback) {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function buildAnalysis({ placeUrl, keyword, location, tool }) {
  const seed = `${placeUrl}${keyword}${location}${tool}`.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return {
    rank: (seed % 9) + 2,
    score: 72 + (seed % 21),
    hidden: 5 + (seed % 8),
    exposure: 11800 + (seed % 4200),
    createdAt: new Date().toISOString(),
  }
}

function buildRows(keyword, analysis) {
  const primary = keyword.trim() || '대표 키워드'
  const related = [
    primary,
    `${primary} 추천`,
    `${primary} 예약`,
    `${primary} 후기`,
  ]

  return related.map((item, index) => {
    const today = Math.min(30, analysis.rank + index * 2)
    const yesterday = Math.min(32, today + (index % 2 === 0 ? 2 : -1))
    return {
      keyword: item,
      today,
      yesterday,
      save: `${900 + analysis.hidden * 31 - index * 82}+`,
      blog: 820 + analysis.hidden * 37 - index * 51,
      visit: 1380 + analysis.score * 9 - index * 73,
    }
  })
}

function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function buildProfitSummary({ revenue, adCost, operatingCost, extraCost }) {
  const safeRevenue = Math.max(0, Number(revenue) || 0)
  const safeAdCost = Math.max(0, Number(adCost) || 0)
  const safeOperatingCost = Math.max(0, Number(operatingCost) || 0)
  const safeExtraCost = Math.max(0, Number(extraCost) || 0)
  const totalCost = safeAdCost + safeOperatingCost + safeExtraCost
  const netProfit = safeRevenue - totalCost
  const margin = safeRevenue ? Math.round((netProfit / safeRevenue) * 1000) / 10 : 0
  const roas = safeAdCost ? Math.round((safeRevenue / safeAdCost) * 10) / 10 : 0

  return {
    revenue: safeRevenue,
    adCost: safeAdCost,
    operatingCost: safeOperatingCost,
    extraCost: safeExtraCost,
    totalCost,
    netProfit,
    margin,
    roas,
  }
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => resolve({ image, url })
    image.onerror = reject
    image.src = url
  })
}

async function resizeImageFile(file, width, height, quality) {
  const { image, url } = await readImage(file)
  const ratio = image.width / image.height
  const targetWidth = Number(width) || Math.round((Number(height) || image.height) * ratio)
  const targetHeight = Number(height) || Math.round(targetWidth / ratio)
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, targetWidth, targetHeight)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality / 100))
  URL.revokeObjectURL(url)
  return {
    name: file.name.replace(/\.[^.]+$/, '') + `-${targetWidth}x${targetHeight}.jpg`,
    size: blob.size,
    url: URL.createObjectURL(blob),
    width: targetWidth,
    height: targetHeight,
  }
}

function UtilityWorkspace({ activeUtility, setActiveUtility, showToast }) {
  const [imageFiles, setImageFiles] = useState([])
  const [resizeWidth, setResizeWidth] = useState(1200)
  const [resizeHeight, setResizeHeight] = useState('')
  const [quality, setQuality] = useState(82)
  const [resizedImages, setResizedImages] = useState([])
  const [textValue, setTextValue] = useState('강남 샤브샤브 맛집 추천 포스팅 초안입니다.')
  const [seedWords, setSeedWords] = useState('강남\n역삼\n선릉')
  const [coreWords, setCoreWords] = useState('샤브샤브\n점심\n회식')
  const [intentWords, setIntentWords] = useState('맛집\n추천\n예약')

  const activeMeta = utilities.find((item) => item.id === activeUtility)
  const ActiveIcon = activeMeta.icon
  const characterCount = textValue.length
  const noSpaceCount = textValue.replace(/\s/g, '').length
  const byteCount = new TextEncoder().encode(textValue).length
  const lineCount = textValue ? textValue.split(/\n/).length : 0

  const keywordResults = useMemo(() => {
    const seeds = seedWords.split(/\n|,/).map((item) => item.trim()).filter(Boolean)
    const cores = coreWords.split(/\n|,/).map((item) => item.trim()).filter(Boolean)
    const intents = intentWords.split(/\n|,/).map((item) => item.trim()).filter(Boolean)
    return seeds.flatMap((seed) => cores.flatMap((core) => intents.map((intent) => `${seed} ${core} ${intent}`))).slice(0, 60)
  }, [coreWords, intentWords, seedWords])

  const handleResize = async () => {
    if (imageFiles.length === 0) {
      showToast('이미지를 먼저 선택해 주세요.')
      return
    }
    const nextImages = []
    for (const file of imageFiles) {
      nextImages.push(await resizeImageFile(file, resizeWidth, resizeHeight, quality))
    }
    setResizedImages(nextImages)
    showToast(`${nextImages.length}개 이미지 변환이 끝났습니다.`)
  }

  const renderUtility = () => {
    if (activeUtility === 'image-resize') {
      return (
        <section className="utility-grid">
          <div className="utility-panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">이미지 도구</span>
                <h2>이미지 대량 리사이징</h2>
              </div>
              <FileImage size={22} />
            </div>
            <label>
              <span>이미지 선택</span>
              <input
                className="file-input"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => setImageFiles(Array.from(event.target.files))}
              />
            </label>
            <div className="field-grid">
              <label>
                <span>가로(px)</span>
                <div className="input-shell">
                  <input value={resizeWidth} onChange={(event) => setResizeWidth(event.target.value)} />
                </div>
              </label>
              <label>
                <span>세로(px), 비우면 자동</span>
                <div className="input-shell">
                  <input value={resizeHeight} onChange={(event) => setResizeHeight(event.target.value)} />
                </div>
              </label>
            </div>
            <label>
              <span>품질 {quality}%</span>
              <input type="range" min="40" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
            </label>
            <button className="analyze-button" type="button" onClick={handleResize}>
              <RefreshCw size={18} />
              선택 이미지 변환
            </button>
          </div>

          <div className="utility-panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">변환 결과</span>
                <h2>{resizedImages.length || imageFiles.length}개 파일</h2>
              </div>
            </div>
            <div className="result-list">
              {resizedImages.length === 0 ? (
                <p>이미지를 선택하고 변환하면 다운로드 가능한 파일이 여기에 표시됩니다.</p>
              ) : (
                resizedImages.map((image) => (
                  <article key={image.url}>
                    <div>
                      <strong>{image.name}</strong>
                      <span>
                        {image.width}x{image.height} · {(image.size / 1024).toFixed(1)}KB
                      </span>
                    </div>
                    <a href={image.url} download={image.name}>다운로드</a>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      )
    }

    if (activeUtility === 'character-count') {
      return (
        <section className="utility-grid">
          <div className="utility-panel wide">
            <div className="section-header">
              <div>
                <span className="eyebrow">문장 도구</span>
                <h2>글자수세기</h2>
              </div>
              <TextCursorInput size={22} />
            </div>
            <textarea value={textValue} onChange={(event) => setTextValue(event.target.value)} />
          </div>
          <div className="utility-panel stat-panel">
            <article><span>공백 포함</span><strong>{characterCount.toLocaleString()}</strong></article>
            <article><span>공백 제외</span><strong>{noSpaceCount.toLocaleString()}</strong></article>
            <article><span>바이트</span><strong>{byteCount.toLocaleString()}</strong></article>
            <article><span>줄 수</span><strong>{lineCount.toLocaleString()}</strong></article>
          </div>
        </section>
      )
    }

    return (
      <section className="utility-grid">
        <div className="utility-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">키워드 도구</span>
              <h2>키워드 조합기</h2>
            </div>
            <Combine size={22} />
          </div>
          <div className="field-grid">
            <label>
              <span>지역/대상</span>
              <textarea value={seedWords} onChange={(event) => setSeedWords(event.target.value)} />
            </label>
            <label>
              <span>핵심어</span>
              <textarea value={coreWords} onChange={(event) => setCoreWords(event.target.value)} />
            </label>
          </div>
          <label>
            <span>의도/수식어</span>
            <textarea value={intentWords} onChange={(event) => setIntentWords(event.target.value)} />
          </label>
          <button
            className="analyze-button"
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(keywordResults.join('\n'))
              showToast('조합 키워드를 복사했습니다.')
            }}
          >
            <Combine size={18} />
            전체 복사
          </button>
        </div>
        <div className="utility-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">생성 결과</span>
              <h2>{keywordResults.length}개 조합</h2>
            </div>
          </div>
          <div className="combo-list utility-combo">
            {keywordResults.map((item) => (
              <button key={item} type="button">
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="utility-workspace">
      <div className="utility-hero">
        <div>
          <span className="eyebrow">기타</span>
          <h1>{activeMeta.label}</h1>
          <p>광고 운영 중 자주 필요한 보조 작업을 한 화면에서 처리합니다.</p>
        </div>
        <div className="utility-tabs">
          {utilities.map((utility) => {
            const Icon = utility.icon
            return (
              <button
                type="button"
                key={utility.id}
                className={activeUtility === utility.id ? 'active' : ''}
                onClick={() => setActiveUtility(utility.id)}
              >
                <Icon size={17} />
                {utility.label}
              </button>
            )
          })}
        </div>
        <div className="utility-hero-icon">
          <ActiveIcon size={28} />
        </div>
      </div>
      {renderUtility()}
    </section>
  )
}

function buildFullBlogArticle(keyword, topic, insights) {
  const primary = keyword.trim() || '대표 키워드'
  const subject = topic.trim() || '내 블로그 주제'
  return `[제목 후보]
1. ${primary} 찾는다면 먼저 확인해야 할 현실 기준 5가지
2. ${primary} 후기보다 중요한 선택 포인트 정리
3. ${primary} 고민 중이라면 이 글 하나로 비교해보세요

[대표 제목]
${primary} 찾는다면 먼저 확인해야 할 현실 기준 5가지

[본문]
${primary}를 검색하는 분들은 대부분 이미 여러 글을 비교하고 있을 가능성이 높습니다. 단순히 “좋다”, “추천한다”는 말보다 실제로 나에게 맞는지 판단할 수 있는 기준이 필요하죠. 그래서 이번 글에서는 ${subject} 관점에서 ${primary}를 선택할 때 꼭 확인해야 할 포인트를 정리했습니다.

특히 처음 검색하는 분들이 놓치기 쉬운 부분은 겉으로 보이는 후기 수나 사진 분위기만 보고 결정한다는 점입니다. 물론 후기와 사진도 중요하지만, 실제 만족도는 위치, 이용 목적, 가격대, 예약 편의성, 그리고 방문 후 경험이 기대와 얼마나 맞는지에서 갈립니다.

[사진 1: 대표 이미지]
사진 설명 예시: ${primary}를 찾는 분들이 가장 먼저 확인하는 전체 분위기와 위치감을 보여주는 사진입니다.

## ${primary}, 먼저 검색 의도를 이해해야 합니다

${primary}라는 키워드에는 여러 의도가 섞여 있습니다. 누군가는 데이트 장소를 찾고, 누군가는 가족 식사나 회식 장소를 찾습니다. 또 어떤 사람은 주차가 편한지, 예약이 가능한지, 가격대가 부담스럽지 않은지를 먼저 확인합니다.

그래서 블로그 글에서도 단순한 감상보다 “어떤 사람에게 맞는지”를 초반에 분명하게 말해주는 것이 좋습니다. 예를 들어 조용한 분위기를 원하는 사람에게 좋은지, 단체 방문에 적합한지, 빠른 식사에 적합한지처럼 독자가 스스로 판단할 수 있는 정보를 제공해야 합니다.

## 경쟁 글에서 반복되는 표현은 더 구체적으로 바꿔야 합니다

이번에 수집한 경쟁 블로그 링크 ${insights.linkCount}개를 기준으로 보면, 대부분의 글은 비슷한 제목 패턴과 후기 표현을 사용합니다. “추천”, “후기”, “맛집”, “예약” 같은 단어가 반복되고, 본문도 메뉴 소개와 분위기 설명에서 크게 벗어나지 않는 경우가 많습니다.

우리 글은 같은 키워드를 사용하더라도 더 설득력 있게 써야 합니다. 예를 들어 “분위기가 좋았다”라고 쓰기보다 “테이블 간격이 여유 있어서 대화가 편했고, 점심시간에도 동선이 복잡하지 않았다”처럼 장면이 떠오르게 쓰는 편이 훨씬 좋습니다.

[사진 2: 핵심 장점 사진]
사진 설명 예시: 테이블 구성, 메뉴 구성, 가격표, 내부 분위기처럼 선택에 직접 영향을 주는 장면을 배치합니다.

## 선택 전에 확인할 기준 1. 위치와 접근성

${primary}를 고를 때 위치는 생각보다 큰 영향을 줍니다. 아무리 후기가 좋아도 이동이 불편하거나 주변 동선이 맞지 않으면 실제 만족도는 떨어질 수 있습니다. 특히 점심, 회식, 예약 방문처럼 시간이 정해진 상황이라면 접근성은 더 중요합니다.

방문 전에는 지도에서 도보 거리, 주차 가능 여부, 주변 대중교통을 함께 확인하는 것이 좋습니다. 블로그 글에서는 “역에서 가깝다” 정도로 끝내기보다 몇 번 출구에서 어느 방향으로 이동하는지, 주변에 어떤 기준점이 있는지를 적어주면 독자에게 도움이 됩니다.

## 선택 전에 확인할 기준 2. 가격과 구성

가격은 단순히 비싸다, 저렴하다로 판단하기 어렵습니다. 중요한 것은 가격 대비 구성이 충분한지입니다. 메뉴 구성, 제공되는 서비스, 양, 분위기, 예약 편의성까지 함께 봐야 실제 만족도를 판단할 수 있습니다.

${primary}를 소개하는 글이라면 대표 메뉴나 대표 상품만 적는 것보다 어떤 상황에서 어떤 구성이 적합한지를 설명하는 것이 좋습니다. 예를 들어 2인 방문, 단체 방문, 가족 방문처럼 상황별로 추천 포인트를 나누면 독자가 훨씬 쉽게 결정할 수 있습니다.

[사진 3: 가격 또는 메뉴 정보]
사진 설명 예시: 가격표나 대표 메뉴를 보여주되, 단순 나열보다 어떤 선택이 좋은지 함께 설명합니다.

## 선택 전에 확인할 기준 3. 후기에서 봐야 할 포인트

후기를 볼 때는 별점이나 긍정 표현만 보는 것보다 반복적으로 언급되는 내용을 확인하는 것이 좋습니다. 여러 글에서 같은 장점이 반복된다면 실제 강점일 가능성이 높고, 같은 불편함이 반복된다면 방문 전 고려해야 할 요소입니다.

블로그 글을 작성할 때도 “좋았다”는 표현만 반복하면 설득력이 약해집니다. 대신 무엇이 좋았는지, 왜 좋았는지, 누구에게 특히 맞는지를 구체적으로 적어야 합니다. 이렇게 작성하면 네이버 블로그에서도 체류 시간과 정보 만족도를 높이는 데 도움이 됩니다.

## 선택 전에 확인할 기준 4. 예약과 방문 타이밍

${primary}를 찾는 분들은 당장 방문이나 예약을 고려하는 경우가 많습니다. 따라서 예약 가능 여부, 혼잡 시간, 추천 방문 시간은 글의 후반부가 아니라 중간 이후에 명확히 정리하는 것이 좋습니다.

특히 인기 있는 장소나 상품이라면 “언제 가면 좋은지”, “예약이 필요한지”, “대기 시간이 있는지” 같은 정보가 실제 행동으로 이어집니다. 이런 정보는 검색자에게 직접적인 도움이 되기 때문에 글의 신뢰도를 높여줍니다.

[사진 4: 방문 동선 또는 예약 힌트]
사진 설명 예시: 입구, 주차, 예약 화면, 안내 문구 등 실제 방문 전에 도움이 되는 사진을 배치합니다.

[이미지 배치 추천]
1. 대표 이미지는 글 최상단 첫 문단 바로 아래에 배치합니다. 검색자가 글의 주제와 분위기를 즉시 이해할 수 있어야 합니다.
2. 핵심 장점 이미지는 “경쟁 글에서 반복되는 표현은 더 구체적으로 바꿔야 합니다” 섹션 뒤에 넣습니다. 장점 설명과 이미지가 이어지면 설득력이 높아집니다.
3. 메뉴, 가격, 구성 이미지는 “가격과 구성” 섹션 바로 아래에 넣습니다. 독자가 비교 판단을 하는 지점이기 때문입니다.
4. 방문 동선, 예약, 안내 이미지는 “예약과 방문 타이밍” 섹션 뒤에 넣습니다. 행동 전환을 돕는 이미지로 활용합니다.
5. 마지막에는 직접 촬영한 현장 사진이나 변형 이미지를 한 장 더 넣고, 댓글/문의/예약 CTA로 연결합니다.

## 이런 분들에게 추천합니다

- ${primary}를 처음 검색해서 기준을 잡고 싶은 분
- 후기만 보고 결정하기보다 실제 선택 포인트를 비교하고 싶은 분
- 위치, 가격, 분위기, 예약 가능 여부를 한 번에 확인하고 싶은 분
- 비슷한 글이 많아 어떤 정보를 믿어야 할지 헷갈리는 분

## 최종 정리

${primary}를 선택할 때는 단순히 상위에 보이는 글이나 사진이 많은 글만 보는 것보다, 내 상황에 맞는 기준을 세우는 것이 중요합니다. 위치가 편한지, 가격과 구성이 적절한지, 후기가 구체적인지, 예약이나 방문 타이밍이 맞는지를 함께 확인하면 실패 확률을 줄일 수 있습니다.

이번 글은 ${subject} 관점에서 실제 선택에 도움이 되는 기준을 중심으로 정리했습니다. 방문이나 선택을 앞두고 있다면 위 기준을 체크해보고, 내 목적에 가장 잘 맞는 곳을 고르는 데 활용해보세요.

[마무리 CTA]
${primary} 관련해서 더 비교하고 싶은 기준이 있다면 댓글로 남겨주세요. 다음 글에서는 실제 후기에서 많이 언급되는 장점과 아쉬운 점을 더 구체적으로 정리해보겠습니다.

[네이버 블로그 SEO 체크리스트]
- 제목 앞부분에 핵심 키워드 포함
- 첫 문단 안에 ${primary} 자연스럽게 포함
- 소제목에 위치, 후기, 예약, 추천 같은 보조 키워드 분산
- 사진 설명에 메뉴/위치/가격/상황 정보 포함
- 마지막 문단에 댓글, 문의, 예약 등 행동 유도 문장 포함`
}

function buildBlogWriterArticle({ type, title, keyword, style, emphasis, length, insight }) {
  const mainKeyword = keyword.trim() || '대표 키워드'
  const postTitle = title.trim() || `${mainKeyword} ${type}`
  const voiceMap = {
    auto: '~해요',
    friendly: '~해요',
    formal: '~합니다',
    review: '~한다',
    reference: '내 스타일 참고',
  }
  const voice = voiceMap[style] ?? '~해요'
  const trendHint = insight?.monthly ? `월 검색량 ${insight.monthly.toLocaleString('ko-KR')}회` : '실검색량 연결 전'
  const emphasisText = emphasis.trim() || `${mainKeyword}를 찾는 사람이 실제로 궁금해하는 판단 기준`
  const repeatHint = insight?.competition ? Math.max(3, Math.min(7, Math.round(insight.competition / 16))) : 4
  const bodyScale = length >= 3000 ? '깊게' : length >= 1500 ? '충분히' : '간결하게'

  return `[글 타입]
${type}

[제목]
${postTitle}

[핵심 키워드]
${mainKeyword}

[작성 톤]
${voice}

[본문]
${postTitle}를 검색하는 분들은 이미 여러 글을 비교하고 있을 가능성이 큽니다. 그래서 이번 글은 ${emphasisText}을 중심으로 ${bodyScale} 정리했습니다. 현재 ${mainKeyword} 관련 검색 신호는 ${trendHint} 수준으로 파악되고 있어, 글의 첫 문단과 소제목에서 키워드 의도를 분명하게 잡는 것이 중요합니다.

먼저 이 글에서 가장 중요하게 볼 포인트는 “누구에게 맞는지”, “왜 선택할 만한지”, “방문 또는 구매 전에 무엇을 확인해야 하는지”입니다. 단순 후기보다 선택 기준이 분명한 글이 검색 만족도를 높이기 좋습니다.

## ${mainKeyword}, 먼저 어떤 상황에서 찾는지부터 정리해요

${mainKeyword}를 찾는 사람은 단순 정보보다 실제 결정에 도움이 되는 판단 기준을 원합니다. 그래서 글 초반에는 이 주제가 어떤 사람에게 맞는지, 어떤 상황에서 도움이 되는지부터 알려주는 것이 좋습니다.

## 이번 글에서 강조할 핵심

${emphasisText}을 중심으로 독자가 바로 판단할 수 있게 써야 합니다. 경쟁 글이 감상 위주라면 우리는 비교 기준, 실제 장면, 사용 이후 느낌을 더 구체적으로 풀어주는 편이 좋습니다.

## 본문 중간에 꼭 들어가야 할 정보

1. 실제 경험 또는 사용 장면
2. 선택 전에 확인해야 할 체크포인트
3. 장점뿐 아니라 아쉬운 점
4. 다른 대안과 비교했을 때의 차이

## 마무리

${mainKeyword} 관련 글은 메인 키워드를 본문에 약 ${repeatHint}회 정도 자연스럽게 분산하고, 소제목에도 보조 키워드를 나눠 넣는 방식이 안정적입니다. 마지막에는 댓글, 저장, 문의, 예약처럼 다음 행동으로 이어지는 문장을 넣어 마무리하는 것이 좋습니다.

[추천 해시태그]
#${mainKeyword.replace(/\s+/g, '')} #${type.replace(/\s+/g, '')} #${mainKeyword.split(' ')[0] ?? mainKeyword} #후기 #추천 #내돈내산`
}

function buildWriterTrendTopics(type) {
  const base = {
    '맛집 후기': ['과천 중앙국밥 셰프 협업', '투썸 애플망고빙수 후기 비교', '속초 중앙시장 인기 먹거리 TOP5', '서울대입구역 또닭발 솔직후기'],
    '카페 후기': ['씨랜드 카페 가장 많이 공유된 이유', '컴포즈커피 솔티드 쿨리치 신메뉴', '성수 신상 카페 포인트 정리', '한강뷰 카페 야간 방문 팁'],
    '제품 후기': ['여름 선풍기 비교 핵심 요약', '무선청소기 가성비 비교', '두피 세럼 한 달 사용기', '단백질 쉐이크 맛 비교'],
    '여행 후기': ['속초 1박2일 동선 정리', '제주 서쪽 코스 추천', '도쿄 소도시 감성 여행', '부산 야경 코스 후기'],
    '병원 후기': ['리프팅 상담 전 체크리스트', '치과 스케일링 후기 포인트', '피부관리 전후 비교 기준', '교정 상담 전 꼭 물을 질문'],
  }

  return base[type] ?? ['실시간 이슈 주제 1', '실시간 이슈 주제 2', '실시간 이슈 주제 3', '실시간 이슈 주제 4']
}

function buildBlogContentIdeas(keyword, topic, links, keywordInsight = null) {
  const primary = keyword.trim() || '대표 키워드'
  const subject = topic.trim() || '내 블로그 주제'
  const linkSignals = links
    .map((link) => decodeURIComponent(link).split(/[/?#._-]/).filter((word) => word.length >= 2).slice(-2).join(' '))
    .filter(Boolean)
  const competitorHint = linkSignals.length ? linkSignals.slice(0, 3).join(', ') : '경쟁 글 제목/본문 패턴'
  const dataHint = keywordInsight?.monthly
    ? `월 검색량 ${keywordInsight.monthly.toLocaleString('ko-KR')}회, 블로그 문서 ${keywordInsight.blogDocs.toLocaleString('ko-KR')}개`
    : '실검색량 API가 없으면 링크 구조와 제목 패턴을 우선 참고'
  const themes = [
    { intent: '비교 탐색', angle: '선택 기준', format: '체크리스트', priority: '1순위' },
    { intent: '방문 직전', angle: '예약/동선', format: '방문 가이드', priority: '1순위' },
    { intent: '가격 확인', angle: '가격과 구성', format: '비교표', priority: '1순위' },
    { intent: '후기 검증', angle: '실제 후기', format: '경험형 리뷰', priority: '2순위' },
    { intent: '상황별 추천', angle: '데이트/회식/가족', format: '상황별 추천', priority: '2순위' },
    { intent: '초보 검색자', angle: '처음 가는 사람 기준', format: '입문 가이드', priority: '2순위' },
    { intent: '대안 비교', angle: '근처/비슷한 선택지', format: '비교 리뷰', priority: '3순위' },
    { intent: '문제 해결', angle: '실패하지 않는 방법', format: 'FAQ', priority: '3순위' },
    { intent: '사진 탐색', angle: '사진으로 보는 핵심 포인트', format: '포토 리뷰', priority: '3순위' },
    { intent: '재방문/장기 관리', angle: '업데이트와 변화', format: '재방문 후기', priority: '4순위' },
    { intent: '로컬 검색', angle: '지역 키워드 확장', format: '지역별 정리', priority: '4순위' },
    { intent: '전환 유도', angle: '문의/예약 전 확인사항', format: '전환형 글', priority: '4순위' },
  ]

  return themes.map((theme, index) => ({
    id: `idea-${index + 1}`,
    no: index + 1,
    title: `${primary} ${theme.angle} 총정리`,
    keyword: index < 4 ? primary : `${primary} ${theme.angle}`,
    intent: theme.intent,
    format: theme.format,
    priority: theme.priority,
    reason: `${subject} 독자가 ${theme.intent} 단계에서 궁금해하는 내용을 경쟁 글(${competitorHint})보다 구체적으로 풀어낼 수 있습니다.`,
    dataReason: dataHint,
    outline: [
      `${theme.angle}을 먼저 봐야 하는 이유`,
      `경쟁 글에서 부족한 정보와 내 글의 차별점`,
      `사진으로 보여줘야 할 증거 장면`,
      `마지막 행동 유도 문장`,
    ],
  }))
}

function buildProductPromoArticle(productName, keyword, topic, insight) {
  const name = productName || keyword || '대표 상품'
  const primary = keyword || name
  const category = topic || '제품 리뷰'
  const monthlyText = insight?.monthly ? `${insight.monthly.toLocaleString('ko-KR')}회` : '확인 중'

  return `[제목 후보]
1. ${name} 직접 보기 전에 먼저 체크한 현실 포인트
2. ${primary} 고민된다면 장점과 아쉬운 점부터 보세요
3. ${name} 사용 목적별로 어떻게 고르면 좋은지 정리

[대표 제목]
${name} 고민된다면 장점과 아쉬운 점부터 보세요

[본문]
${name} 같은 제품은 사진 한 장만 보고 선택하기보다 실제 사용 상황과 비교 포인트를 함께 봐야 만족도가 높습니다. 이번 글은 ${category} 관점에서 제품 특징, 어떤 사람에게 맞는지, 구매 전에 꼭 확인할 기준을 정리했습니다.

특히 네이버 검색 기준으로 ${primary} 관련 월 검색량은 ${monthlyText} 수준으로 파악되고 있습니다. 검색 수요가 있다는 뜻은 그만큼 비슷한 제품과 비교하는 사람도 많다는 의미이기 때문에, 단순 스펙 나열보다 “왜 이 제품을 선택할 만한지”를 더 선명하게 보여주는 것이 중요합니다.

[사진 1: 대표 제품 이미지]
사진 설명 예시: ${name}의 전체 형태와 첫인상을 보여주는 대표 이미지입니다.

## ${name}, 어떤 사람에게 맞는 제품인가요

이 제품을 검색하는 사람은 대체로 비슷한 카테고리 안에서 가성비, 사용 편의성, 실사용 만족도를 함께 비교합니다. 그래서 글 초반에는 이 제품이 누구에게 맞는지부터 분명하게 말해주는 편이 좋습니다.

예를 들어 처음 쓰는 사람에게 쉬운지, 이미 비슷한 제품을 써본 사람이 업그레이드용으로 선택할 만한지, 일상 사용에서 가장 체감되는 장점이 무엇인지를 짚어주면 독자가 빠르게 판단할 수 있습니다.

## 경쟁 제품과 비교할 때 봐야 할 포인트

${primary} 키워드로 검색되는 글들은 대체로 장점 위주로만 정리되는 경우가 많습니다. 하지만 실제 구매 전환을 만들려면 장점뿐 아니라 아쉬운 점, 어떤 상황에서 더 적합한지, 다른 제품과 비교했을 때 차이가 무엇인지까지 말해줘야 합니다.

우리 글에서는 제품 특징을 “기능”, “사용 장면”, “유지 비용”, “휴대성 또는 보관성”처럼 실제 판단 기준으로 번역해주는 것이 좋습니다.

[사진 2: 핵심 기능 이미지]
사진 설명 예시: 버튼 구성, 패키지, 사용 장면, 대표 기능이 드러나는 컷을 넣습니다.

## 구매 전에 꼭 확인할 기준 1. 실제 사용 편의성

제품 설명 페이지에 있는 스펙만 보면 좋아 보이지만, 실제 사용에서는 조작이 쉬운지, 관리가 번거롭지 않은지, 반복해서 쓸 때 불편함이 없는지가 더 중요합니다.

이 부분을 글에서 자세히 다루면 검색자 입장에서 제품을 더 현실적으로 이해할 수 있습니다. 가능하면 사용 단계별로 무엇이 편했고 무엇은 아쉬웠는지까지 적는 것이 좋습니다.

## 구매 전에 꼭 확인할 기준 2. 가격 대비 구성

가격은 단순히 저렴하냐 비싸냐보다, 구성 대비 납득 가능한지가 핵심입니다. 본품만 좋은지, 함께 제공되는 구성품이나 보조 기능까지 포함해 실제 만족도가 어떤지를 설명해야 합니다.

[사진 3: 구성품 또는 가격 포인트]
사진 설명 예시: 구성품, 패키지, 옵션 차이, 가격대 판단 근거가 되는 장면을 보여줍니다.

## 구매 전에 꼭 확인할 기준 3. 후기에서 반복되는 평가

후기에서 자주 반복되는 표현은 실제 구매 만족도와 연결되는 경우가 많습니다. “생각보다 간편했다”, “마감이 깔끔했다”, “반대로 소음이나 부피는 아쉬웠다”처럼 반복되는 내용을 중심으로 정리하면 설득력이 높아집니다.

## 최종 정리

${name}는 ${category} 기준에서 관심을 가질 만한 포인트가 분명한 제품입니다. 다만 검색자가 궁금해하는 것은 제품 자체보다 “내 상황에 맞는지”이기 때문에, 글에서는 사용 장면과 비교 기준을 중심으로 풀어내는 것이 좋습니다.

[마무리 CTA]
${name}와 비슷한 제품도 함께 비교하고 싶다면 댓글로 남겨주세요. 다음 글에서는 같은 카테고리 안에서 어떤 기준으로 비교하면 좋은지 더 정리해보겠습니다.`
}

function buildProductContentIdeas(productName, keyword, topic, keywordInsight = null) {
  const primary = keyword || productName || '대표 상품'
  const subject = topic || '제품 리뷰'
  const demand = keywordInsight?.monthly ? `월 검색량 ${keywordInsight.monthly.toLocaleString('ko-KR')}회` : '실검색량 연결 전'
  const formats = [
    ['실사용 후기', '후기형 리뷰', '1순위'],
    ['비교 포인트', '비교형 콘텐츠', '1순위'],
    ['구매 전 체크리스트', '체크리스트', '1순위'],
    ['상황별 추천', '사용 시나리오형', '2순위'],
    ['가격 대비 구성', '가성비 분석', '2순위'],
    ['단점 정리', '신뢰형 리뷰', '2순위'],
    ['초보자 가이드', '입문형 글', '3순위'],
    ['자주 묻는 질문', 'FAQ형 글', '3순위'],
    ['비슷한 제품 비교', '경쟁 비교형', '3순위'],
    ['선물/추천 상황', '추천형 글', '4순위'],
  ]

  return formats.map(([angle, format, priority], index) => ({
    id: `product-idea-${index + 1}`,
    no: index + 1,
    title: `${primary} ${angle}`,
    keyword: index < 4 ? primary : `${primary} ${angle}`,
    intent: '구매 전 비교',
    format,
    priority,
    reason: `${subject} 독자가 ${primary}를 검색했을 때 가장 궁금해할 정보에 맞춘 주제입니다.`,
    dataReason: demand,
    outline: [
      `${angle}이 중요한 이유`,
      '실사용 기준에서 봐야 할 판단 포인트',
      '경쟁 제품과 달라지는 부분',
      '구매 행동으로 이어지는 마무리 문장',
    ],
  }))
}

async function fetchBlogPlannerInsights(links) {
  const response = await fetch('/api/blog/planner-insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ links }),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || '경쟁 블로그 분석에 실패했습니다.')
  }

  return data
}

async function fetchProductInsights(url) {
  const response = await fetch('/api/product/insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || '제품 링크 분석에 실패했습니다.')
  }

  return data
}

async function fetchYoutubeInsights(url) {
  const response = await fetch('/api/youtube/insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || '유튜브 영상 분석에 실패했습니다.')
  }

  return data
}

async function fetchBlogWriterArticle(payload) {
  const response = await fetch('/api/blog/write', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'AI 글 생성에 실패했습니다.')
  }

  return data
}

async function fetchAiApiStatus() {
  const response = await fetch('/api/ai/status')
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'AI API 상태 확인에 실패했습니다.')
  }

  return data
}

function summarizeYoutubeInput(video, memo) {
  const title = video?.title || '유튜브 영상'
  const description = video?.description || ''
  const tags = video?.tags?.length ? video.tags.join(', ') : ''
  const extra = memo.trim()
  return [title, description, tags, extra].filter(Boolean).join('\n')
}

function buildContentAutomationPack(video, options) {
  const title = video?.title || '유튜브 영상'
  const author = video?.author || '크리에이터'
  const keyword = options.keyword.trim() || video?.keyword || title.split(' ').slice(0, 3).join(' ')
  const audience = options.audience.trim() || '관심 고객'
  const goal = options.goal.trim() || '저장과 문의'
  const memo = options.memo.trim()
  const sourceSummary = summarizeYoutubeInput(video, memo)
  const cleanTitle = title.replace(/\s+/g, ' ').trim()
  const hook = `${keyword}를 찾는 사람이 영상에서 바로 얻어가야 할 핵심은 "왜 지금 봐야 하는가"입니다.`
  const basePoints = [
    `${cleanTitle}에서 가장 먼저 꺼낼 메시지는 ${keyword}의 문제 해결 포인트입니다.`,
    `${audience}에게는 정보 나열보다 적용 장면, 전후 비교, 실수 방지가 더 잘 먹힙니다.`,
    `${goal}로 이어지게 하려면 마지막 문단과 영상 말미에 같은 CTA를 반복해야 합니다.`,
    memo || '영상에서 반복되는 표현을 제목, 소제목, 캡션에 나눠 재사용하세요.',
  ]

  return {
    sourceSummary,
    naverBlog: `[제목 후보]
1. ${keyword} 영상 핵심만 정리하면 이렇게 적용하면 됩니다
2. ${cleanTitle} 보고 바로 써먹을 수 있는 포인트
3. ${keyword} 처음이라면 영상보다 먼저 확인할 체크리스트

[대표 제목]
${keyword} 영상 핵심만 정리하면 이렇게 적용하면 됩니다

[본문]
${cleanTitle} 영상을 본 뒤 바로 행동으로 옮기려면 단순 요약보다 "내 상황에 어떻게 적용할지"가 먼저 정리되어야 합니다. 이번 글에서는 ${author}의 영상 내용을 바탕으로 ${audience}가 바로 활용할 수 있는 기준을 네이버 블로그 흐름에 맞춰 풀어봤습니다.

## ${keyword}, 왜 지금 봐야 할까요

${hook} 영상은 빠르게 지나가지만 블로그 글에서는 독자가 저장하고 다시 볼 수 있도록 핵심 판단 기준을 문단별로 나눠야 합니다. 특히 네이버 블로그에서는 첫 문단에 키워드와 결론을 자연스럽게 넣고, 중간에는 실제 적용 장면을 충분히 보여주는 편이 좋습니다.

## 영상에서 뽑아야 할 핵심 메시지

${basePoints.map((item, index) => `${index + 1}. ${item}`).join('\n')}

## 내 콘텐츠에 적용하는 방법

첫째, 영상의 훅을 그대로 옮기지 말고 검색자가 궁금해하는 질문형 제목으로 바꿉니다. 둘째, 본문 중간에는 사례, 체크리스트, 비교표를 넣어 체류 시간을 늘립니다. 셋째, 이미지나 캡처가 들어갈 위치를 미리 정해 글의 흐름을 끊지 않게 만듭니다.

[이미지 배치 추천]
1. 첫 문단 아래: 영상 주제를 보여주는 대표 이미지
2. 핵심 메시지 섹션 아래: 요약 카드 이미지
3. 적용 방법 섹션 아래: 체크리스트 이미지
4. 마지막 문단 위: 행동 유도용 이미지

## 마무리

${keyword} 콘텐츠는 영상 하나로 끝내기보다 블로그, 짧은 글, 숏폼으로 나눠 반복 노출시키는 편이 좋습니다. 영상에서 나온 메시지를 내 언어로 다시 정리하고, ${goal}로 이어지는 문장을 마지막에 넣어주세요.

[CTA]
이 영상 내용을 내 업종에 맞춰 바꾸고 싶다면 댓글이나 문의로 남겨주세요.`,
    wordpress: `# ${keyword}: ${cleanTitle}에서 뽑은 실행 가이드

Meta title: ${keyword} 실행 가이드 | 영상 핵심 요약과 적용 방법
Meta description: ${cleanTitle} 영상의 핵심 메시지를 워드프레스 SEO 글 구조로 정리했습니다. ${audience}가 바로 적용할 체크리스트와 CTA를 확인하세요.
Slug: ${keyword.replace(/\s+/g, '-').toLowerCase()}

## Introduction
${cleanTitle} is useful because it gives the audience a concrete starting point. This WordPress version turns the video into a searchable, structured article for readers who want clarity, examples, and next steps.

## Key Takeaways
${basePoints.map((item) => `- ${item}`).join('\n')}

## Step-by-Step Application
1. Start with the viewer's problem and place ${keyword} in the first paragraph.
2. Convert the strongest video quote into an H2 section.
3. Add a checklist, comparison table, or FAQ block for search intent coverage.
4. End with a focused CTA connected to ${goal}.

## FAQ
### Who is this for?
This content is best for ${audience}.

### How should I reuse the video?
Use the video as the source, then make one long-form article, one short thread, and one reels script.

## CTA
Need a version tailored to your product or service? Use this article as the base and adapt the examples to your own audience.`,
    threads: [
      `${keyword} 영상 하나를 콘텐츠 4개로 바꾸는 방법.`,
      `1. 블로그는 검색자가 저장할 수 있게 체크리스트 중심으로.`,
      `2. 워드프레스는 SEO 제목, 메타 설명, FAQ까지 넣어서 검색 자산으로.`,
      `3. 스레드는 한 문장 하나의 메시지로 짧게 쪼개기.`,
      `4. 릴스는 첫 3초 훅, 장면 전환, 댓글 유도까지 미리 설계하기.`,
      `핵심은 영상을 요약하는 게 아니라 플랫폼마다 소비 방식에 맞게 다시 쓰는 것.`,
      `${goal}가 목표라면 마지막 문장은 꼭 행동으로 끝내세요.`,
    ],
    reels: [
      { scene: '0-3초', visual: '영상 제목 또는 핵심 장면을 빠르게 보여주기', caption: `${keyword}, 이 부분만 알면 됩니다`, note: '첫 문장은 문제 제기형으로 짧게' },
      { scene: '3-8초', visual: '핵심 포인트 1을 큰 자막으로 표시', caption: basePoints[0], note: '텍스트는 한 줄 14자 안팎' },
      { scene: '8-15초', visual: '전후 비교 또는 체크리스트 장면', caption: basePoints[1], note: '저장할 이유를 만드는 구간' },
      { scene: '15-23초', visual: '적용 사례나 결과 화면', caption: basePoints[2], note: '구체적인 행동을 보여주기' },
      { scene: '23-30초', visual: '댓글/저장 유도 화면', caption: `${goal}가 필요하면 저장해두세요`, note: 'CTA를 하나만 남기기' },
    ],
    checklist: [
      '네이버 블로그: 제목 앞쪽 키워드, 첫 문단 결론, 이미지 배치 문구 포함',
      '워드프레스: H2/H3, 메타 설명, FAQ, 내부 링크 후보 포함',
      '스레드: 한 문장 한 메시지, 6-8개 포스트, 마지막 CTA',
      '릴스: 3초 훅, 5장면 이하, 자막 중심, 댓글 유도',
    ],
  }
}

const snsPublishPlatforms = [
  { id: 'naver', label: '네이버 블로그', type: '블로그', accent: 'green' },
  { id: 'wordpress', label: '워드프레스', type: '블로그', accent: 'blue' },
  { id: 'threads', label: '스레드', type: 'SNS', accent: 'slate' },
  { id: 'instagram', label: '인스타그램 릴스', type: '숏폼', accent: 'rose' },
  { id: 'youtube', label: '유튜브 쇼츠', type: '숏폼', accent: 'amber' },
]

function getResultPayload(pack, platformId) {
  if (!pack) return ''
  if (platformId === 'naver') return pack.naverBlog
  if (platformId === 'wordpress') return pack.wordpress
  if (platformId === 'threads') return pack.threads.join('\n')
  if (platformId === 'instagram' || platformId === 'youtube') {
    return pack.reels.map((item) => `${item.scene} | ${item.visual} | ${item.caption} | ${item.note}`).join('\n')
  }
  return ''
}

function buildAutomationScheduleCalendar(scheduleItems) {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  return Array.from({ length: 28 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const iso = date.toISOString().slice(0, 10)
    const monthLabel = String(date.getMonth() + 1).padStart(2, '0')
    const dayLabel = String(date.getDate()).padStart(2, '0')

    return {
      id: iso,
      label: `${monthLabel}.${dayLabel}`,
      day: weekdays[date.getDay()],
      week: `${Math.floor(index / 7) + 1}주차`,
      isToday: index === 0,
      items: scheduleItems.filter((item) => item.date === iso),
    }
  })
}

function buildSellerKeywordSnapshot(keyword, insight) {
  const primary = keyword.trim() || '대표 키워드'
  const monthly = insight?.monthly ?? 0
  const productCount = Math.max(120, Math.round((insight?.webDocs ?? 1800) * 0.18 + (insight?.blogDocs ?? 0) * 0.04))
  const competitionRate = monthly ? Number((productCount / monthly).toFixed(2)) : Number(((insight?.competition ?? 40) / 20).toFixed(2))
  const shoppingConversion = Math.max(8, Math.min(96, Math.round((insight?.chance ?? 32) * 0.78 + (monthly > 10000 ? 12 : 0))))
  const adCost = Math.max(180, Math.round(120 + (insight?.competition ?? 35) * 11))
  const avgPrice = Math.max(7900, Math.round(9900 + (insight?.competition ?? 40) * 820 + primary.length * 900))
  const opportunityScore = Math.max(15, Math.min(95, Math.round((shoppingConversion * 0.45) + ((100 - (insight?.competition ?? 40)) * 0.35) + (monthly > 0 ? Math.min(20, Math.log10(monthly + 1) * 5) : 8))))

  const topProducts = Array.from({ length: 12 }, (_, index) => ({
    rank: index + 1,
    name: `${primary} ${['프리미엄', '베이직', '대용량', '초경량', '실속형', '리필형'][index % 6]} ${index + 1}`,
    price: avgPrice + index * 1700,
    reviews: 120 + (12 - index) * 48,
    store: ['스마트스토어', '네이버플러스', '브랜드관'][index % 3],
    strength: ['상품명 키워드 배치', '대표 이미지 선명도', '리뷰 축적 속도', '구성 대비 가격'][index % 4],
  }))

  const relatedKeywords = (insight?.related?.length ? insight.related : [
    `${primary} 추천`,
    `${primary} 가성비`,
    `${primary} 선물`,
    `${primary} 후기`,
    `${primary} 대용량`,
    `${primary} 휴대용`,
  ]).map((item, index) => ({
    keyword: item,
    monthly: Math.max(300, Math.round((monthly || 4000) * (0.82 - index * 0.08))),
    competitionRate: Number((competitionRate * (0.78 + index * 0.05)).toFixed(2)),
    shoppingConversion: Math.max(10, shoppingConversion - index * 3),
    adCost: Math.max(90, adCost - index * 18),
  }))

  const sourcingIdeas = [
    `${primary}에서 가장 자주 반복되는 속성은 "${['가성비', '대용량', '휴대성', '저소음'][primary.length % 4]}"입니다. 이 속성 중심 상품을 우선 비교하세요.`,
    `${primary}는 검색량 대비 상품 수가 ${competitionRate}배 수준이라, 롱테일 조합으로 내려가면 진입 가능성이 좋아집니다.`,
    `${primary} 상위 상품은 평균가 ${avgPrice.toLocaleString('ko-KR')}원대라 구성 차별화나 묶음 상품 전략이 잘 먹힐 수 있습니다.`,
  ]

  return {
    keyword: primary,
    monthly,
    productCount,
    competitionRate,
    shoppingConversion,
    adCost,
    avgPrice,
    opportunityScore,
    topProducts,
    relatedKeywords,
    sourcingIdeas,
  }
}

function buildSellerFinderResults(seedKeyword, category, filters = {}) {
  const primary = seedKeyword.trim() || '대표 상품'
  const categoryLabel = category || '생활/건강'
  const prefixes = ['프리미엄', '가성비', '휴대용', '대용량', '미니', '저자극', '무선', '접이식', '브랜드리스', '실속형', '선물용', '사무실']
  const suffixes = ['추천', '비교', '세트', '리필', '케이스', '정리', '수납', '저소음', '대형', '소형', '업소용', '캠핑용']
  const baseMonthly = 4200 + primary.length * 350

  const results = Array.from({ length: 28 }, (_, index) => {
    const keyword = `${prefixes[index % prefixes.length]} ${primary} ${suffixes[index % suffixes.length]}`.replace(/\s+/g, ' ').trim()
    const monthly = Math.max(800, baseMonthly + index * 730)
    const productCount = 1200 + index * 180
    const competitionRate = Number((productCount / monthly).toFixed(2))
    const conversion = Math.max(12, Math.min(92, 72 - competitionRate * 9 + (index % 5) * 4))
    const adCost = Math.max(110, Math.round(140 + competitionRate * 65 + index * 9))
    const avgPrice = Math.max(5900, Math.round(8900 + index * 1300 + primary.length * 800))
    const golden = monthly >= 5000 && monthly <= 50000 && competitionRate <= 0.9 && conversion >= 48

    return {
      keyword,
      category: categoryLabel,
      monthly,
      productCount,
      competitionRate,
      conversion,
      adCost,
      avgPrice,
      golden,
    }
  })

  return results.filter((item) => {
    if (filters.minMonthly && item.monthly < filters.minMonthly) return false
    if (filters.maxMonthly && item.monthly > filters.maxMonthly) return false
    if (filters.maxCompetition && item.competitionRate > filters.maxCompetition) return false
    if (filters.minConversion && item.conversion < filters.minConversion) return false
    if (filters.goldenOnly && !item.golden) return false
    return true
  })
}

function buildSellerProductDiagnosis(productInsight) {
  const keywordInsight = productInsight?.keywordInsight ?? null
  const productName = productInsight?.productName || '대표 상품'
  const keyword = productInsight?.keyword || productName
  const registrationScore = Math.max(38, Math.min(98, 54 + Math.round((productName.length + (productInsight?.description?.length ?? 0) / 60) * 1.4)))
  const salesScore = Math.max(32, Math.min(96, 46 + Math.round((keywordInsight?.chance ?? 34) * 0.48 + (keywordInsight?.monthly ? 10 : 0))))
  const keywordScore = Math.max(28, Math.min(97, 42 + Math.round((100 - (keywordInsight?.competition ?? 48)) * 0.52 + ((keywordInsight?.related?.length ?? 0) * 2.4))))
  const totalScore = Math.round(registrationScore * 0.34 + salesScore * 0.31 + keywordScore * 0.35)

  return {
    productName,
    keyword,
    totalScore,
    metrics: [
      { label: '상품 등록', value: registrationScore, note: '상품명 길이, 설명량, 기본 정보 노출 기준' },
      { label: '판매 관리', value: salesScore, note: '검색 수요와 공략 가능성, 운영 후 관리 여지 기준' },
      { label: '키워드 점수', value: keywordScore, note: '경쟁강도와 연관키워드 확장성 기준' },
    ],
    actions: [
      `${keyword}를 상품명 앞부분에 두고 핵심 속성 2개만 남겨 제목 길이를 압축하세요.`,
      '대표 이미지 첫 장은 배경을 단순화하고, 옵션/구성 차이는 2~3장 안에 분리하세요.',
      '상세페이지 상단 3스크롤 안에 구매 포인트, 비교 포인트, 사용 장면을 모두 넣어 전환 저항을 줄이세요.',
      '리뷰가 쌓이기 전까지는 묶음 구성, 사은품, 빠른 배송 문구처럼 클릭률을 올릴 장치를 함께 운영하세요.',
    ],
  }
}

function buildSellerProductRank(keyword, insight) {
  const primary = keyword.trim() || '대표 상품'
  const basePrice = Math.max(10900, Math.round(11900 + (insight?.competition ?? 40) * 750))
  return Array.from({ length: 10 }, (_, index) => ({
    rank: index + 1,
    product: `${primary} ${['프리미엄', '대용량', '실속형', '정품', '인기', '추천'][index % 6]} ${index + 1}`,
    price: basePrice + index * 1900,
    reviews: 80 + (10 - index) * 66,
    rating: (4.9 - index * 0.03).toFixed(1),
    change: index % 3 === 0 ? `+${index + 1}` : index % 3 === 1 ? '유지' : `-${Math.max(1, index - 1)}`,
    strength: ['상품명', '대표 이미지', '리뷰 속도', '구성', '가격'][index % 5],
  }))
}

function buildSellerAiPack({ productName, keyword, category, target, usp, description, keywordInsight }) {
  const name = productName.trim() || keyword.trim() || '대표 상품'
  const mainKeyword = keyword.trim() || productName.trim() || '대표 키워드'
  const categoryLabel = category.trim() || '생활/건강'
  const targetLabel = target.trim() || '구매 전 비교 중인 고객'
  const uspLabel = usp.trim() || '사용 장면이 선명한 장점'
  const detailDescription = description.trim() || `${mainKeyword}를 찾는 고객이 구매 전 가장 먼저 확인하는 포인트를 정리해야 합니다.`
  const monthlyText = keywordInsight?.monthly ? `${keywordInsight.monthly.toLocaleString('ko-KR')}회` : '추정 검색량 기준'

  return {
    productTitles: [
      `${mainKeyword} ${uspLabel} ${categoryLabel}`.replace(/\s+/g, ' ').trim(),
      `${targetLabel}용 ${mainKeyword} ${['프리미엄', '실속형', '대용량'][mainKeyword.length % 3]}`,
      `${mainKeyword} ${['가성비', '휴대용', '저자극', '고급형'][name.length % 4]} ${categoryLabel}`,
    ],
    detailOutline: [
      '첫 화면: 대표 문제 제기와 3초 요약',
      '핵심 장점 3가지: 사용 장면 중심 정리',
      '비교 포인트: 다른 상품과 갈리는 기준',
      '옵션/구성 안내: 어떤 조합이 누구에게 맞는지',
      '리뷰/신뢰 구간: 자주 언급되는 만족 포인트',
      '구매 전 FAQ와 배송/교환 안내',
    ],
    adCopies: [
      `${mainKeyword}, ${targetLabel}가 바로 이해하는 핵심 포인트만 담았습니다.`,
      `${monthlyText} 수요 키워드 ${mainKeyword}, 지금 클릭률 높일 문구는 기능보다 사용 장면입니다.`,
      `${mainKeyword} 고민 중이라면 ${uspLabel}부터 비교해보세요.`,
    ],
    sellingPoints: [
      `${categoryLabel} 카테고리 안에서 ${mainKeyword}는 검색 의도가 비교적 선명합니다.`,
      `${targetLabel}에게는 기능 설명보다 "왜 이 상황에서 편한지"가 더 큰 설득 포인트입니다.`,
      `${uspLabel}를 상세페이지 상단과 대표 이미지 캡션에 반복해 기억에 남게 해야 합니다.`,
      detailDescription,
    ],
  }
}

function makeGeneratedImageDataUrl(title, keyword, palette) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${palette[0]}"/>
          <stop offset="100%" stop-color="${palette[1]}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="675" rx="34" fill="url(#bg)"/>
      <rect x="58" y="58" width="1084" height="559" rx="28" fill="rgba(255,255,255,0.86)"/>
      <circle cx="998" cy="160" r="74" fill="${palette[2]}" opacity="0.26"/>
      <circle cx="206" cy="500" r="92" fill="${palette[2]}" opacity="0.18"/>
      <text x="92" y="150" font-family="Pretendard, Arial, sans-serif" font-size="30" font-weight="700" fill="#0f766e">${keyword}</text>
      <text x="92" y="238" font-family="Pretendard, Arial, sans-serif" font-size="58" font-weight="800" fill="#102033">${title}</text>
      <text x="92" y="330" font-family="Pretendard, Arial, sans-serif" font-size="28" fill="#40516a">네이버 블로그용 AI 이미지 콘셉트</text>
      <rect x="92" y="426" width="430" height="78" rx="18" fill="#0f766e"/>
      <text x="125" y="477" font-family="Pretendard, Arial, sans-serif" font-size="30" font-weight="800" fill="#ffffff">본문 흐름에 맞춰 배치</text>
    </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function buildImagePlan(keyword) {
  const primary = keyword.trim() || '대표 키워드'
  return [
    {
      title: '대표 이미지',
      placement: '첫 문단 바로 아래',
      prompt: `${primary}의 전체 분위기와 첫인상을 보여주는 밝고 신뢰감 있는 대표 이미지`,
      palette: ['#dff7f2', '#e8edff', '#0f766e'],
    },
    {
      title: '핵심 장점 이미지',
      placement: '경쟁 글 분석 섹션 뒤',
      prompt: `${primary}의 장점을 구체적으로 보여주는 현장감 있는 디테일 이미지`,
      palette: ['#fff7df', '#e8fbf7', '#f59e0b'],
    },
    {
      title: '가격/구성 이미지',
      placement: '가격과 구성 섹션 아래',
      prompt: `${primary}의 메뉴, 가격, 구성 정보를 보기 쉽게 정리한 블로그용 이미지`,
      palette: ['#eff6ff', '#f7f1ff', '#2563eb'],
    },
    {
      title: '예약/동선 이미지',
      placement: '예약과 방문 타이밍 섹션 뒤',
      prompt: `${primary} 방문 전 확인할 위치, 예약, 동선 정보를 설명하는 안내형 이미지`,
      palette: ['#ecfeff', '#f0fdf4', '#0891b2'],
    },
  ]
}

async function transformBlogImage(file, keyword) {
  const { image, url } = await readImage(file)
  const variants = [
    { name: 'warm-cover', filter: 'brightness(1.06) contrast(1.08) saturate(1.18)', label: '대표 이미지용 따뜻한 보정' },
    { name: 'clean-info', filter: 'brightness(1.12) contrast(1.02) saturate(0.96)', label: '정보 전달용 밝은 보정' },
    { name: 'soft-review', filter: 'brightness(1.04) contrast(0.96) saturate(1.08) sepia(0.08)', label: '후기형 부드러운 보정' },
  ]

  const results = []
  for (const variant of variants) {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 675
    const context = canvas.getContext('2d')
    const scale = Math.max(canvas.width / image.width, canvas.height / image.height)
    const width = image.width * scale
    const height = image.height * scale
    context.filter = variant.filter
    context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
    context.filter = 'none'
    context.fillStyle = 'rgba(15, 33, 61, 0.58)'
    context.fillRect(0, 535, canvas.width, 140)
    context.fillStyle = '#ffffff'
    context.font = '700 34px Pretendard, Arial, sans-serif'
    context.fillText(keyword, 48, 590)
    context.font = '500 22px Pretendard, Arial, sans-serif'
    context.fillText(variant.label, 48, 628)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88))
    results.push({
      label: variant.label,
      name: `${file.name.replace(/\.[^.]+$/, '')}-${variant.name}.jpg`,
      url: URL.createObjectURL(blob),
      size: blob.size,
    })
  }
  URL.revokeObjectURL(url)
  return results
}

function BlogWriterWorkspace({ showToast }) {
  const [postType, setPostType] = useState('맛집 후기')
  const [postTitle, setPostTitle] = useState('')
  const [keyword, setKeyword] = useState('강남 맛집 후기')
  const [length, setLength] = useState(1500)
  const [style, setStyle] = useState('auto')
  const [emphasis, setEmphasis] = useState('')
  const [attachedImages, setAttachedImages] = useState([])
  const [generatedPost, setGeneratedPost] = useState('')
  const [keywordInsight, setKeywordInsight] = useState(() => buildNaverKeywordAnalysis('강남 맛집 후기'))
  const [aiApiStatus, setAiApiStatus] = useState({ openai: false, model: 'gpt-4.1-mini' })
  const [isGenerating, setIsGenerating] = useState(false)

  const trendTopics = buildWriterTrendTopics(postType)
  const hashtags = useMemo(() => {
    const related = keywordInsight.related?.slice(0, 4) ?? []
    return [`#${keyword.replace(/\s+/g, '')}`, ...related.map((item) => `#${item.replace(/\s+/g, '')}`)]
  }, [keyword, keywordInsight.related])

  const fillTitle = () => {
    setPostTitle(`${keyword} ${postType}`)
    showToast('제목을 자동 입력했습니다.')
  }

  const analyzeKeyword = async (nextKeyword = keyword, options = {}) => {
    try {
      const result = await fetchNaverKeywordAnalysis(nextKeyword)
      setKeywordInsight(result)
      if (!options.silent) {
        showToast('키워드 인사이트를 불러왔습니다.')
      }
      return result
    } catch {
      const fallback = buildNaverKeywordAnalysis(nextKeyword)
      setKeywordInsight(fallback)
      if (!options.silent) {
        showToast('API 연결이 없어 추정 인사이트를 표시합니다.')
      }
      return fallback
    }
  }

  const generatePost = async () => {
    if (!keyword.trim()) {
      showToast('메인 키워드를 입력해 주세요.')
      return
    }

    setIsGenerating(true)
    try {
      const insight = await analyzeKeyword(keyword, { silent: true })
      const fallbackArticle = buildBlogWriterArticle({
        type: postType,
        title: postTitle,
        keyword,
        style,
        emphasis,
        length,
        insight,
      })

      try {
        const result = await fetchBlogWriterArticle({
          type: postType,
          title: postTitle,
          keyword,
          style,
          emphasis,
          length,
          imageCount: attachedImages.length,
          keywordInsight: insight,
          hashtags,
        })
        setGeneratedPost(result.article)
        showToast('AI API로 블로그 글을 생성했습니다.')
      } catch (error) {
        setGeneratedPost(fallbackArticle)
        showToast(error.message.includes('OPENAI_API_KEY') ? 'API 키가 없어 기본 생성으로 작성했습니다.' : 'AI API 응답 실패로 기본 생성했습니다.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      analyzeKeyword(keyword, { silent: true })
    }, 0)
    fetchAiApiStatus()
      .then(setAiApiStatus)
      .catch(() => setAiApiStatus({ openai: false, model: 'gpt-4.1-mini' }))
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="blog-planner">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">블로그 전용</span>
          <h1>블로그 글쓰기 2.1</h1>
          <p>글 타입, 제목, 키워드, 말투, 글자 수를 설정하고 실데이터 기반 상위노출 인사이트를 보며 글을 완성합니다.</p>
        </div>
        <button className="primary-action" type="button" onClick={generatePost} disabled={isGenerating}>
          {isGenerating ? <RefreshCw size={18} /> : <PenLine size={18} />}
          {isGenerating ? '글 생성 중' : '글 생성'}
        </button>
      </div>

      <section className="planner-grid">
        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">작성 설정</span>
              <h2>블로그 글쓰기 입력</h2>
            </div>
          </div>
          <div className="writer-settings-grid">
            <div className="field-grid">
              <label>
                <span>글 타입</span>
                <div className="input-shell">
                  <BookOpenCheck size={18} />
                  <select value={postType} onChange={(event) => setPostType(event.target.value)}>
                    <option>맛집 후기</option>
                    <option>카페 후기</option>
                    <option>제품 후기</option>
                    <option>여행 후기</option>
                    <option>병원 후기</option>
                  </select>
                </div>
              </label>
              <label>
                <span>글자 수</span>
                <div className="input-shell">
                  <TextCursorInput size={18} />
                  <select value={String(length)} onChange={(event) => setLength(Number(event.target.value))}>
                    <option value="500">500자</option>
                    <option value="1000">1000자</option>
                    <option value="1500">1500자</option>
                    <option value="2000">2000자</option>
                    <option value="3000">3000자</option>
                  </select>
                </div>
              </label>
            </div>
            <label>
              <span>글 제목</span>
              <div className="input-shell">
                <PenLine size={18} />
                <input value={postTitle} onChange={(event) => setPostTitle(event.target.value)} placeholder="제목을 입력하거나 자동입력을 눌러주세요" />
              </div>
            </label>
            <button className="ghost-button" type="button" onClick={fillTitle}>
              <Sparkles size={16} />
              자동입력
            </button>
            <label>
              <span>키워드</span>
              <div className="input-shell">
                <Search size={18} />
                <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="검색 노출 키워드를 입력해 주세요" />
              </div>
            </label>
            <div className="field-grid">
              <label>
                <span>글 스타일</span>
                <div className="input-shell">
                  <MessageCircleQuestion size={18} />
                  <select value={style} onChange={(event) => setStyle(event.target.value)}>
                    <option value="auto">자동 설정</option>
                    <option value="friendly">~해요</option>
                    <option value="formal">~합니다</option>
                    <option value="review">~한다</option>
                    <option value="reference">내 스타일 참고</option>
                  </select>
                </div>
              </label>
              <label>
                <span>이미지 첨부</span>
                <input
                  className="file-input"
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  onChange={(event) => setAttachedImages(Array.from(event.target.files ?? []).slice(0, 10))}
                />
              </label>
            </div>
            <label>
              <span>강조 내용</span>
              <textarea value={emphasis} onChange={(event) => setEmphasis(event.target.value)} placeholder="꼭 강조하고 싶은 포인트를 입력해 주세요" />
            </label>
            {attachedImages.length > 0 && <p className="planner-hint">{attachedImages.length}장의 이미지를 첨부했습니다.</p>}
          </div>
        </div>

        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">상위노출 인사이트</span>
              <h2>키워드 분석 결과</h2>
            </div>
            <button className="ghost-button" type="button" onClick={() => analyzeKeyword()}>
              <BarChart3 size={16} />
              새로고침
            </button>
          </div>
          <div className="api-status-strip">
            <span className={aiApiStatus.openai ? 'connected' : ''}>AI 글쓰기 API</span>
            <span className={keywordInsight.source?.openApi ? 'connected' : ''}>검색 Open API</span>
            <span className={keywordInsight.source?.datalab ? 'connected' : ''}>데이터랩</span>
            <span className={keywordInsight.source?.searchAd ? 'connected' : ''}>검색광고 월검색량</span>
            <em>{aiApiStatus.openai ? aiApiStatus.model : 'AI 미연동'}</em>
            {keywordInsight.source?.fallback && <em>추정 모드</em>}
          </div>
          <div className="keyword-metrics planner-live-metrics">
            <article>
              <span>본문 글자 수</span>
              <strong>{length}</strong>
              <em>{postType} 기준</em>
            </article>
            <article>
              <span>키워드 반복 권장</span>
              <strong>{Math.max(3, Math.min(7, Math.round((keywordInsight.competition ?? 40) / 16)))}</strong>
              <em>{keywordInsight.difficulty} 난이도</em>
            </article>
            <article>
              <span>예상 일 방문자</span>
              <strong>{Math.max(120, Math.round((keywordInsight.monthly ?? 1200) / 12)).toLocaleString()}</strong>
              <em>키워드 수요 기반</em>
            </article>
            <article>
              <span>추천 해시태그</span>
              <strong>{hashtags.length}</strong>
              <em>자동 추천</em>
            </article>
          </div>
          <div className="recommend-list">
            {(keywordInsight.contentPlan ?? []).slice(0, 4).map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="planner-grid">
        <div className="planner-panel wide">
          <div className="section-header">
            <div>
              <span className="eyebrow">실시간 주제</span>
              <h2>{postType}에 잘 맞는 인기 주제</h2>
            </div>
          </div>
          <div className="content-idea-grid trend-topic-grid">
            {trendTopics.map((topic) => (
              <article key={topic}>
                <h3>{topic}</h3>
                <p>실시간 상위 노출 콘텐츠와 인기 게시글을 참고해 응용할 수 있는 주제입니다.</p>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => {
                    setPostTitle(topic)
                    setKeyword(topic.split(' ').slice(0, 2).join(' '))
                    showToast('실시간 주제를 제목과 키워드에 반영했습니다.')
                  }}
                >
                  <Sparkles size={16} />
                  적용
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="planner-panel wide">
          <div className="section-header">
            <div>
              <span className="eyebrow">추천 해시태그</span>
              <h2>바로 복사해서 붙일 수 있는 태그</h2>
            </div>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(hashtags.join(' '))
                showToast('해시태그를 복사했습니다.')
              }}
            >
              <ClipboardCheck size={16} />
              복사
            </button>
          </div>
          <div className="combo-list">
            {hashtags.map((item) => (
              <button key={item} type="button">
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="planner-panel wide">
        <div className="section-header">
          <div>
            <span className="eyebrow">생성 결과</span>
            <h2>완성형 블로그 글</h2>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(generatedPost)
              showToast('생성된 글을 복사했습니다.')
            }}
          >
            <ClipboardCheck size={16} />
            복사
          </button>
        </div>
        {generatedPost ? (
          <textarea className="draft-editor" value={generatedPost} onChange={(event) => setGeneratedPost(event.target.value)} />
        ) : (
          <div className="draft-empty">
            <PenLine size={26} />
            <strong>설정을 입력한 뒤 글 생성을 누르면 블로그 글쓰기 2.1 형식의 글이 만들어집니다.</strong>
          </div>
        )}
      </section>
    </section>
  )
}

function BlogPlannerWorkspace({ showToast }) {
  const [linksText, setLinksText] = useState(
    'https://blog.naver.com/example/223000000001\nhttps://blog.naver.com/example/223000000002\nhttps://blog.naver.com/example/223000000003',
  )
  const [targetKeyword, setTargetKeyword] = useState('')
  const [blogTopic, setBlogTopic] = useState('')
  const [planner, setPlanner] = useState(null)
  const [draft, setDraft] = useState('')
  const [isWriting, setIsWriting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [generatedImages, setGeneratedImages] = useState([])
  const [transformedImages, setTransformedImages] = useState([])
  const [uploadedImageName, setUploadedImageName] = useState('')

  const links = useMemo(() => linksText.split(/\n|,/).map((item) => item.trim()).filter(Boolean), [linksText])

  const analyzeBlogs = async (options = {}) => {
    if (links.length === 0) {
      if (!options.silent) {
        showToast('경쟁 블로그 링크를 먼저 입력해 주세요.')
      }
      return null
    }

    setIsAnalyzing(true)
    try {
      const insight = await fetchBlogPlannerInsights(links)
      const nextKeyword = targetKeyword.trim() || insight.keyword
      const nextTopic = blogTopic.trim() || insight.topic
      const contentIdeas = buildBlogContentIdeas(nextKeyword, nextTopic, links, insight.keywordInsight)
      const nextPlanner = {
        linkCount: links.length,
        score: Math.min(96, 72 + links.length * 4),
        titlePattern: insight.titlePatterns?.length ? insight.titlePatterns : [`${nextKeyword} 후기`, `${nextKeyword} 추천`, `${nextKeyword} 예약`],
        inferredKeyword: insight.keyword,
        inferredTopic: insight.topic,
        keywordInsight: insight.keywordInsight ?? null,
        blogIndex: insight.blogIndex ?? null,
        competitorIndexList: insight.competitorIndexList ?? [],
        gradeScale: insight.gradeScale ?? [],
        competitorSummaries: insight.competitorSummaries ?? [],
        tokenInsights: insight.tokenInsights ?? [],
        recommendedStructure: ['검색 의도 결론', '방문/사용 기준', '비교 포인트', '사진 구성', '예약/문의 CTA'],
        contentIdeas,
        schedule: [
          { day: 'D-3', task: `${nextKeyword} 경쟁 글 구조 수집`, owner: '자료', status: '진행' },
          { day: 'D-2', task: `${nextTopic} 주제 클러스터 12개 설계`, owner: '기획', status: '대기' },
          { day: 'D-1', task: '사진 순서와 경험 근거 정리', owner: '소재', status: '대기' },
          { day: 'D-Day', task: '우선순위 1순위 주제 글 작성 및 발행', owner: '작성', status: '대기' },
          { day: 'D+1', task: '노출 확인 후 제목/본문 보정', owner: '개선', status: '대기' },
        ],
        actions: [
          `경쟁 링크를 기준으로 대표 키워드를 ${nextKeyword}로 추론했습니다.`,
          insight.keywordInsight?.monthly
            ? `네이버 실데이터 기준 월 검색량은 ${insight.keywordInsight.monthly.toLocaleString('ko-KR')}회, 블로그 문서량은 ${insight.keywordInsight.blogDocs.toLocaleString('ko-KR')}개입니다.`
            : '네이버 API 키가 연결되면 월 검색량과 실문서량까지 함께 반영됩니다.',
          insight.blogIndex
            ? `경쟁 블로그 묶음의 블연플 스타일 추정 등급은 ${insight.blogIndex.grade} (${insight.blogIndex.gradeRange})입니다.`
            : '경쟁 블로그 지수는 링크 패턴과 검색 신호를 종합해 계산합니다.',
          `${nextTopic} 방향으로 글 묶음을 만들고 한 주제에 경험 근거를 더 깊게 넣어주세요.`,
          '경쟁 글보다 구체적인 방문 장면과 선택 기준을 넣으세요.',
          '사진마다 메뉴명, 위치, 가격, 예약 힌트를 자연스럽게 연결하세요.',
        ],
      }

      setTargetKeyword(nextKeyword)
      setBlogTopic(nextTopic)
      setPlanner(nextPlanner)
      setDraft(buildFullBlogArticle(nextKeyword, nextTopic, nextPlanner))
      setGeneratedImages(buildImagePlan(nextKeyword).map((item) => ({ ...item, url: makeGeneratedImageDataUrl(item.title, nextKeyword, item.palette) })))
      if (!options.silent) {
        showToast(`링크 기반으로 키워드와 주제를 자동 추론하고 콘텐츠 주제 ${contentIdeas.length}개를 추천했습니다.`)
      }
      return nextPlanner
    } catch (error) {
      if (!options.silent) {
        showToast(error.message || '경쟁 블로그 링크 분석에 실패했습니다.')
      }
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }

  const startWriting = async (idea = null) => {
    const nextPlanner =
      planner ??
      (await analyzeBlogs({ silent: true })) ??
      {
        linkCount: links.length,
        contentIdeas: buildBlogContentIdeas(targetKeyword || '대표 키워드', blogTopic || '기본 주제', links),
      }
    setPlanner(nextPlanner)
    const baseKeyword = targetKeyword || nextPlanner.inferredKeyword || '대표 키워드'
    const baseTopic = blogTopic || nextPlanner.inferredTopic || '기본 주제'
    const articleKeyword = idea?.keyword ?? baseKeyword
    const articleTopic = idea ? `${baseTopic} - ${idea.title}` : baseTopic
    setDraft(buildFullBlogArticle(articleKeyword, articleTopic, nextPlanner))
    setIsWriting(true)
    showToast(idea ? `${idea.no}번 추천 주제로 완성형 글을 작성했습니다.` : '완성형 블로그 글을 작성했습니다.')
  }

  const generateImages = () => {
    setGeneratedImages(buildImagePlan(targetKeyword).map((item) => ({ ...item, url: makeGeneratedImageDataUrl(item.title, targetKeyword, item.palette) })))
    showToast('글 흐름에 맞는 AI 이미지 콘셉트를 생성했습니다.')
  }

  const handleBlogImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadedImageName(file.name)
    setTransformedImages(await transformBlogImage(file, targetKeyword))
    showToast('업로드한 사진을 블로그용 이미지로 변형했습니다.')
  }

  return (
    <section className="blog-planner">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">블로그 전용</span>
          <h1>AI 블로그 플래너</h1>
          <p>수집한 블로그 링크를 분석해 내 블로그에 적용할 전략, 발행 일정, 완성형 SEO 글을 한 번에 만듭니다.</p>
        </div>
        <button className="primary-action" type="button" onClick={startWriting}>
          <PenLine size={18} />
          글쓰기 시작
        </button>
      </div>

      <section className="planner-grid">
        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">수집 링크</span>
              <h2>경쟁 블로그 분석</h2>
            </div>
            <Sparkles size={22} />
          </div>
          <label>
            <span>블로그 링크, 줄바꿈으로 여러 개 입력</span>
            <textarea value={linksText} onChange={(event) => setLinksText(event.target.value)} />
          </label>
          <div className="field-grid">
            <label>
              <span>자동 추론 키워드</span>
              <div className="input-shell">
                <Search size={18} />
                <input value={targetKeyword} onChange={(event) => setTargetKeyword(event.target.value)} placeholder="링크 분석 후 자동 입력" />
              </div>
            </label>
            <label>
              <span>자동 추론 주제</span>
              <div className="input-shell">
                <BookOpenCheck size={18} />
                <input value={blogTopic} onChange={(event) => setBlogTopic(event.target.value)} placeholder="링크 분석 후 자동 입력" />
              </div>
            </label>
          </div>
          <p className="planner-hint">목표 키워드와 주제를 비워두면 경쟁 블로그 링크만으로 자동 추론합니다.</p>
          <button className="analyze-button" type="button" onClick={analyzeBlogs} disabled={isAnalyzing}>
            {isAnalyzing ? <RefreshCw size={18} /> : <Sparkles size={18} />}
            {isAnalyzing ? '링크 분석 중' : 'AI 분석 생성'}
          </button>
        </div>

        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">추천 전략</span>
              <h2>내 블로그 적용 가이드</h2>
            </div>
          </div>
          <div className="planner-score">
            <span>콘텐츠 준비도</span>
            <strong>{planner?.score ?? 0}</strong>
            <em>{links.length}개 링크 입력됨</em>
          </div>
          {planner?.inferredKeyword && (
            <div className="planner-inference">
              <strong>자동 추론 결과</strong>
              <span>대표 키워드: {planner.inferredKeyword}</span>
              <span>블로그 주제: {planner.inferredTopic}</span>
            </div>
          )}
          <div className="recommend-list">
            {(planner?.actions ?? ['경쟁 블로그 링크를 넣고 AI 분석 생성을 눌러주세요.']).map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {planner?.blogIndex && (
        <section className="planner-grid blog-index-grid">
          <section className="planner-panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">블로그 지수</span>
                <h2>경쟁 블로그 등급 요약</h2>
              </div>
              <Gauge size={22} />
            </div>
            <div className="planner-score blog-grade-score">
              <span>블연플 스타일 추정 등급</span>
              <strong>{planner.blogIndex.grade}</strong>
              <em>
                {planner.blogIndex.gradeRange} · {planner.blogIndex.score}/100
              </em>
            </div>
            <p className="campaign-summary">{planner.blogIndex.note}</p>
            <div className="keyword-metrics compact-metrics">
              {planner.blogIndex.metrics.map((metric) => (
                <article key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <em>{metric.note}</em>
                </article>
              ))}
            </div>
            <div className="recommend-list">
              {planner.blogIndex.actions.map((item) => (
                <article key={item}>
                  <ClipboardCheck size={17} />
                  <span>{item}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="planner-panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">등급 범위</span>
                <h2>15단계 지수 구간</h2>
              </div>
            </div>
            <div className="grade-scale-list">
              {(planner.gradeScale ?? []).map((item) => (
                <article key={item.label} className={item.label === planner.blogIndex.grade ? 'active' : ''}>
                  <strong>{item.label}</strong>
                  <span>{item.rangeLabel}</span>
                  <em>{item.band}</em>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        </section>
      )}

      {planner?.competitorIndexList?.length > 0 && (
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">경쟁 블로그별 지수</span>
              <h2>링크별 블로그 등급 비교</h2>
            </div>
          </div>
          <div className="content-idea-grid competitor-index-grid">
            {planner.competitorIndexList.map((item) => (
              <article key={`${item.provider}-${item.blogId}`}>
                <div className="idea-head">
                  <strong>{item.score}</strong>
                  <span>{item.grade}</span>
                </div>
                <h3>{item.displayName}</h3>
                <p>
                  {item.gradeRange} · {item.pageCount}개 링크 분석
                </p>
                <dl>
                  <div>
                    <dt>주제</dt>
                    <dd>{item.metrics[0].value}</dd>
                  </div>
                  <div>
                    <dt>밀도</dt>
                    <dd>{item.metrics[1].value}</dd>
                  </div>
                  <div>
                    <dt>존재감</dt>
                    <dd>{item.metrics[2].value}</dd>
                  </div>
                </dl>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {planner?.competitorSummaries?.length > 0 && (
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">경쟁 글 핵심 신호</span>
              <h2>링크에서 읽어낸 제목과 자주 나온 단어</h2>
            </div>
          </div>
          <div className="content-idea-grid competitor-grid">
            {planner.competitorSummaries.slice(0, 6).map((item) => (
              <article key={item.url}>
                <h3>{item.title}</h3>
                <p>{item.description || '설명은 없지만 제목 패턴을 기반으로 주제를 추론했습니다.'}</p>
              </article>
            ))}
          </div>
          <div className="token-badges">
            {(planner.tokenInsights ?? []).map((item) => (
              <span key={item.token}>{item.token} {item.count}</span>
            ))}
          </div>
        </section>
      )}

      {planner?.keywordInsight && (
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">네이버 실데이터</span>
              <h2>추론 키워드의 실제 검색 신호</h2>
            </div>
          </div>
          <div className="api-status-strip">
            <span className={planner.keywordInsight.source?.openApi ? 'connected' : ''}>검색 Open API</span>
            <span className={planner.keywordInsight.source?.datalab ? 'connected' : ''}>데이터랩</span>
            <span className={planner.keywordInsight.source?.searchAd ? 'connected' : ''}>검색광고 월검색량</span>
            {!planner.keywordInsight.source?.openApi && !planner.keywordInsight.source?.searchAd && <em>추정 모드</em>}
          </div>
          {planner.keywordInsight.warnings?.length > 0 && (
            <section className="api-warning">
              {planner.keywordInsight.warnings.map((warning) => (
                <span key={warning}>{warning}</span>
              ))}
            </section>
          )}
          <div className="keyword-metrics planner-live-metrics">
            <article>
              <span>{planner.keywordInsight.source?.searchAd ? '월 검색량' : '월 예상 검색량'}</span>
              <strong>{planner.keywordInsight.monthly ? planner.keywordInsight.monthly.toLocaleString() : '-'}</strong>
              <em>모바일 {planner.keywordInsight.mobile ? planner.keywordInsight.mobile.toLocaleString() : '-'} · PC {planner.keywordInsight.pc ? planner.keywordInsight.pc.toLocaleString() : '-'}</em>
            </article>
            <article>
              <span>블로그 문서량</span>
              <strong>{planner.keywordInsight.blogDocs.toLocaleString()}</strong>
              <em>카페/커뮤니티 {planner.keywordInsight.cafeDocs.toLocaleString()}</em>
            </article>
            <article>
              <span>상위노출 난이도</span>
              <strong>{planner.keywordInsight.difficulty}</strong>
              <em>경쟁도 {planner.keywordInsight.competition}/100</em>
            </article>
            <article>
              <span>공략 가능성</span>
              <strong>{planner.keywordInsight.chance}%</strong>
              <em>{planner.keywordInsight.trendDirection ? `트렌드 ${planner.keywordInsight.trendDirection}` : '실데이터 분석'}</em>
            </article>
          </div>
          {planner.keywordInsight.topBlogs?.length > 0 && (
            <div className="live-result-list">
              {planner.keywordInsight.topBlogs.map((item) => (
                <a key={item.link} href={item.link} target="_blank" rel="noreferrer">
                  <strong>{item.title}</strong>
                  <span>{item.bloggername} · {item.postdate}</span>
                  <p>{item.description}</p>
                </a>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="planner-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">콘텐츠 주제 추천</span>
            <h2>경쟁 블로그를 보고 내가 써야 할 글 10개 이상</h2>
          </div>
          <span className="idea-count">{planner?.contentIdeas?.length ?? 0}개 추천</span>
        </div>
        <div className="content-idea-grid">
          {(planner?.contentIdeas ?? buildBlogContentIdeas(targetKeyword, blogTopic, links).slice(0, 10)).map((idea) => (
            <article key={idea.id}>
              <div className="idea-head">
                <strong>{idea.no}</strong>
                <span>{idea.priority}</span>
              </div>
              <h3>{idea.title}</h3>
              <dl>
                <div>
                  <dt>검색 의도</dt>
                  <dd>{idea.intent}</dd>
                </div>
                <div>
                  <dt>글 형식</dt>
                  <dd>{idea.format}</dd>
                </div>
                <div>
                  <dt>타깃 키워드</dt>
                  <dd>{idea.keyword}</dd>
                </div>
              </dl>
              <p>{idea.reason}</p>
              <p>{idea.dataReason}</p>
              <ul>
                {idea.outline.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button className="ghost-button" type="button" onClick={() => startWriting(idea)}>
                <PenLine size={16} />
                이 주제로 글쓰기
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="planner-grid scheduler-grid">
        <div className="planner-panel wide">
          <div className="section-header">
            <div>
              <span className="eyebrow">프로젝트 스케줄러</span>
              <h2>한눈에 보는 발행 계획</h2>
            </div>
            <CalendarDays size={22} />
          </div>
          <div className="schedule-board">
            {(planner?.schedule ?? []).map((item) => (
              <article key={item.day}>
                <strong>{item.day}</strong>
                <span>{item.task}</span>
                <em>{item.owner}</em>
                <b>{item.status}</b>
              </article>
            ))}
            {!planner && <p>분석을 생성하면 발행 전후 일정이 자동으로 표시됩니다.</p>}
          </div>
        </div>

        <div className="planner-panel wide">
          <div className="section-header">
            <div>
              <span className="eyebrow">글쓰기 편집기</span>
              <h2>완성형 블로그 글</h2>
            </div>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(draft)
                showToast('완성형 블로그 글을 복사했습니다.')
              }}
            >
              <ClipboardCheck size={17} />
              복사
            </button>
          </div>
          {isWriting ? (
            <textarea className="draft-editor" value={draft} onChange={(event) => setDraft(event.target.value)} />
          ) : (
            <div className="draft-empty">
              <PenLine size={26} />
              <strong>글쓰기 시작을 누르면 네이버 블로그 SEO 구조에 맞춘 완성형 글이 작성됩니다.</strong>
            </div>
          )}
        </div>
      </section>

      <section className="planner-grid image-grid">
        <div className="planner-panel wide">
          <div className="section-header">
            <div>
              <span className="eyebrow">AI 이미지 생성</span>
              <h2>글 흐름별 이미지 배치 추천</h2>
            </div>
            <button className="ghost-button" type="button" onClick={generateImages}>
              <FileImage size={17} />
              이미지 생성
            </button>
          </div>
          <div className="image-plan-list">
            {(generatedImages.length ? generatedImages : buildImagePlan(targetKeyword)).map((image) => (
              <article key={image.title}>
                {image.url ? <img src={image.url} alt={image.title} /> : <div className="image-placeholder"><FileImage size={22} /></div>}
                <div>
                  <strong>{image.title}</strong>
                  <span>{image.placement}</span>
                  <p>{image.prompt}</p>
                  {image.url && <a href={image.url} download={`${image.title}-${targetKeyword}.svg`}>다운로드</a>}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="planner-panel wide">
          <div className="section-header">
            <div>
              <span className="eyebrow">사진 기반 변형</span>
              <h2>업로드 사진으로 블로그 이미지 만들기</h2>
            </div>
            <FileImage size={22} />
          </div>
          <label>
            <span>내 사진 업로드</span>
            <input className="file-input" type="file" accept="image/*" onChange={handleBlogImageUpload} />
          </label>
          {uploadedImageName && <p className="upload-note">{uploadedImageName} 기반으로 1200x675 블로그 이미지를 만들었습니다.</p>}
          <div className="result-list blog-image-results">
            {transformedImages.length === 0 ? (
              <p>사진을 업로드하면 대표 이미지용, 정보 전달용, 후기형 보정 이미지가 생성됩니다.</p>
            ) : (
              transformedImages.map((image) => (
                <article key={image.url}>
                  <img src={image.url} alt={image.label} />
                  <div>
                    <strong>{image.label}</strong>
                    <span>{(image.size / 1024).toFixed(1)}KB</span>
                  </div>
                  <a href={image.url} download={image.name}>다운로드</a>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </section>
  )
}

function ContentAutomationWorkspace({ showToast }) {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [keyword, setKeyword] = useState('')
  const [audience, setAudience] = useState('구매 전 비교 중인 잠재고객')
  const [goal, setGoal] = useState('저장, 댓글, 문의')
  const [memo, setMemo] = useState('')
  const [videoInsight, setVideoInsight] = useState(null)
  const [pack, setPack] = useState(null)
  const [activeResult, setActiveResult] = useState('naver')
  const [isLoading, setIsLoading] = useState(false)
  const [snsConnections, setSnsConnections] = useState(() =>
    readStorage('nboost:sns-connections', {
      naver: true,
      wordpress: false,
      threads: false,
      instagram: false,
      youtube: false,
    }),
  )
  const [scheduleItems, setScheduleItems] = useState(() => readStorage('nboost:automation-schedule', []))
  const [schedulePlatform, setSchedulePlatform] = useState('naver')
  const [scheduleDate, setScheduleDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [scheduleTime, setScheduleTime] = useState('09:30')

  const automationCalendar = useMemo(() => buildAutomationScheduleCalendar(scheduleItems), [scheduleItems])
  const connectedCount = useMemo(
    () => snsPublishPlatforms.filter((platform) => snsConnections[platform.id]).length,
    [snsConnections],
  )

  const generatePack = async () => {
    if (!youtubeUrl.trim()) {
      showToast('유튜브 영상 링크를 입력해 주세요.')
      return
    }

    setIsLoading(true)
    try {
      const insight = await fetchYoutubeInsights(youtubeUrl)
      const nextKeyword = keyword.trim() || insight.keyword || insight.title.split(' ').slice(0, 3).join(' ')
      const nextPack = buildContentAutomationPack(insight, { keyword: nextKeyword, audience, goal, memo })
      setKeyword(nextKeyword)
      setVideoInsight(insight)
      setPack(nextPack)
      showToast('유튜브 영상을 멀티 플랫폼 콘텐츠로 변환했습니다.')
    } catch (error) {
      showToast(error.message || '유튜브 영상 분석에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyResult = () => {
    if (!pack) {
      showToast('먼저 콘텐츠를 생성해 주세요.')
      return
    }

    const payload =
      activeResult === 'naver'
        ? pack.naverBlog
        : activeResult === 'wordpress'
          ? pack.wordpress
          : activeResult === 'threads'
            ? pack.threads.join('\n')
            : pack.reels.map((item) => `${item.scene} | ${item.visual} | ${item.caption} | ${item.note}`).join('\n')
    navigator.clipboard.writeText(payload)
    showToast('선택한 결과를 복사했습니다.')
  }

  const exportAll = () => {
    if (!pack) {
      showToast('먼저 콘텐츠를 생성해 주세요.')
      return
    }

    const rows = [
      ['플랫폼', '내용'],
      ['네이버 블로그', pack.naverBlog],
      ['워드프레스', pack.wordpress],
      ['스레드', pack.threads.join('\n')],
      ['릴스 기획', pack.reels.map((item) => `${item.scene} / ${item.caption} / ${item.note}`).join('\n')],
    ]
    downloadCsv(`youtube-content-automation-${new Date().toISOString().slice(0, 10)}.csv`, rows)
    showToast('전체 변환 결과를 CSV로 저장했습니다.')
  }

  const toggleSnsConnection = (platformId) => {
    const nextConnections = {
      ...snsConnections,
      [platformId]: !snsConnections[platformId],
    }
    setSnsConnections(nextConnections)
    writeStorage('nboost:sns-connections', nextConnections)
    showToast(nextConnections[platformId] ? 'SNS 연동을 활성화했습니다.' : 'SNS 연동을 해제했습니다.')
  }

  const publishNow = (platformId) => {
    if (!pack) {
      showToast('먼저 콘텐츠를 생성해 주세요.')
      return
    }
    if (!snsConnections[platformId]) {
      showToast('먼저 해당 SNS를 연동해 주세요.')
      return
    }
    const platform = snsPublishPlatforms.find((item) => item.id === platformId)
    showToast(`${platform.label} 발행 대기열에 등록했습니다.`)
  }

  const addScheduledPublish = () => {
    if (!pack) {
      showToast('먼저 콘텐츠를 생성해 주세요.')
      return
    }
    if (!snsConnections[schedulePlatform]) {
      showToast('예약할 SNS를 먼저 연동해 주세요.')
      return
    }

    const platform = snsPublishPlatforms.find((item) => item.id === schedulePlatform)
    const payload = getResultPayload(pack, schedulePlatform)
    const nextItem = {
      id: Date.now(),
      platformId: schedulePlatform,
      platform: platform.label,
      date: scheduleDate,
      time: scheduleTime,
      title: videoInsight?.title || keyword || '자동화 콘텐츠',
      preview: payload.slice(0, 84),
      status: '예약됨',
      accent: platform.accent,
    }
    const nextSchedule = [...scheduleItems, nextItem].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    setScheduleItems(nextSchedule)
    writeStorage('nboost:automation-schedule', nextSchedule)
    showToast(`${platform.label} ${scheduleDate} ${scheduleTime} 예약을 추가했습니다.`)
  }

  return (
    <section className="blog-planner">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">자동화</span>
          <h1>유튜브 콘텐츠 자동 변환</h1>
          <p>유튜브 영상 링크를 넣으면 네이버 블로그, 워드프레스, 스레드, 릴스 기획으로 변환하고 SNS별 예약 발행까지 관리합니다.</p>
        </div>
        <button className="primary-action" type="button" onClick={generatePack} disabled={isLoading}>
          {isLoading ? <RefreshCw size={18} /> : <Sparkles size={18} />}
          {isLoading ? '변환 중' : '전체 변환'}
        </button>
      </div>

      <section className="planner-panel wide sns-publish-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">SNS 연동</span>
            <h2>연동한 채널로 바로 발행하거나 예약합니다.</h2>
          </div>
          <strong>{connectedCount}/{snsPublishPlatforms.length}개 연동</strong>
        </div>
        <div className="sns-connection-grid">
          {snsPublishPlatforms.map((platform) => (
            <article key={platform.id} className={`sns-connection-card ${platform.accent}${snsConnections[platform.id] ? ' connected' : ''}`}>
              <div>
                <span>{platform.type}</span>
                <strong>{platform.label}</strong>
                <p>{snsConnections[platform.id] ? '발행 가능한 상태입니다.' : '연동하면 즉시 발행과 예약이 가능합니다.'}</p>
              </div>
              <div className="sns-card-actions">
                <button type="button" className="ghost-button" onClick={() => toggleSnsConnection(platform.id)}>
                  {snsConnections[platform.id] ? '연동됨' : '연동'}
                </button>
                <button type="button" className="secondary-action" onClick={() => publishNow(platform.id)}>
                  발행
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="planner-grid automation-grid">
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">소스 영상</span>
              <h2>유튜브 링크와 변환 목표</h2>
            </div>
          </div>
          <div className="writer-settings-grid">
            <label>
              <span>유튜브 영상 URL</span>
              <div className="input-shell">
                <Link2 size={18} />
                <input value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
            </label>
            <div className="field-grid">
              <label>
                <span>대표 키워드</span>
                <div className="input-shell">
                  <Search size={18} />
                  <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="비우면 영상 제목에서 자동 추론" />
                </div>
              </label>
              <label>
                <span>전환 목표</span>
                <div className="input-shell">
                  <ClipboardCheck size={18} />
                  <input value={goal} onChange={(event) => setGoal(event.target.value)} />
                </div>
              </label>
            </div>
            <label>
              <span>타깃 독자/시청자</span>
              <textarea value={audience} onChange={(event) => setAudience(event.target.value)} />
            </label>
            <label>
              <span>추가 메모/대본</span>
              <textarea value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="영상에서 꼭 살리고 싶은 문장, 대본, 상품명, 브랜드 톤을 적어주세요." />
            </label>
          </div>
        </section>

        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">영상 분석</span>
              <h2>제목, 채널, 핵심 키워드</h2>
            </div>
          </div>
          {videoInsight ? (
            <div className="youtube-source-card">
              {videoInsight.thumbnail && <img src={videoInsight.thumbnail} alt="" />}
              <div>
                <strong>{videoInsight.title}</strong>
                <span>{videoInsight.author}</span>
                <p>{videoInsight.description || '공개 설명이 없는 영상입니다. 제목과 메모를 중심으로 변환합니다.'}</p>
              </div>
            </div>
          ) : (
            <div className="draft-empty compact-empty">
              <Activity size={24} />
              <strong>영상을 분석하면 제목, 채널, 썸네일, 키워드가 여기에 표시됩니다.</strong>
            </div>
          )}
          <div className="token-badges">
            {(videoInsight?.tokenInsights ?? ['네이버 블로그', '워드프레스', '스레드', '릴스']).map((item) => (
              <span key={item.token ?? item}>{item.token ?? item}{item.count ? ` ${item.count}` : ''}</span>
            ))}
          </div>
        </section>
      </section>

      <section className="keyword-metrics">
        <article>
          <span>생성 플랫폼</span>
          <strong>{snsPublishPlatforms.length}</strong>
          <em>블로그/SNS/숏폼</em>
        </article>
        <article>
          <span>연동 채널</span>
          <strong>{connectedCount}</strong>
          <em>즉시 발행 가능</em>
        </article>
        <article>
          <span>대표 키워드</span>
          <strong>{keyword || videoInsight?.keyword || '-'}</strong>
          <em>자동 추론 가능</em>
        </article>
        <article>
          <span>콘텐츠 목적</span>
          <strong>{goal.split(',')[0]}</strong>
          <em>CTA 기준</em>
        </article>
        <article>
          <span>결과 상태</span>
          <strong>{pack ? '완료' : '대기'}</strong>
          <em>{pack ? '복사/CSV 가능' : '전체 변환 필요'}</em>
        </article>
      </section>

      <section className="planner-panel wide automation-scheduler-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">예약 발행</span>
            <h2>4주 발행 달력에 콘텐츠를 스케줄링합니다.</h2>
          </div>
          <button className="primary-action" type="button" onClick={addScheduledPublish}>
            <CalendarDays size={17} />
            예약 추가
          </button>
        </div>
        <div className="automation-scheduler-form">
          <label>
            <span>발행 채널</span>
            <select value={schedulePlatform} onChange={(event) => setSchedulePlatform(event.target.value)}>
              {snsPublishPlatforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>발행일</span>
            <input type="date" value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} />
          </label>
          <label>
            <span>발행 시간</span>
            <input type="time" value={scheduleTime} onChange={(event) => setScheduleTime(event.target.value)} />
          </label>
        </div>
        <div className="automation-calendar-grid">
          {automationCalendar.map((day) => (
            <article key={day.id} className={day.isToday ? 'automation-calendar-day today' : 'automation-calendar-day'}>
              <div>
                <small>{day.week}</small>
                <span>{day.day}</span>
                <strong>{day.label}</strong>
              </div>
              {day.items.length === 0 ? (
                <p>예약 없음</p>
              ) : (
                day.items.map((item) => (
                  <button key={item.id} type="button" className={`automation-schedule-chip ${item.accent}`}>
                    <em>{item.time}</em>
                    <b>{item.platform}</b>
                    <span>{item.title}</span>
                  </button>
                ))
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="planner-panel wide">
        <div className="section-header">
          <div>
            <span className="eyebrow">변환 결과</span>
            <h2>플랫폼별 콘텐츠</h2>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button" type="button" onClick={copyResult}>
              <ClipboardCheck size={16} />
              복사
            </button>
            <button className="ghost-button" type="button" onClick={exportAll}>
              <Download size={16} />
              CSV
            </button>
          </div>
        </div>
        <div className="utility-tabs platform-tabs">
          {[
            ['naver', '네이버 블로그'],
            ['wordpress', '워드프레스'],
            ['threads', '스레드'],
            ['reels', '릴스 기획'],
          ].map(([id, label]) => (
            <button key={id} type="button" className={activeResult === id ? 'active' : ''} onClick={() => setActiveResult(id)}>
              {label}
            </button>
          ))}
        </div>

        {!pack ? (
          <div className="draft-empty">
            <Sparkles size={26} />
            <strong>전체 변환을 누르면 플랫폼별 결과가 한 번에 생성됩니다.</strong>
          </div>
        ) : activeResult === 'threads' ? (
          <div className="recommend-list">
            {pack.threads.map((item, index) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{index + 1}. {item}</span>
              </article>
            ))}
          </div>
        ) : activeResult === 'reels' ? (
          <div className="seller-table">
            <div className="seller-table-head" style={{ gridTemplateColumns: '90px minmax(0,1.3fr) minmax(0,1.4fr) minmax(0,1fr)' }}>
              <span>구간</span><span>화면</span><span>자막</span><span>메모</span>
            </div>
            {pack.reels.map((item) => (
              <div className="seller-table-row" key={item.scene} style={{ gridTemplateColumns: '90px minmax(0,1.3fr) minmax(0,1.4fr) minmax(0,1fr)' }}>
                <span>{item.scene}</span>
                <strong>{item.visual}</strong>
                <span>{item.caption}</span>
                <em>{item.note}</em>
              </div>
            ))}
          </div>
        ) : (
          <textarea
            className="draft-editor"
            value={activeResult === 'naver' ? pack.naverBlog : pack.wordpress}
            onChange={(event) => {
              const value = event.target.value
              setPack((current) => ({
                ...current,
                [activeResult === 'naver' ? 'naverBlog' : 'wordpress']: value,
              }))
            }}
          />
        )}
      </section>

      {pack?.checklist && (
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">발행 체크리스트</span>
              <h2>플랫폼별 마지막 점검</h2>
            </div>
          </div>
          <div className="recommend-list">
            {pack.checklist.map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}

function SellerKeywordWorkspace({ showToast }) {
  const [keyword, setKeyword] = useState('텀블러')
  const [insight, setInsight] = useState(() => buildNaverKeywordAnalysis('텀블러'))
  const [snapshot, setSnapshot] = useState(() => buildSellerKeywordSnapshot('텀블러', buildNaverKeywordAnalysis('텀블러')))
  const [isLoading, setIsLoading] = useState(false)

  const analyzeKeyword = async (nextKeyword = keyword, options = {}) => {
    if (!nextKeyword.trim()) {
      if (!options.silent) showToast('상품 키워드를 입력해 주세요.')
      return
    }

    setIsLoading(true)
    try {
      const result = await fetchNaverKeywordAnalysis(nextKeyword)
      setInsight(result)
      setSnapshot(buildSellerKeywordSnapshot(nextKeyword, result))
      if (!options.silent) showToast('셀러 키워드 분석을 완료했습니다.')
    } catch {
      const fallback = buildNaverKeywordAnalysis(nextKeyword)
      setInsight(fallback)
      setSnapshot(buildSellerKeywordSnapshot(nextKeyword, fallback))
      if (!options.silent) showToast('API 연결이 없어 추정 데이터로 분석했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => analyzeKeyword(keyword, { silent: true }), 0)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="blog-planner">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">셀러 전용</span>
          <h1>키워드 분석</h1>
          <p>검색량, 상품 수, 경쟁강도, 평균가, 상위 상품 패턴을 함께 보고 팔릴 키워드인지 판단합니다.</p>
        </div>
        <button className="primary-action" type="button" onClick={() => analyzeKeyword()} disabled={isLoading}>
          {isLoading ? <RefreshCw size={18} /> : <BarChart3 size={18} />}
          {isLoading ? '분석 중' : '분석'}
        </button>
      </div>

      <section className="keyword-search-panel">
        <label>
          <span>상품 키워드</span>
          <div className="input-shell">
            <Search size={18} />
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="예: 텀블러, 반려동물 장난감" />
          </div>
        </label>
        <button className="analyze-button" type="button" onClick={() => analyzeKeyword()} disabled={isLoading}>
          <Sparkles size={18} />
          요약정보 보기
        </button>
      </section>

      <section className="keyword-metrics">
        <article>
          <span>월 검색량</span>
          <strong>{snapshot.monthly ? snapshot.monthly.toLocaleString('ko-KR') : '-'}</strong>
          <em>{snapshot.keyword}</em>
        </article>
        <article>
          <span>상품 수</span>
          <strong>{snapshot.productCount.toLocaleString('ko-KR')}</strong>
          <em>공급량 추정</em>
        </article>
        <article>
          <span>경쟁강도</span>
          <strong>{snapshot.competitionRate}</strong>
          <em>상품량/검색량</em>
        </article>
        <article>
          <span>상품 평균가</span>
          <strong>{snapshot.avgPrice.toLocaleString('ko-KR')}원</strong>
          <em>상위 상품 기준 추정</em>
        </article>
      </section>

      <section className="planner-grid">
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">핵심 데이터</span>
              <h2>시장 기회도와 구매 의도</h2>
            </div>
          </div>
          <div className="keyword-metrics compact-metrics">
            <article>
              <span>기회도</span>
              <strong>{snapshot.opportunityScore}</strong>
              <em>낮은 경쟁과 수요의 균형</em>
            </article>
            <article>
              <span>쇼핑전환</span>
              <strong>{snapshot.shoppingConversion}</strong>
              <em>구매 의도 행동 추정</em>
            </article>
            <article>
              <span>광고비</span>
              <strong>{snapshot.adCost.toLocaleString('ko-KR')}원</strong>
              <em>평균 입찰비 추정</em>
            </article>
          </div>
          <div className="recommend-list">
            {snapshot.sourcingIdeas.map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">월별 추이</span>
              <h2>검색량 그래프</h2>
            </div>
          </div>
          <div className="trend-bars">
            {(insight.trend?.length ? insight.trend : Array.from({ length: 6 }, (_, index) => ({ period: `${index + 1}월`, ratio: 40 + index * 8 }))).slice(-6).map((item) => (
              <article key={item.period}>
                <span>{item.period}</span>
                <div><i style={{ height: `${Math.max(18, item.ratio)}%` }} /></div>
                <strong>{Math.round(item.ratio)}</strong>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="planner-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">네이버 TOP 상품</span>
            <h2>상위 상품 미리보기</h2>
          </div>
        </div>
        <div className="seller-table">
          <div className="seller-table-head" style={{ gridTemplateColumns: '60px minmax(0,2fr) minmax(0,0.9fr) minmax(0,0.8fr) minmax(0,1fr)' }}>
            <span>순위</span><span>상품명</span><span>가격</span><span>리뷰</span><span>강점</span>
          </div>
          {snapshot.topProducts.map((item) => (
            <div className="seller-table-row" key={item.rank} style={{ gridTemplateColumns: '60px minmax(0,2fr) minmax(0,0.9fr) minmax(0,0.8fr) minmax(0,1fr)' }}>
              <span>{item.rank}</span>
              <strong>{item.name}</strong>
              <span>{item.price.toLocaleString('ko-KR')}원</span>
              <span>{item.reviews.toLocaleString('ko-KR')}</span>
              <em>{item.strength}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="planner-grid">
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">연관키워드</span>
              <h2>경쟁은 덜하고 결은 비슷한 키워드</h2>
            </div>
          </div>
        <div className="seller-table">
            <div className="seller-table-head" style={{ gridTemplateColumns: 'minmax(0,1.6fr) repeat(4, minmax(0,0.9fr))' }}>
              <span>키워드</span><span>월 검색량</span><span>경쟁률</span><span>쇼핑전환</span><span>광고비</span>
            </div>
            {snapshot.relatedKeywords.map((item) => (
              <div className="seller-table-row" key={item.keyword} style={{ gridTemplateColumns: 'minmax(0,1.6fr) repeat(4, minmax(0,0.9fr))' }}>
                <strong>{item.keyword}</strong>
                <span>{item.monthly.toLocaleString('ko-KR')}</span>
                <span>{item.competitionRate}</span>
                <span>{item.shoppingConversion}</span>
                <em>{item.adCost.toLocaleString('ko-KR')}원</em>
              </div>
            ))}
          </div>
        </section>

        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">상품소싱</span>
              <h2>바로 소싱 검토할 방향</h2>
            </div>
          </div>
          <div className="recommend-list">
            {[
              `${snapshot.keyword} + 묶음구성 상품을 먼저 찾으면 평균가를 높이기 쉽습니다.`,
              `${snapshot.keyword}는 대표 키워드 그대로보다 세부 속성 키워드를 붙인 상품이 경쟁을 덜 받습니다.`,
              `후기에서 반복되는 표현을 상세페이지 상단 문제 해결 문장으로 바꾸면 클릭 대비 전환이 좋아집니다.`,
            ].map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </section>
  )
}

function SellerKeywordFinderWorkspace({ showToast }) {
  const [seedKeyword, setSeedKeyword] = useState('도시락통')
  const [category, setCategory] = useState('주방/생활')
  const [minMonthly, setMinMonthly] = useState(5000)
  const [maxMonthly, setMaxMonthly] = useState(50000)
  const [maxCompetition, setMaxCompetition] = useState(0.9)
  const [minConversion, setMinConversion] = useState(48)
  const [goldenOnly, setGoldenOnly] = useState(true)

  const results = useMemo(
    () =>
      buildSellerFinderResults(seedKeyword, category, {
        minMonthly,
        maxMonthly,
        maxCompetition,
        minConversion,
        goldenOnly,
      }),
    [seedKeyword, category, minMonthly, maxMonthly, maxCompetition, minConversion, goldenOnly],
  )

  const exportResults = () => {
    const rows = [
      ['키워드', '카테고리', '월 검색량', '경쟁률', '쇼핑전환', '광고비', '평균가', '황금키워드'],
      ...results.map((item) => [item.keyword, item.category, item.monthly, item.competitionRate, item.conversion, item.adCost, item.avgPrice, item.golden ? 'Y' : 'N']),
    ]
    downloadCsv(`seller-keyword-finder-${new Date().toISOString().slice(0, 10)}.csv`, rows)
    showToast('키워드 찾기 결과를 CSV로 저장했습니다.')
  }

  return (
    <section className="blog-planner">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">셀러 전용</span>
          <h1>키워드 찾기</h1>
          <p>카테고리와 필터로 검색량과 경쟁의 균형이 맞는 황금 키워드를 빠르게 발굴합니다.</p>
        </div>
        <button className="primary-action" type="button" onClick={exportResults}>
          <Download size={18} />
          엑셀 다운로드
        </button>
      </div>

      <section className="planner-panel">
        <div className="field-grid seller-filter-grid">
          <label>
            <span>시드 키워드</span>
            <div className="input-shell">
              <Search size={18} />
              <input value={seedKeyword} onChange={(event) => setSeedKeyword(event.target.value)} />
            </div>
          </label>
          <label>
            <span>카테고리</span>
            <div className="input-shell">
              <Store size={18} />
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>주방/생활</option>
                <option>패션잡화</option>
                <option>디지털/가전</option>
                <option>뷰티/헬스</option>
                <option>유아/반려</option>
              </select>
            </div>
          </label>
          <label>
            <span>최소 검색량</span>
            <input type="number" value={minMonthly} onChange={(event) => setMinMonthly(Number(event.target.value))} />
          </label>
          <label>
            <span>최대 검색량</span>
            <input type="number" value={maxMonthly} onChange={(event) => setMaxMonthly(Number(event.target.value))} />
          </label>
          <label>
            <span>최대 경쟁률</span>
            <input type="number" step="0.1" value={maxCompetition} onChange={(event) => setMaxCompetition(Number(event.target.value))} />
          </label>
          <label>
            <span>최소 쇼핑전환</span>
            <input type="number" value={minConversion} onChange={(event) => setMinConversion(Number(event.target.value))} />
          </label>
          <label className="seller-check">
            <span>황금키워드만 보기</span>
            <input type="checkbox" checked={goldenOnly} onChange={(event) => setGoldenOnly(event.target.checked)} />
          </label>
        </div>
      </section>

      <section className="keyword-metrics">
        <article>
          <span>발굴 키워드</span>
          <strong>{results.length}</strong>
          <em>현재 필터 기준</em>
        </article>
        <article>
          <span>추천 검색량 구간</span>
          <strong>{minMonthly.toLocaleString('ko-KR')}~{maxMonthly.toLocaleString('ko-KR')}</strong>
          <em>중소형 키워드</em>
        </article>
        <article>
          <span>경쟁률 상한</span>
          <strong>{maxCompetition}</strong>
          <em>공급/수요 기준</em>
        </article>
        <article>
          <span>쇼핑전환 기준</span>
          <strong>{minConversion}</strong>
          <em>구매 의도 필터</em>
        </article>
      </section>

      <section className="planner-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">황금 키워드</span>
            <h2>필터를 통과한 키워드 목록</h2>
          </div>
        </div>
        <div className="seller-table">
          <div className="seller-table-head" style={{ gridTemplateColumns: 'minmax(0,1.8fr) repeat(5, minmax(0,0.9fr))' }}>
            <span>키워드</span><span>월 검색량</span><span>경쟁률</span><span>쇼핑전환</span><span>광고비</span><span>평균가</span>
          </div>
          {results.map((item) => (
            <div className="seller-table-row" key={item.keyword} style={{ gridTemplateColumns: 'minmax(0,1.8fr) repeat(5, minmax(0,0.9fr))' }}>
              <strong>{item.keyword}</strong>
              <span>{item.monthly.toLocaleString('ko-KR')}</span>
              <span>{item.competitionRate}</span>
              <span>{item.conversion}</span>
              <span>{item.adCost.toLocaleString('ko-KR')}원</span>
              <em>{item.avgPrice.toLocaleString('ko-KR')}원</em>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

function SellerProductWorkspace({ showToast }) {
  const [productUrl, setProductUrl] = useState('https://smartstore.naver.com/example/products/123456789')
  const [productInsight, setProductInsight] = useState(null)
  const [diagnosis, setDiagnosis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const analyzeProduct = async (options = {}) => {
    if (!productUrl.trim()) {
      if (!options.silent) showToast('상품 URL을 입력해 주세요.')
      return
    }

    setIsLoading(true)
    try {
      const result = await fetchProductInsights(productUrl)
      setProductInsight(result)
      setDiagnosis(buildSellerProductDiagnosis(result))
      if (!options.silent) showToast('상품 분석을 완료했습니다.')
    } catch (error) {
      if (!options.silent) showToast(error.message || '상품 분석에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="blog-planner">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">셀러 전용</span>
          <h1>상품 분석</h1>
          <p>상품 등록, 판매 관리, 키워드 사용을 점수로 나눠 보고 지금 무엇을 손봐야 할지 바로 정리합니다.</p>
        </div>
        <button className="primary-action" type="button" onClick={() => analyzeProduct()} disabled={isLoading}>
          {isLoading ? <RefreshCw size={18} /> : <ShoppingBag size={18} />}
          {isLoading ? '진단 중' : '상품 진단'}
        </button>
      </div>

      <section className="keyword-search-panel">
        <label>
          <span>상품 상세 URL</span>
          <div className="input-shell">
            <Link2 size={18} />
            <input value={productUrl} onChange={(event) => setProductUrl(event.target.value)} placeholder="네이버 스마트스토어 상품 링크" />
          </div>
        </label>
        <button className="analyze-button" type="button" onClick={() => analyzeProduct()} disabled={isLoading}>
          <Gauge size={18} />
          점수 보기
        </button>
      </section>

      {diagnosis ? (
        <>
          <section className="keyword-metrics">
            <article>
              <span>총점</span>
              <strong>{diagnosis.totalScore}</strong>
              <em>{diagnosis.productName}</em>
            </article>
            {diagnosis.metrics.map((metric) => (
              <article key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <em>{metric.note}</em>
              </article>
            ))}
          </section>

          <section className="planner-grid">
            <section className="planner-panel">
              <div className="section-header">
                <div>
                  <span className="eyebrow">상품 기본 정보</span>
                  <h2>상품명과 대표 키워드</h2>
                </div>
              </div>
              <div className="planner-inference">
                <strong>{diagnosis.productName}</strong>
                <span>대표 키워드: {diagnosis.keyword}</span>
                <span>블로그/쇼핑 연결 주제: {productInsight?.topic}</span>
              </div>
              <div className="recommend-list">
                {diagnosis.actions.map((item) => (
                  <article key={item}>
                    <ClipboardCheck size={17} />
                    <span>{item}</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="planner-panel">
              <div className="section-header">
                <div>
                  <span className="eyebrow">실데이터 신호</span>
                  <h2>키워드 공략 여지</h2>
                </div>
              </div>
              <div className="keyword-metrics compact-metrics">
                <article>
                  <span>월 검색량</span>
                  <strong>{productInsight?.keywordInsight?.monthly ? productInsight.keywordInsight.monthly.toLocaleString('ko-KR') : '-'}</strong>
                  <em>{productInsight?.keyword}</em>
                </article>
                <article>
                  <span>경쟁강도</span>
                  <strong>{productInsight?.keywordInsight?.competition}</strong>
                  <em>{productInsight?.keywordInsight?.difficulty}</em>
                </article>
                <article>
                  <span>공략 가능성</span>
                  <strong>{productInsight?.keywordInsight?.chance}%</strong>
                  <em>검색 신호 기준</em>
                </article>
              </div>
            </section>
          </section>
        </>
      ) : (
        <section className="draft-empty">
          <ShoppingBag size={26} />
          <strong>상품 URL을 넣고 진단을 시작하면 점수와 개선 리포트가 표시됩니다.</strong>
        </section>
      )}
    </section>
  )
}

function SellerRankWorkspace({ showToast }) {
  const [keyword, setKeyword] = useState('차량용 방향제')
  const [insight, setInsight] = useState(() => buildNaverKeywordAnalysis('차량용 방향제'))
  const [rows, setRows] = useState(() => buildSellerProductRank('차량용 방향제', buildNaverKeywordAnalysis('차량용 방향제')))
  const [isLoading, setIsLoading] = useState(false)

  const analyzeRank = async (nextKeyword = keyword, options = {}) => {
    if (!nextKeyword.trim()) {
      if (!options.silent) showToast('순위를 볼 키워드를 입력해 주세요.')
      return
    }

    setIsLoading(true)
    try {
      const result = await fetchNaverKeywordAnalysis(nextKeyword)
      setInsight(result)
      setRows(buildSellerProductRank(nextKeyword, result))
      if (!options.silent) showToast('상품 순위 분석을 완료했습니다.')
    } catch {
      const fallback = buildNaverKeywordAnalysis(nextKeyword)
      setInsight(fallback)
      setRows(buildSellerProductRank(nextKeyword, fallback))
      if (!options.silent) showToast('추정 데이터로 상품 순위를 구성했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => analyzeRank(keyword, { silent: true }), 0)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="blog-planner">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">셀러 전용</span>
          <h1>상품 순위</h1>
          <p>상위권 상품의 가격, 리뷰, 강점 포인트를 비교해서 어떤 자리에서 밀리는지 한눈에 봅니다.</p>
        </div>
        <button className="primary-action" type="button" onClick={() => analyzeRank()} disabled={isLoading}>
          {isLoading ? <RefreshCw size={18} /> : <TrendingUp size={18} />}
          {isLoading ? '불러오는 중' : '순위 보기'}
        </button>
      </div>

      <section className="keyword-search-panel">
        <label>
          <span>순위 키워드</span>
          <div className="input-shell">
            <Search size={18} />
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          </div>
        </label>
        <button className="analyze-button" type="button" onClick={() => analyzeRank()} disabled={isLoading}>
          <BarChart3 size={18} />
          TOP 상품 비교
        </button>
      </section>

      <section className="keyword-metrics">
        <article>
          <span>월 검색량</span>
          <strong>{insight.monthly ? insight.monthly.toLocaleString('ko-KR') : '-'}</strong>
          <em>{keyword}</em>
        </article>
        <article>
          <span>경쟁강도</span>
          <strong>{insight.competition}</strong>
          <em>{insight.difficulty}</em>
        </article>
        <article>
          <span>블로그 문서량</span>
          <strong>{insight.blogDocs.toLocaleString('ko-KR')}</strong>
          <em>콘텐츠 경쟁</em>
        </article>
        <article>
          <span>공략 가능성</span>
          <strong>{insight.chance}%</strong>
          <em>검색 신호 기준</em>
        </article>
      </section>

      <section className="planner-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">TOP 상품</span>
            <h2>상위권 상품 비교표</h2>
          </div>
        </div>
        <div className="seller-table">
          <div className="seller-table-head" style={{ gridTemplateColumns: '60px minmax(0,2fr) repeat(4, minmax(0,0.82fr)) minmax(0,1fr)' }}>
            <span>순위</span><span>상품명</span><span>가격</span><span>리뷰</span><span>평점</span><span>변동</span><span>강점</span>
          </div>
          {rows.map((item) => (
            <div className="seller-table-row" key={item.rank} style={{ gridTemplateColumns: '60px minmax(0,2fr) repeat(4, minmax(0,0.82fr)) minmax(0,1fr)' }}>
              <span>{item.rank}</span>
              <strong>{item.product}</strong>
              <span>{item.price.toLocaleString('ko-KR')}원</span>
              <span>{item.reviews.toLocaleString('ko-KR')}</span>
              <span>{item.rating}</span>
              <span>{item.change}</span>
              <em>{item.strength}</em>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

function SellerAiWorkspace({ showToast }) {
  const [productUrl, setProductUrl] = useState('')
  const [productName, setProductName] = useState('휴대용 선풍기')
  const [keyword, setKeyword] = useState('휴대용 선풍기')
  const [category, setCategory] = useState('디지털/가전')
  const [target, setTarget] = useState('출퇴근 중 시원함이 필요한 직장인')
  const [usp, setUsp] = useState('가볍고 조용한 사용감')
  const [description, setDescription] = useState('한 손으로 들고 다니기 편하고, 실내외 모두 부담 없이 쓸 수 있는 점을 강조하고 싶어요.')
  const [keywordInsight, setKeywordInsight] = useState(() => buildNaverKeywordAnalysis('휴대용 선풍기'))
  const [pack, setPack] = useState(() =>
    buildSellerAiPack({
      productName: '휴대용 선풍기',
      keyword: '휴대용 선풍기',
      category: '디지털/가전',
      target: '출퇴근 중 시원함이 필요한 직장인',
      usp: '가볍고 조용한 사용감',
      description: '한 손으로 들고 다니기 편하고, 실내외 모두 부담 없이 쓸 수 있는 점을 강조하고 싶어요.',
      keywordInsight: buildNaverKeywordAnalysis('휴대용 선풍기'),
    }),
  )
  const [isLoading, setIsLoading] = useState(false)

  const generatePack = async () => {
    setIsLoading(true)
    try {
      let nextProductName = productName
      let nextKeyword = keyword
      let nextInsight = keywordInsight

      if (productUrl.trim()) {
        const result = await fetchProductInsights(productUrl)
        nextProductName = result.productName || nextProductName
        nextKeyword = result.keyword || nextKeyword
        nextInsight = result.keywordInsight || nextInsight
        setProductName(nextProductName)
        setKeyword(nextKeyword)
      } else {
        nextInsight = await fetchNaverKeywordAnalysis(keyword)
      }

      setKeywordInsight(nextInsight)
      setPack(
        buildSellerAiPack({
          productName: nextProductName,
          keyword: nextKeyword,
          category,
          target,
          usp,
          description,
          keywordInsight: nextInsight,
        }),
      )
      showToast('셀러 AI 결과를 생성했습니다.')
    } catch {
      const fallback = buildNaverKeywordAnalysis(keyword)
      setKeywordInsight(fallback)
      setPack(
        buildSellerAiPack({
          productName,
          keyword,
          category,
          target,
          usp,
          description,
          keywordInsight: fallback,
        }),
      )
      showToast('추정 데이터를 바탕으로 셀러 AI 결과를 만들었습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="blog-planner">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">셀러 전용</span>
          <h1>셀러 AI</h1>
          <p>실제 키워드 데이터와 상품 정보를 바탕으로 상품명, 상세페이지 구성, 광고 문구, 판매 포인트를 정리합니다.</p>
        </div>
        <button className="primary-action" type="button" onClick={generatePack} disabled={isLoading}>
          {isLoading ? <RefreshCw size={18} /> : <Sparkles size={18} />}
          {isLoading ? '생성 중' : 'AI 생성'}
        </button>
      </div>

      <section className="planner-grid">
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">입력값</span>
              <h2>상품 정보와 타깃 설정</h2>
            </div>
          </div>
          <div className="writer-settings-grid">
            <label>
              <span>상품 링크</span>
              <div className="input-shell">
                <Link2 size={18} />
                <input value={productUrl} onChange={(event) => setProductUrl(event.target.value)} placeholder="있으면 자동 분석용으로 사용" />
              </div>
            </label>
            <label>
              <span>상품명</span>
              <div className="input-shell">
                <ShoppingBag size={18} />
                <input value={productName} onChange={(event) => setProductName(event.target.value)} />
              </div>
            </label>
            <div className="field-grid">
              <label>
                <span>메인 키워드</span>
                <div className="input-shell">
                  <Search size={18} />
                  <input value={keyword} onChange={(event) => setKeyword(event.target.value)} />
                </div>
              </label>
              <label>
                <span>카테고리</span>
                <div className="input-shell">
                  <Store size={18} />
                  <input value={category} onChange={(event) => setCategory(event.target.value)} />
                </div>
              </label>
            </div>
            <label>
              <span>타깃 고객</span>
              <textarea value={target} onChange={(event) => setTarget(event.target.value)} />
            </label>
            <label>
              <span>차별 포인트</span>
              <textarea value={usp} onChange={(event) => setUsp(event.target.value)} />
            </label>
            <label>
              <span>설명 메모</span>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
            </label>
          </div>
        </section>

        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">실데이터</span>
              <h2>키워드 신호</h2>
            </div>
          </div>
          <div className="keyword-metrics compact-metrics">
            <article>
              <span>월 검색량</span>
              <strong>{keywordInsight.monthly ? keywordInsight.monthly.toLocaleString('ko-KR') : '-'}</strong>
              <em>{keyword}</em>
            </article>
            <article>
              <span>경쟁강도</span>
              <strong>{keywordInsight.competition}</strong>
              <em>{keywordInsight.difficulty}</em>
            </article>
            <article>
              <span>연관키워드</span>
              <strong>{keywordInsight.related?.length ?? 0}</strong>
              <em>확장 가능한 키워드</em>
            </article>
          </div>
          <div className="combo-list">
            {(keywordInsight.related ?? []).slice(0, 8).map((item) => (
              <button key={item} type="button">
                {item}
              </button>
            ))}
          </div>
        </section>
      </section>

      <section className="planner-grid">
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">상품명 제안</span>
              <h2>클릭률을 높일 제목 후보</h2>
            </div>
          </div>
          <div className="recommend-list">
            {pack.productTitles.map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">상세페이지 초안</span>
              <h2>섹션 구조</h2>
            </div>
          </div>
          <div className="recommend-list">
            {pack.detailOutline.map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="planner-grid">
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">광고 문구</span>
              <h2>바로 테스트할 카피</h2>
            </div>
          </div>
          <div className="recommend-list">
            {pack.adCopies.map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">판매 포인트</span>
              <h2>운영 메모</h2>
            </div>
          </div>
          <div className="recommend-list">
            {pack.sellingPoints.map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </section>
  )
}

function InfluencerConnectWorkspace({ showToast }) {
  const [productUrl, setProductUrl] = useState('https://brandconnect.naver.com/')
  const [productInsight, setProductInsight] = useState(null)
  const [productDraft, setProductDraft] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [generatedImages, setGeneratedImages] = useState([])

  const analyzeProduct = async () => {
    if (!productUrl.trim()) {
      showToast('제품 링크를 입력해 주세요.')
      return
    }

    setIsAnalyzing(true)
    try {
      const insight = await fetchProductInsights(productUrl)
      const contentIdeas = buildProductContentIdeas(insight.productName, insight.keyword, insight.topic, insight.keywordInsight)
      const nextInsight = {
        ...insight,
        contentIdeas,
      }
      setProductInsight(nextInsight)
      setProductDraft(buildProductPromoArticle(insight.productName, insight.keyword, insight.topic, insight.keywordInsight))
      setGeneratedImages(
        buildImagePlan(insight.keyword || insight.productName).map((item) => ({
          ...item,
          url: makeGeneratedImageDataUrl(item.title, insight.keyword || insight.productName, item.palette),
        })),
      )
      showToast('제품 링크를 분석하고 홍보 글 초안을 생성했습니다.')
    } catch (error) {
      showToast(error.message || '제품 링크 분석에 실패했습니다.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <section className="blog-planner">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">블로그 전용</span>
          <h1>쇼핑 커넥트 AI 글쓰기</h1>
          <p>제품 링크를 넣으면 실제 상품 정보와 네이버 검색 데이터를 바탕으로 포스팅 전략과 완성형 글을 만듭니다.</p>
        </div>
        <button className="primary-action" type="button" onClick={analyzeProduct} disabled={isAnalyzing}>
          {isAnalyzing ? <RefreshCw size={18} /> : <Sparkles size={18} />}
          {isAnalyzing ? '제품 분석 중' : '제품 분석 시작'}
        </button>
      </div>

      <section className="planner-grid">
        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">제품 링크</span>
              <h2>쇼핑/브랜드 링크 분석</h2>
            </div>
            <ShoppingBag size={22} />
          </div>
          <label>
            <span>제품 링크 입력</span>
            <div className="input-shell">
              <Link2 size={18} />
              <input value={productUrl} onChange={(event) => setProductUrl(event.target.value)} placeholder="네이버 쇼핑 커넥트 또는 제품 상세 링크" />
            </div>
          </label>
          <p className="planner-hint">제품 상세 링크를 넣으면 상품명, 설명, 대표 키워드, 블로그 주제를 자동으로 추론합니다.</p>
          <button className="analyze-button" type="button" onClick={analyzeProduct} disabled={isAnalyzing}>
            {isAnalyzing ? <RefreshCw size={18} /> : <Sparkles size={18} />}
            {isAnalyzing ? '제품 분석 중' : '제품 분석 시작'}
          </button>
        </div>

        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">추론 결과</span>
              <h2>상품명과 대표 키워드</h2>
            </div>
          </div>
          <div className="planner-score">
            <span>상품 콘텐츠 준비도</span>
            <strong>{productInsight ? 88 : 0}</strong>
            <em>{productInsight?.productName || '분석 전'}</em>
          </div>
          {productInsight && (
            <div className="planner-inference">
              <strong>자동 추론 결과</strong>
              <span>상품명: {productInsight.productName}</span>
              <span>대표 키워드: {productInsight.keyword}</span>
              <span>콘텐츠 주제: {productInsight.topic}</span>
            </div>
          )}
          <div className="recommend-list">
            {(productInsight
              ? [
                  '제품 페이지의 실제 제목과 설명을 먼저 읽고 상품명을 정리했습니다.',
                  `${productInsight.keyword} 키워드를 기준으로 네이버 검색 신호를 함께 붙였습니다.`,
                  '사용 장면, 비교 포인트, 장단점, 구매 전 체크리스트 중심으로 글을 쓰는 것이 좋습니다.',
                ]
              : ['제품 링크를 넣고 분석을 시작하면 자동으로 상품 정보와 키워드를 정리합니다.']).map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {productInsight?.keywordInsight && (
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">네이버 실데이터</span>
              <h2>상품 키워드 검색 신호</h2>
            </div>
          </div>
          <div className="api-status-strip">
            <span className={productInsight.keywordInsight.source?.openApi ? 'connected' : ''}>검색 Open API</span>
            <span className={productInsight.keywordInsight.source?.datalab ? 'connected' : ''}>데이터랩</span>
            <span className={productInsight.keywordInsight.source?.searchAd ? 'connected' : ''}>검색광고 월검색량</span>
            {!productInsight.keywordInsight.source?.openApi && !productInsight.keywordInsight.source?.searchAd && <em>추정 모드</em>}
          </div>
          {productInsight.keywordInsight.warnings?.length > 0 && (
            <section className="api-warning">
              {productInsight.keywordInsight.warnings.map((warning) => (
                <span key={warning}>{warning}</span>
              ))}
            </section>
          )}
          <div className="keyword-metrics planner-live-metrics">
            <article>
              <span>{productInsight.keywordInsight.source?.searchAd ? '월 검색량' : '월 예상 검색량'}</span>
              <strong>{productInsight.keywordInsight.monthly ? productInsight.keywordInsight.monthly.toLocaleString() : '-'}</strong>
              <em>모바일 {productInsight.keywordInsight.mobile ? productInsight.keywordInsight.mobile.toLocaleString() : '-'} · PC {productInsight.keywordInsight.pc ? productInsight.keywordInsight.pc.toLocaleString() : '-'}</em>
            </article>
            <article>
              <span>블로그 문서량</span>
              <strong>{productInsight.keywordInsight.blogDocs.toLocaleString()}</strong>
              <em>카페/커뮤니티 {productInsight.keywordInsight.cafeDocs.toLocaleString()}</em>
            </article>
            <article>
              <span>상위노출 난이도</span>
              <strong>{productInsight.keywordInsight.difficulty}</strong>
              <em>경쟁도 {productInsight.keywordInsight.competition}/100</em>
            </article>
            <article>
              <span>공략 가능성</span>
              <strong>{productInsight.keywordInsight.chance}%</strong>
              <em>{productInsight.keywordInsight.trendDirection ? `트렌드 ${productInsight.keywordInsight.trendDirection}` : '실데이터 분석'}</em>
            </article>
          </div>
        </section>
      )}

      {productInsight?.contentIdeas?.length > 0 && (
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">제품 콘텐츠 추천</span>
              <h2>이 제품으로 써야 할 글 주제</h2>
            </div>
            <span className="idea-count">{productInsight.contentIdeas.length}개 추천</span>
          </div>
          <div className="content-idea-grid">
            {productInsight.contentIdeas.map((idea) => (
              <article key={idea.id}>
                <div className="idea-head">
                  <strong>{idea.no}</strong>
                  <span>{idea.priority}</span>
                </div>
                <h3>{idea.title}</h3>
                <dl>
                  <div>
                    <dt>검색 의도</dt>
                    <dd>{idea.intent}</dd>
                  </div>
                  <div>
                    <dt>글 형식</dt>
                    <dd>{idea.format}</dd>
                  </div>
                  <div>
                    <dt>타깃 키워드</dt>
                    <dd>{idea.keyword}</dd>
                  </div>
                </dl>
                <p>{idea.reason}</p>
                <p>{idea.dataReason}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="planner-grid scheduler-grid">
        <div className="planner-panel wide">
          <div className="section-header">
            <div>
              <span className="eyebrow">완성형 글</span>
              <h2>제품 홍보 포스팅</h2>
            </div>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(productDraft)
                showToast('제품 홍보 글을 복사했습니다.')
              }}
            >
              <ClipboardCheck size={17} />
              복사
            </button>
          </div>
          {productDraft ? (
            <textarea className="draft-editor" value={productDraft} onChange={(event) => setProductDraft(event.target.value)} />
          ) : (
            <div className="draft-empty">
              <PenLine size={26} />
              <strong>제품 링크를 분석하면 실데이터 기반 홍보 글이 자동 생성됩니다.</strong>
            </div>
          )}
        </div>

        <div className="planner-panel wide">
          <div className="section-header">
            <div>
              <span className="eyebrow">포스팅용 이미지</span>
              <h2>상품 이미지 배치 추천</h2>
            </div>
            <FileImage size={22} />
          </div>
          <div className="image-plan-list">
            {(generatedImages.length ? generatedImages : buildImagePlan(productInsight?.keyword || productInsight?.productName || '대표 상품')).map((image) => (
              <article key={image.title}>
                {image.url ? <img src={image.url} alt={image.title} /> : <div className="image-placeholder"><FileImage size={22} /></div>}
                <div>
                  <strong>{image.title}</strong>
                  <span>{image.placement}</span>
                  <p>{image.prompt}</p>
                  {image.url && <a href={image.url} download={`${image.title}-${productInsight?.keyword || 'product'}.svg`}>다운로드</a>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}

function BrandCampaignWorkspace({ showToast }) {
  const [productName, setProductName] = useState('두피 세럼')
  const [campaignGoal, setCampaignGoal] = useState('후기형 블로그 10건 확보')
  const [targetAudience, setTargetAudience] = useState('30대 여성, 민감성 두피 고민')
  const [budget, setBudget] = useState('80만원')
  const [campaignPlan, setCampaignPlan] = useState(null)

  const buildPlan = () => {
    const nextPlan = {
      summary: `${productName} 체험단은 ${targetAudience}에게 실제 사용 전후 변화와 사용 편의성을 보여주는 방향이 좋습니다.`,
      requirements: [
        '최근 30일 이내 발행 이력이 있는 블로그/인스타 채널',
        '사진 8장 이상, 사용 장면 3개 이상 포함',
        '장점만이 아니라 아쉬운 점도 한 문단 이상 기재',
        '제품명, 핵심 효능, 사용 대상, 추천 상황을 모두 언급',
      ],
      schedule: [
        { step: '모집 오픈', detail: '체험단 소개글, 혜택, 모집 조건 공개', when: 'D-7' },
        { step: '선정', detail: '콘텐츠 톤과 반응률 기준으로 1차 선정', when: 'D-5' },
        { step: '가이드 전달', detail: '필수 키워드, 금지 표현, 이미지 가이드 전송', when: 'D-3' },
        { step: '발행', detail: `${campaignGoal} 기준 업로드 회수`, when: 'D-Day' },
        { step: '리뷰 회수', detail: '우수 후기 저장, 2차 소재화', when: 'D+3' },
      ],
      checklist: [
        '체험단 모집글에 제품 USP 3가지를 먼저 적기',
        '후기 작성 가이드에 필수 사진 컷 예시 넣기',
        '발행 후 좋은 문장/이미지를 재활용 가능한지 체크하기',
      ],
    }
    setCampaignPlan(nextPlan)
    showToast('제품 체험단 캠페인 플랜을 생성했습니다.')
  }

  return (
    <section className="blog-planner">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">브랜드/협업 전용</span>
          <h1>제품 체험단 플래너</h1>
          <p>모집 조건, 발행 가이드, 리뷰 회수 일정을 한 화면에서 설계합니다.</p>
        </div>
        <button className="primary-action" type="button" onClick={buildPlan}>
          <Bell size={18} />
          체험단 설계
        </button>
      </div>

      <section className="planner-grid">
        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">캠페인 입력</span>
              <h2>모집 조건 설정</h2>
            </div>
          </div>
          <div className="field-grid">
            <label>
              <span>제품명</span>
              <div className="input-shell">
                <ShoppingBag size={18} />
                <input value={productName} onChange={(event) => setProductName(event.target.value)} />
              </div>
            </label>
            <label>
              <span>목표</span>
              <div className="input-shell">
                <ListChecks size={18} />
                <input value={campaignGoal} onChange={(event) => setCampaignGoal(event.target.value)} />
              </div>
            </label>
          </div>
          <label>
            <span>타깃 고객</span>
            <div className="input-shell">
              <BookOpenCheck size={18} />
              <input value={targetAudience} onChange={(event) => setTargetAudience(event.target.value)} />
            </div>
          </label>
          <label>
            <span>예산</span>
            <div className="input-shell">
              <Gauge size={18} />
              <input value={budget} onChange={(event) => setBudget(event.target.value)} />
            </div>
          </label>
        </div>

        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">캠페인 개요</span>
              <h2>체험단 방향</h2>
            </div>
          </div>
          <div className="planner-score">
            <span>예상 운영 난이도</span>
            <strong>{campaignPlan ? 84 : 0}</strong>
            <em>{budget} 기준</em>
          </div>
          <div className="recommend-list">
            {(campaignPlan?.checklist ?? ['체험단 설계를 누르면 모집 기준과 운영 체크리스트가 생성됩니다.']).map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {campaignPlan && (
        <section className="planner-grid">
          <div className="planner-panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">선정 기준</span>
                <h2>필수 요구사항</h2>
              </div>
            </div>
            <p className="campaign-summary">{campaignPlan.summary}</p>
            <div className="recommend-list">
              {campaignPlan.requirements.map((item) => (
                <article key={item}>
                  <ClipboardCheck size={17} />
                  <span>{item}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="planner-panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">진행 일정</span>
                <h2>체험단 운영 스케줄</h2>
              </div>
            </div>
            <div className="schedule-board">
              {campaignPlan.schedule.map((item) => (
                <article key={item.step}>
                  <strong>{item.when}</strong>
                  <span>{item.step}</span>
                  <em>운영</em>
                  <b>{item.detail}</b>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </section>
  )
}

function InfluencerFinderWorkspace({ showToast }) {
  const [keyword, setKeyword] = useState('홈카페')
  const [platform, setPlatform] = useState('블로그')
  const [goal, setGoal] = useState('브랜드 인지도 확대')
  const [profiles, setProfiles] = useState([])

  const buildProfiles = () => {
    const nextProfiles = [
      { name: `${keyword} 기록장`, platform, engagement: '4.8%', audience: '25-34 여성 비중 높음', price: '25~40만원', fit: 92, style: '리뷰형, 정리형' },
      { name: `${keyword} 라이프`, platform, engagement: '3.9%', audience: '직장인/자취 타깃', price: '18~30만원', fit: 86, style: '브이로그형, 감성형' },
      { name: `${keyword} 가이드`, platform, engagement: '5.2%', audience: '검색 유입 강함', price: '30~55만원', fit: 89, style: '비교형, 정보형' },
      { name: `${keyword} 셀렉트`, platform, engagement: '4.1%', audience: '구매 전환형 독자', price: '22~36만원', fit: 84, style: '추천형, 랭킹형' },
    ]
    setProfiles(nextProfiles)
    showToast('인플루언서 후보 리스트를 생성했습니다.')
  }

  return (
    <section className="blog-planner">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">브랜드/협업 전용</span>
          <h1>인플루언서 찾기</h1>
          <p>키워드, 플랫폼, 협업 목표를 넣으면 적합한 크리에이터 후보와 제안 기준을 정리합니다.</p>
        </div>
        <button className="primary-action" type="button" onClick={buildProfiles}>
          <TrendingUp size={18} />
          후보 찾기
        </button>
      </div>

      <section className="planner-grid">
        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">검색 조건</span>
              <h2>협업 기준 설정</h2>
            </div>
          </div>
          <label>
            <span>핵심 키워드</span>
            <div className="input-shell">
              <Search size={18} />
              <input value={keyword} onChange={(event) => setKeyword(event.target.value)} />
            </div>
          </label>
          <div className="field-grid">
            <label>
              <span>플랫폼</span>
              <div className="input-shell">
                <FileImage size={18} />
                <input value={platform} onChange={(event) => setPlatform(event.target.value)} />
              </div>
            </label>
            <label>
              <span>협업 목표</span>
              <div className="input-shell">
                <Sparkles size={18} />
                <input value={goal} onChange={(event) => setGoal(event.target.value)} />
              </div>
            </label>
          </div>
        </div>

        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">매칭 가이드</span>
              <h2>후보 선정 기준</h2>
            </div>
          </div>
          <div className="recommend-list">
            {[
              `${goal} 목적이라면 팔로워 수보다 반응률과 댓글 톤을 우선 확인하세요.`,
              `${platform}에서는 최근 30일 발행 빈도와 협찬 글 비중을 함께 봐야 합니다.`,
              '브랜드 톤과 맞는지, 후기형인지 정보형인지 콘텐츠 결을 반드시 비교하세요.',
            ].map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {profiles.length > 0 && (
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">후보 리스트</span>
              <h2>추천 인플루언서</h2>
            </div>
          </div>
          <div className="content-idea-grid">
            {profiles.map((profile) => (
              <article key={profile.name}>
                <div className="idea-head">
                  <strong>{profile.fit}</strong>
                  <span>적합도</span>
                </div>
                <h3>{profile.name}</h3>
                <dl>
                  <div>
                    <dt>플랫폼</dt>
                    <dd>{profile.platform}</dd>
                  </div>
                  <div>
                    <dt>반응률</dt>
                    <dd>{profile.engagement}</dd>
                  </div>
                  <div>
                    <dt>예상 단가</dt>
                    <dd>{profile.price}</dd>
                  </div>
                </dl>
                <p>{profile.audience}</p>
                <p>{profile.style}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}

function extractPlaceSignal(placeUrl) {
  const decoded = decodeURIComponent(placeUrl || '')
  const compact = decoded
    .replace(/^https?:\/\//, '')
    .replace(/[?#].*$/, '')
    .replace(/[-_/]+/g, ' ')
  const chunks = compact
    .split(/\s+/)
    .filter((item) => item.length > 1)
    .slice(-4)
  return chunks.join(' ') || '네이버 플레이스'
}

function buildMarketingSeedKeywords({ placeUrl, keyword, location }) {
  const placeSignal = extractPlaceSignal(placeUrl)
  const primary = keyword.trim() || `${placeSignal} 맛집`
  const area = location.trim() || placeSignal
  const shortArea = area.split(/\s+/).slice(-1)[0] || area
  return [
    primary,
    `${shortArea} ${primary}`,
    `${primary} 맛집`,
    `${primary} 예약`,
    `${primary} 후기`,
    `${primary} 주차`,
    `${shortArea} 점심 추천`,
    `${shortArea} 회식 장소`,
    `${placeSignal} 후기`,
  ].filter(Boolean)
}

function scoreMarketingKeyword(item) {
  const monthly = Number(item.monthly || 0)
  const docs = Number(item.blogDocs || 0)
  const chance = Number(item.chance || 0)
  const demandScore = Math.min(40, Math.round(monthly / 2500))
  const gapScore = Math.max(0, 34 - Math.round(docs / 120000))
  return Math.max(12, Math.min(96, demandScore + gapScore + Math.round(chance * 0.28)))
}

async function buildMarketingDesignAnalysis({ placeUrl, keyword, location }) {
  const seedKeywords = buildMarketingSeedKeywords({ placeUrl, keyword, location })
  const keywordResults = await Promise.all(
    seedKeywords.map(async (item) => {
      try {
        return await fetchNaverKeywordAnalysis(item)
      } catch {
        return buildNaverKeywordAnalysis(item)
      }
    }),
  )

  const scored = keywordResults
    .map((item) => ({
      ...item,
      strategyScore: scoreMarketingKeyword(item),
      dominance:
        item.competition >= 82 ? '경쟁사 장악' : item.competition >= 60 ? '혼전 구간' : '침투 가능',
      intent:
        item.primary.includes('예약') || item.primary.includes('주차')
          ? '전환형'
          : item.primary.includes('후기') || item.primary.includes('추천')
            ? '검토형'
            : '탐색형',
    }))
    .sort((a, b) => b.strategyScore - a.strategyScore)

  const focus = scored.slice(0, 6)
  const main = focus[0] ?? buildNaverKeywordAnalysis(keyword)
  const areaLabel = location.trim() || extractPlaceSignal(placeUrl)
  const averageChance = Math.round(focus.reduce((sum, item) => sum + item.strategyScore, 0) / Math.max(1, focus.length))
  const competitorHeld = scored.filter((item) => item.dominance === '경쟁사 장악').slice(0, 4)
  const attackable = scored.filter((item) => item.dominance !== '경쟁사 장악').slice(0, 5)
  const source = {
    openApi: scored.some((item) => item.source?.openApi),
    datalab: scored.some((item) => item.source?.datalab),
    searchAd: scored.some((item) => item.source?.searchAd),
  }

  return {
    placeSignal: extractPlaceSignal(placeUrl),
    source,
    summary: {
      score: averageChance,
      primary: main.primary,
      monthly: focus.reduce((sum, item) => sum + Number(item.monthly || 0), 0),
      blogDocs: focus.reduce((sum, item) => sum + Number(item.blogDocs || 0), 0),
      competitorHeld: competitorHeld.length,
      attackable: attackable.length,
    },
    keywords: focus,
    competitorHeld,
    attackable,
    channels: [
      {
        channel: '플레이스',
        role: '전환 거점',
        priority: 1,
        KPI: '저장, 길찾기, 예약, 방문 리뷰',
        action: `${areaLabel} 기준 대표 키워드 3개를 업체명, 소개문, 메뉴명, 사진 설명에 반복 없이 배치하세요.`,
      },
      {
        channel: '블로그',
        role: '검색 장악',
        priority: 2,
        KPI: 'VIEW 상단, 체류 시간, 저장/댓글',
        action: `${main.primary} 중심으로 후기형 4개, 비교형 3개, 정보형 3개를 4주 동안 묶음 발행하세요.`,
      },
      {
        channel: '네이버 카페',
        role: '질문 수요 침투',
        priority: 3,
        KPI: '댓글 반응, 브랜드 언급, 재검색',
        action: '가격, 주차, 예약, 단체 방문처럼 질문이 생기는 키워드를 자연스러운 답변형 콘텐츠로 설계하세요.',
      },
    ],
    roadmap: [
      { week: '1주차', title: '플레이스 기초 정리', detail: '대표 키워드, 메뉴명, 사진 설명, 예약/주차 정보를 정리하고 리뷰 요청 문구를 통일합니다.' },
      { week: '2주차', title: '블로그 클러스터 발행', detail: `${main.primary}, ${attackable[0]?.primary ?? '롱테일 키워드'} 중심으로 후기형 글을 발행합니다.` },
      { week: '3주차', title: '카페 질문형 침투', detail: '카페 검색에서 자주 나오는 질문형 소재를 정리하고 답변형 콘텐츠로 유입을 만듭니다.' },
      { week: '4주차', title: '성과 회수와 보강', detail: '상위노출이 붙은 키워드는 내부 링크로 묶고, 장악된 키워드는 비교/후기 각도를 바꿔 재공략합니다.' },
    ],
  }
}

function MarketingDesignWorkspace({ showToast }) {
  const [placeUrl, setPlaceUrl] = useState('https://map.naver.com/p/example-store')
  const [keyword, setKeyword] = useState('강남 샤브샤브')
  const [location, setLocation] = useState('서울 강남구')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)

  const runDesign = async (event) => {
    event?.preventDefault()
    setIsLoading(true)
    try {
      const nextResult = await buildMarketingDesignAnalysis({ placeUrl, keyword, location })
      setResult(nextResult)
      showToast(nextResult.source.searchAd ? '실데이터 기반 마케팅 설계를 완료했습니다.' : '검색 데이터 기반 마케팅 설계를 완료했습니다.')
    } catch (error) {
      showToast(error.message || '마케팅 설계 생성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      runDesign()
    }, 0)
    return () => window.clearTimeout(timer)
    // 초기 진입 시 샘플 전략을 한 번 생성합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shown = result ?? {
    source: { openApi: false, datalab: false, searchAd: false },
    summary: { score: 0, primary: keyword, monthly: 0, blogDocs: 0, competitorHeld: 0, attackable: 0 },
    keywords: [],
    competitorHeld: [],
    attackable: [],
    channels: [],
    roadmap: [],
  }

  return (
    <section className="marketing-design">
      <div className="planner-hero marketing-hero">
        <div>
          <span className="eyebrow">네이버 마케팅 설계</span>
          <h1>플레이스 링크 하나로 블로그, 카페, 플레이스 공략 순서를 설계합니다.</h1>
          <p>경쟁사가 장악한 키워드와 우리가 먼저 잡아야 할 롱테일 키워드를 분리해 4주 실행 계획으로 정리합니다.</p>
        </div>
        <button className="primary-action" type="button" onClick={runDesign} disabled={isLoading}>
          {isLoading ? <RefreshCw size={18} className="spin" /> : <Sparkles size={18} />}
          {isLoading ? '설계 중' : '전략 설계'}
        </button>
      </div>

      <form className="marketing-design-form" onSubmit={runDesign}>
        <label>
          <span>네이버 플레이스 링크</span>
          <div className="input-shell">
            <Link2 size={18} />
            <input value={placeUrl} onChange={(event) => setPlaceUrl(event.target.value)} placeholder="https://map.naver.com/..." />
          </div>
        </label>
        <label>
          <span>핵심 업종 키워드</span>
          <div className="input-shell">
            <Search size={18} />
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="선택 입력: 강남 샤브샤브" />
          </div>
        </label>
        <label>
          <span>상권/지역</span>
          <div className="input-shell">
            <Store size={18} />
            <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="선택 입력: 서울 강남구" />
          </div>
        </label>
        <button className="analyze-button" type="submit" disabled={isLoading}>
          <BarChart3 size={18} />
          분석
        </button>
      </form>

      <section className="api-status-strip">
        <span className={shown.source.openApi ? 'connected' : ''}>검색 Open API</span>
        <span className={shown.source.datalab ? 'connected' : ''}>데이터랩</span>
        <span className={shown.source.searchAd ? 'connected' : ''}>검색광고 월검색량</span>
      </section>

      <section className="marketing-score-grid">
        <article className="marketing-score-card primary">
          <span>마케팅 공략 점수</span>
          <strong>{shown.summary.score}</strong>
          <p>{shown.summary.primary} 기준으로 플레이스, 블로그, 카페 실행 순서를 설계했습니다.</p>
        </article>
        <article>
          <span>후보 월검색량</span>
          <strong>{shown.summary.monthly ? shown.summary.monthly.toLocaleString() : '-'}</strong>
          <p>상위 후보 6개 합산</p>
        </article>
        <article>
          <span>경쟁사 장악 키워드</span>
          <strong>{shown.summary.competitorHeld}개</strong>
          <p>정면 승부보다 우회 콘텐츠 필요</p>
        </article>
        <article>
          <span>우선 공략 키워드</span>
          <strong>{shown.summary.attackable}개</strong>
          <p>4주 안에 테스트할 롱테일 후보</p>
        </article>
      </section>

      <section className="planner-grid marketing-grid">
        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">경쟁사 장악 구간</span>
              <h2>바로 이기기 어려운 키워드</h2>
            </div>
          </div>
          <div className="marketing-keyword-list">
            {(shown.competitorHeld.length ? shown.competitorHeld : shown.keywords.slice(0, 3)).map((item) => (
              <article key={item.primary}>
                <div>
                  <strong>{item.primary}</strong>
                  <span>{item.intent} · {item.dominance}</span>
                </div>
                <em>{item.monthly ? item.monthly.toLocaleString() : '-'}회</em>
                <b>{item.difficulty}</b>
              </article>
            ))}
          </div>
        </div>

        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">우선 공략 구간</span>
              <h2>우리가 먼저 잡을 키워드</h2>
            </div>
          </div>
          <div className="marketing-keyword-list">
            {(shown.attackable.length ? shown.attackable : shown.keywords.slice(0, 5)).map((item) => (
              <article key={item.primary}>
                <div>
                  <strong>{item.primary}</strong>
                  <span>공략 점수 {item.strategyScore} · 경쟁도 {item.competition}/100</span>
                </div>
                <em>{item.blogDocs ? item.blogDocs.toLocaleString() : '-'}문서</em>
                <b>{item.intent}</b>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="planner-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">채널 전략</span>
            <h2>블로그, 카페, 플레이스 역할 분담</h2>
          </div>
        </div>
        <div className="channel-strategy-grid">
          {shown.channels.map((item) => (
            <article key={item.channel}>
              <span>우선순위 {item.priority}</span>
              <strong>{item.channel}</strong>
              <em>{item.role}</em>
              <p>{item.action}</p>
              <b>{item.KPI}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="planner-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">4주 실행안</span>
            <h2>이번 달 마케팅 운영 순서</h2>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => {
              const text = shown.roadmap.map((item) => `${item.week} ${item.title}: ${item.detail}`).join('\n')
              navigator.clipboard.writeText(text)
              showToast('4주 실행안을 복사했습니다.')
            }}
          >
            <ClipboardCheck size={17} />
            복사
          </button>
        </div>
        <div className="marketing-roadmap">
          {shown.roadmap.map((item) => (
            <article key={item.week}>
              <span>{item.week}</span>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

function buildNaverKeywordAnalysis(keyword) {
  const primary = keyword.trim() || '강남 맛집'
  const seed = primary.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const monthly = 1800 + (seed % 8200)
  const mobile = Math.round(monthly * (0.68 + (seed % 12) / 100))
  const pc = monthly - mobile
  const blogDocs = 12000 + (seed % 86000)
  const cafeDocs = 1800 + (seed % 18000)
  const competition = Math.min(98, Math.round((blogDocs / monthly) * 6 + (seed % 18)))
  const chance = Math.max(12, 100 - competition)
  const difficulty = competition > 78 ? '높음' : competition > 52 ? '보통' : '낮음'

  return {
    primary,
    monthly,
    mobile,
    pc,
    blogDocs,
    cafeDocs,
    competition,
    chance,
    difficulty,
    serp: [
      { name: 'VIEW/블로그', visible: '상단 1~3번째', strength: competition > 70 ? '강함' : '보통', action: '후기형 제목과 실제 경험 문단 강화' },
      { name: '플레이스', visible: seed % 2 ? '중단 노출' : '상단 노출', strength: '중간', action: '지역+업종 키워드와 저장/리뷰 지표 확인' },
      { name: '카페/지식인', visible: seed % 3 ? '보조 노출' : '상단 혼합', strength: '보통', action: '질문형 소제목과 FAQ 문단 추가' },
      { name: '쇼핑/웹문서', visible: seed % 5 ? '하단 노출' : '중단 노출', strength: '낮음', action: '상품/정보 탐색 의도 여부 점검' },
    ],
    related: [
      `${primary} 추천`,
      `${primary} 후기`,
      `${primary} 가격`,
      `${primary} 예약`,
      `${primary} 주차`,
      `${primary} 내돈내산`,
      `${primary} 비교`,
      `${primary} 위치`,
    ],
    contentPlan: [
      '제목 첫 부분에 핵심 키워드와 의도 키워드를 함께 배치합니다.',
      '첫 문단에서 누가, 어떤 상황에서, 왜 이 글을 읽어야 하는지 명확히 말합니다.',
      '상위 글이 반복하는 표현을 그대로 쓰지 말고 실제 경험 근거로 바꿉니다.',
      '사진 설명에는 위치, 가격, 메뉴, 예약, 사용 상황을 자연스럽게 넣습니다.',
      '마지막에는 댓글, 저장, 예약, 문의 중 하나로 이어지는 행동 문장을 둡니다.',
    ],
    source: {
      openApi: false,
      datalab: false,
      searchAd: false,
      fallback: true,
    },
    warnings: ['네이버 API 키가 연결되지 않아 브라우저 추정값으로 표시 중입니다.'],
  }
}

async function fetchNaverKeywordAnalysis(keyword) {
  const response = await fetch(`/api/naver/keyword?keyword=${encodeURIComponent(keyword)}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || '네이버 API 요청에 실패했습니다.')
  }

  if (!data.source?.openApi && !data.source?.searchAd) {
    throw new Error('네이버 API 키가 아직 연결되지 않아 추정값을 표시합니다.')
  }

  return {
    ...buildNaverKeywordAnalysis(keyword),
    ...data,
    monthly: data.monthly ?? 0,
    mobile: data.mobile ?? 0,
    pc: data.pc ?? 0,
    source: {
      ...data.source,
      fallback: false,
    },
  }
}

function NaverKeywordAnalyzer({ showToast }) {
  const [keywordInput, setKeywordInput] = useState('강남 샤브샤브 맛집')
  const [analysisResult, setAnalysisResult] = useState(() => buildNaverKeywordAnalysis('강남 샤브샤브 맛집'))
  const [isLoading, setIsLoading] = useState(false)

  const runAnalysis = async (nextKeyword = keywordInput, options = {}) => {
    setIsLoading(true)
    try {
      const realResult = await fetchNaverKeywordAnalysis(nextKeyword)
      setAnalysisResult(realResult)
      if (!options.silent) {
        showToast(realResult.source.searchAd ? '네이버 실데이터 분석을 완료했습니다.' : '네이버 검색 데이터를 반영했습니다.')
      }
    } catch (error) {
      setAnalysisResult(buildNaverKeywordAnalysis(nextKeyword))
      if (!options.silent) {
        showToast(error.message || 'API 연결 실패로 추정값을 표시합니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      runAnalysis('강남 샤브샤브 맛집', { silent: true })
    }, 0)
    return () => window.clearTimeout(timer)
    // 초기 진입 시 한 번만 자동 조회합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="keyword-analyzer">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">검색/콘텐츠 전용</span>
          <h1>네이버 키워드 분석기</h1>
        <p>키워드를 입력하면 네이버 검색 Open API, 데이터랩, 검색광고 API를 기준으로 경쟁도와 콘텐츠 전략을 분석합니다.</p>
        </div>
      </div>

      <section className="keyword-search-panel">
        <label>
          <span>분석할 키워드</span>
          <div className="input-shell">
            <Search size={18} />
            <input value={keywordInput} onChange={(event) => setKeywordInput(event.target.value)} />
          </div>
        </label>
        <button className="analyze-button" type="button" onClick={runAnalysis} disabled={isLoading}>
          {isLoading ? <RefreshCw size={18} /> : <BarChart3 size={18} />}
          {isLoading ? '조회 중' : '키워드 조회'}
        </button>
      </section>

      <section className="api-status-strip">
        <span className={analysisResult.source?.openApi ? 'connected' : ''}>검색 Open API</span>
        <span className={analysisResult.source?.datalab ? 'connected' : ''}>데이터랩</span>
        <span className={analysisResult.source?.searchAd ? 'connected' : ''}>검색광고 월검색량</span>
        {analysisResult.source?.fallback && <em>추정 모드</em>}
      </section>

      {analysisResult.warnings?.length > 0 && (
        <section className="api-warning">
          {analysisResult.warnings.map((warning) => (
            <span key={warning}>{warning}</span>
          ))}
        </section>
      )}

      <section className="keyword-metrics">
        <article>
          <span>{analysisResult.source?.searchAd ? '월 검색량' : '월 예상 검색량'}</span>
          <strong>{analysisResult.monthly ? analysisResult.monthly.toLocaleString() : '-'}</strong>
          <em>모바일 {analysisResult.mobile ? analysisResult.mobile.toLocaleString() : '-'} · PC {analysisResult.pc ? analysisResult.pc.toLocaleString() : '-'}</em>
        </article>
        <article>
          <span>블로그 문서량</span>
          <strong>{analysisResult.blogDocs.toLocaleString()}</strong>
          <em>카페/커뮤니티 {analysisResult.cafeDocs.toLocaleString()}</em>
        </article>
        <article>
          <span>상위노출 난이도</span>
          <strong>{analysisResult.difficulty}</strong>
          <em>경쟁도 {analysisResult.competition}/100</em>
        </article>
        <article>
          <span>공략 가능성</span>
          <strong>{analysisResult.chance}%</strong>
          <em>{analysisResult.trendDirection ? `트렌드 ${analysisResult.trendDirection}` : '롱테일 확장 추천'}</em>
        </article>
      </section>

      <section className="planner-grid">
        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">SERP 구조</span>
              <h2>네이버 검색 결과 분석</h2>
            </div>
          </div>
          <div className="serp-list">
            {analysisResult.serp.map((item) => (
              <article key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.visible}</span>
                <em>{item.strength}</em>
                <p>{item.action}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">상위노출 전략</span>
              <h2>블로그 작성 액션</h2>
            </div>
          </div>
          <div className="recommend-list">
            {analysisResult.contentPlan.map((item) => (
              <article key={item}>
                <ClipboardCheck size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="planner-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">확장 키워드</span>
            <h2>블로그 제목/소제목 후보</h2>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(analysisResult.related.join('\n'))
              showToast('확장 키워드를 복사했습니다.')
            }}
          >
            <ClipboardCheck size={17} />
            복사
          </button>
        </div>
        <div className="combo-list">
          {analysisResult.related.map((item) => (
            <button key={item} type="button">
              {item}
            </button>
          ))}
        </div>
      </section>

      {analysisResult.topBlogs?.length > 0 && (
        <section className="planner-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">실제 블로그 검색 결과</span>
              <h2>상위 블로그 참고 글</h2>
            </div>
          </div>
          <div className="live-result-list">
            {analysisResult.topBlogs.map((item) => (
              <a key={item.link} href={item.link} target="_blank" rel="noreferrer">
                <strong>{item.title}</strong>
                <span>{item.bloggername} · {item.postdate}</span>
                <p>{item.description}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}

function buildBlogIndexAnalysis({ url, topic, posts, days, comments, neighbors, views }) {
  const normalizedTopic = topic.trim() || '대표 주제'
  const safePosts = Number(posts) || 0
  const safeDays = Math.max(1, Number(days) || 1)
  const safeComments = Number(comments) || 0
  const safeNeighbors = Number(neighbors) || 0
  const safeViews = Number(views) || 0
  const postRhythm = Math.min(100, Math.round((safePosts / Math.max(1, safeDays / 7)) * 16))
  const reactionScore = Math.min(100, Math.round((safeComments * 1.6 + safeNeighbors * 0.18 + safeViews * 0.012) / Math.max(1, safePosts)))
  const topicScore = Math.min(100, 48 + normalizedTopic.length * 4 + (url.includes('blog.naver') ? 12 : 0))
  const trustScore = Math.min(100, Math.round(topicScore * 0.36 + postRhythm * 0.34 + reactionScore * 0.3))
  const grade = trustScore >= 82 ? '강함' : trustScore >= 64 ? '성장' : trustScore >= 46 ? '보통' : '초기'

  return {
    topic: normalizedTopic,
    score: trustScore,
    grade,
    metrics: [
      { label: '주제 전문성', value: topicScore, note: `${normalizedTopic} 중심 콘텐츠 일관성` },
      { label: '발행 꾸준함', value: postRhythm, note: `${safeDays}일 동안 ${safePosts}개 발행 기준` },
      { label: '반응 신뢰도', value: reactionScore, note: '댓글, 이웃, 조회 반응을 게시글 수로 보정' },
    ],
    actions: [
      `${normalizedTopic} 메인 키워드를 제목 첫 18자 안에 자연스럽게 배치하세요.`,
      '최근 30일 기준 최소 주 3회 발행 리듬을 만들고 같은 주제 묶음으로 이어 쓰세요.',
      '후기, 비교, 가격, 예약, 방법처럼 검색 의도가 다른 글을 하나의 클러스터로 연결하세요.',
      '댓글을 유도하는 질문 문장과 다음 글 내부 링크를 마지막 문단에 고정하세요.',
    ],
  }
}

function BlogIndexEstimator({ showToast }) {
  const [form, setForm] = useState({
    url: 'https://blog.naver.com/myblog',
    topic: '강남 맛집',
    posts: 18,
    days: 30,
    comments: 96,
    neighbors: 480,
    views: 12400,
  })
  const [result, setResult] = useState(() => buildBlogIndexAnalysis(form))

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const runEstimate = () => {
    setResult(buildBlogIndexAnalysis(form))
    showToast('블로그 지수 추정 진단을 완료했습니다.')
  }

  return (
    <section className="keyword-analyzer">
      <div className="planner-hero">
        <div>
          <span className="eyebrow">블로그 전용</span>
          <h1>블로그 지수 진단</h1>
          <p>공식 공개 점수가 아닌 운영 지표 기반 추정값으로, 내 블로그가 어떤 방향으로 성장해야 하는지 보여줍니다.</p>
        </div>
      </div>

      <section className="index-form-panel">
        <label>
          <span>블로그 홈 URL</span>
          <div className="input-shell">
            <Link2 size={18} />
            <input value={form.url} onChange={(event) => updateField('url', event.target.value)} />
          </div>
        </label>
        <label>
          <span>대표 주제</span>
          <div className="input-shell">
            <BookOpenCheck size={18} />
            <input value={form.topic} onChange={(event) => updateField('topic', event.target.value)} />
          </div>
        </label>
        <label>
          <span>최근 게시글 수</span>
          <input type="number" min="0" value={form.posts} onChange={(event) => updateField('posts', event.target.value)} />
        </label>
        <label>
          <span>측정 기간(일)</span>
          <input type="number" min="1" value={form.days} onChange={(event) => updateField('days', event.target.value)} />
        </label>
        <label>
          <span>댓글 합계</span>
          <input type="number" min="0" value={form.comments} onChange={(event) => updateField('comments', event.target.value)} />
        </label>
        <label>
          <span>이웃 수</span>
          <input type="number" min="0" value={form.neighbors} onChange={(event) => updateField('neighbors', event.target.value)} />
        </label>
        <label>
          <span>조회수 합계</span>
          <input type="number" min="0" value={form.views} onChange={(event) => updateField('views', event.target.value)} />
        </label>
        <button className="analyze-button" type="button" onClick={runEstimate}>
          <Gauge size={18} />
          지수 계산
        </button>
      </section>

      <section className="keyword-metrics">
        <article>
          <span>블로그 지수 추정</span>
          <strong>{result.score}/100</strong>
          <em>{result.grade} 단계</em>
        </article>
        {result.metrics.map((metric) => (
          <article key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <em>{metric.note}</em>
          </article>
        ))}
      </section>

      <section className="planner-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">개선 액션</span>
            <h2>{result.topic} 블로그 성장 방향</h2>
          </div>
        </div>
        <div className="recommend-list">
          {result.actions.map((item) => (
            <article key={item}>
              <ClipboardCheck size={17} />
              <span>{item}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('owner@mabu.kr')
  const [name, setName] = useState('마부 운영자')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin({ email, name, plan: 'Starter' })
  }

  return (
    <main className="login-screen">
      <section className="login-copy">
        <div className="brand login-brand">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>
          <div>
            <strong>마부</strong>
            <span>마케팅 부스트</span>
          </div>
        </div>
        <h1>광고 분석을 시작하기 전에 운영 계정을 만들어요.</h1>
        <p>로그인 정보, 추적 목록, 분석 히스토리, CSV 리포트가 브라우저에 저장됩니다.</p>
      </section>

      <form className="login-card" onSubmit={handleSubmit}>
        <span className="eyebrow">간편 시작</span>
        <h2>워크스페이스 로그인</h2>
        <label>
          <span>이름</span>
          <div className="input-shell">
            <Store size={18} />
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
        </label>
        <label>
          <span>이메일</span>
          <div className="input-shell">
            <Link2 size={18} />
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
        </label>
        <button className="analyze-button" type="submit">
          <Sparkles size={18} />
          대시보드 열기
        </button>
      </form>
    </main>
  )
}

function App() {
  const [user, setUser] = useState(() => readStorage('nboost:user', null))
  const [activeTool, setActiveTool] = useState('dashboard')
  const [activeUtility, setActiveUtility] = useState('')
  const [openGroups, setOpenGroups] = useState(() => ({
    dashboard: true,
    marketing: true,
    place: true,
    blog: true,
    store: true,
    brand: true,
    automation: true,
    kin: true,
    search: true,
    utility: true,
  }))
  const [placeUrl, setPlaceUrl] = useState('https://map.naver.com/p/example-store')
  const [keyword, setKeyword] = useState('강남 샤브샤브')
  const [location, setLocation] = useState('서울 강남구')
  const [isAnalyzed, setIsAnalyzed] = useState(true)
  const [toast, setToast] = useState('')
  const [selectedRows, setSelectedRows] = useState(() => readStorage('nboost:selected', ['강남 샤브샤브', '마라샹궈 맛집']))
  const [trackedItems, setTrackedItems] = useState(() => readStorage('nboost:tracked', defaultTrackedItems))
  const [history, setHistory] = useState(() => readStorage('nboost:history', []))
  const [topicPrompt, setTopicPrompt] = useState('')
  const [topicMessages, setTopicMessages] = useState(() =>
    readStorage('nboost:topic-messages', [
      { role: 'ai', text: '어떤 상품, 지역, 경쟁 블로그, 유튜브 소재든 적어주세요. 바로 주제 후보를 만들어 드릴게요.' },
    ]),
  )
  const [topicIdeas, setTopicIdeas] = useState(() => readStorage('nboost:topic-ideas', defaultTopicIdeas))
  const [calendarPlan, setCalendarPlan] = useState(() => readStorage('nboost:calendar-plan', {}))
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [generatedContent, setGeneratedContent] = useState(() => readStorage('nboost:generated-content', null))
  const [profitForm] = useState(() =>
    readStorage('nboost:profit', {
      revenue: 12800000,
      adCost: 2450000,
      operatingCost: 3150000,
      extraCost: 620000,
    }),
  )
  const [analysis, setAnalysis] = useState(() =>
    buildAnalysis({ placeUrl: 'https://map.naver.com/p/example-store', keyword: '강남 샤브샤브', location: '서울 강남구', tool: 'place' }),
  )

  const activeToolMeta = { ...tools.find((tool) => tool.id === activeTool), ...toolConfigs[activeTool] }
  const ActiveToolIcon = activeToolMeta.icon
  const rankRows = history[0]?.toolId === activeTool ? history[0].rows : activeToolMeta.rows ?? baseRankRows
  const profitSummary = useMemo(() => buildProfitSummary(profitForm), [profitForm])
  const dashboardCalendar = useMemo(() => buildMonthCalendar(calendarPlan, calendarMonth), [calendarPlan, calendarMonth])
  const plannedContentCount = useMemo(
    () => Object.values(calendarPlan).reduce((sum, items) => sum + items.length, 0),
    [calendarPlan],
  )
  const dashboardSummary = useMemo(
    () => [
      { label: '운영 플랫폼', value: `${platformMarketingStatus.length}개`, note: '플레이스, 블로그, 쇼핑, 자동화, 협업' },
      { label: '4주 콘텐츠', value: `${contentCalendarItems.length + plannedContentCount}건`, note: `자동 생성 ${plannedContentCount}건 포함` },
      { label: '추적 키워드', value: `${trackedItems.length}건`, note: '순위와 상태를 모니터링 중' },
      { label: '예상 순익', value: `${profitSummary.netProfit.toLocaleString()}원`, note: `마진율 ${profitSummary.margin}% · ROAS ${profitSummary.roas}배` },
    ],
    [plannedContentCount, profitSummary.margin, profitSummary.netProfit, profitSummary.roas, trackedItems.length],
  )

  const combinations = useMemo(() => {
    const areas = ['강남', '역삼', '선릉']
    const intents = ['맛집', '회식', '점심', '예약']
    const services = keyword.split(' ').filter(Boolean).slice(0, 2)
    return areas.flatMap((area) => intents.map((intent) => `${area} ${services.join(' ')} ${intent}`)).slice(0, 9)
  }, [keyword])

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1800)
  }

  const handleLogin = (nextUser) => {
    writeStorage('nboost:user', nextUser)
    setUser(nextUser)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('nboost:user')
    setUser(null)
  }

  const handleToolChange = (toolId) => {
    const nextTool = { ...tools.find((tool) => tool.id === toolId), ...toolConfigs[toolId] }
    setActiveUtility('')
    setActiveTool(toolId)
    if (nextTool.defaultKeyword) {
      setKeyword(nextTool.defaultKeyword)
      setAnalysis(buildAnalysis({ placeUrl, keyword: nextTool.defaultKeyword, location, tool: toolId }))
    }
  }

  const handleUtilityChange = (utilityId) => {
    setActiveUtility(utilityId)
    setOpenGroups((groups) => ({ ...groups, utility: true }))
  }

  const toggleGroup = (groupId) => {
    setOpenGroups((groups) => ({ ...groups, [groupId]: !groups[groupId] }))
  }

  const handleAnalyze = (event) => {
    event.preventDefault()
    setIsAnalyzed(false)

    window.setTimeout(() => {
      const nextAnalysis = buildAnalysis({ placeUrl, keyword, location, tool: activeTool })
      const rows = buildRows(keyword, nextAnalysis)
      const record = {
        id: Date.now(),
        toolId: activeTool,
        tool: activeToolMeta.label,
        keyword,
        location,
        placeUrl,
        analysis: nextAnalysis,
        rows,
      }
      const nextHistory = [record, ...history].slice(0, 12)
      setAnalysis(nextAnalysis)
      setHistory(nextHistory)
      writeStorage('nboost:history', nextHistory)
      setIsAnalyzed(true)
      showToast('분석 결과가 저장되었습니다.')
    }, 420)
  }

  const toggleRow = (rowKeyword) => {
    const nextSelected = selectedRows.includes(rowKeyword)
      ? selectedRows.filter((item) => item !== rowKeyword)
      : [...selectedRows, rowKeyword]
    setSelectedRows(nextSelected)
    writeStorage('nboost:selected', nextSelected)
  }

  const addTracking = () => {
    const exists = trackedItems.some((item) => item.title.includes(keyword))
    if (exists) {
      showToast('이미 추적 중인 키워드입니다.')
      return
    }

    const nextItems = [
      {
        id: Date.now(),
        title: `${keyword} ${activeToolMeta.label}`,
        channel: activeToolMeta.label,
        status: analysis.rank <= 5 ? '상승' : '관찰',
        change: `${analysis.rank}위`,
        color: analysis.rank <= 5 ? 'green' : 'blue',
      },
      ...trackedItems,
    ]
    setTrackedItems(nextItems)
    writeStorage('nboost:tracked', nextItems)
    showToast('추적 목록에 추가했습니다.')
  }

  const refreshTracking = () => {
    const nextItems = trackedItems.map((item, index) => ({
      ...item,
      status: index % 2 === 0 ? '상승' : '유지',
      change: index % 2 === 0 ? `+${index + 2}` : item.change,
      color: index % 2 === 0 ? 'green' : 'blue',
    }))
    setTrackedItems(nextItems)
    writeStorage('nboost:tracked', nextItems)
    showToast('추적 상태를 갱신했습니다.')
  }

  const moveCalendarMonth = (amount) => {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  }

  const resetCalendarMonth = () => {
    const today = new Date()
    setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  const handleTopicPlannerSubmit = (event) => {
    event.preventDefault()
    const ideas = createTopicIdeas(topicPrompt, keyword)
    const nextIdeas = [...ideas, ...topicIdeas].slice(0, 9)
    const nextMessages = [
      ...topicMessages,
      { role: 'user', text: topicPrompt || `${keyword} 기준으로 주제 추천해줘` },
      { role: 'ai', text: `${ideas.length}개 주제를 만들었어요. 원하는 주제를 날짜 칸으로 끌어 넣으면 콘텐츠가 자동 생성됩니다.` },
    ].slice(-8)
    setTopicIdeas(nextIdeas)
    setTopicMessages(nextMessages)
    setTopicPrompt('')
    writeStorage('nboost:topic-ideas', nextIdeas)
    writeStorage('nboost:topic-messages', nextMessages)
  }

  const handleTopicDragStart = (event, topic) => {
    event.dataTransfer.setData('application/json', JSON.stringify(topic))
    event.dataTransfer.effectAllowed = 'copy'
  }

  const handleCalendarDrop = (event, day) => {
    event.preventDefault()
    const rawTopic = event.dataTransfer.getData('application/json')
    if (!rawTopic) return
    let topic
    try {
      topic = JSON.parse(rawTopic)
    } catch {
      showToast('주제 카드를 다시 끌어 넣어 주세요.')
      return
    }
    const generated = buildGeneratedContent(topic, day)
    const plannedItem = {
      id: generated.id,
      title: topic.title,
      platform: topic.platform || day.platform,
      status: '생성됨',
      generated,
    }
    const nextPlan = {
      ...calendarPlan,
      [day.date]: [...(calendarPlan[day.date] || []), plannedItem],
    }
    setCalendarPlan(nextPlan)
    setGeneratedContent(generated)
    writeStorage('nboost:calendar-plan', nextPlan)
    writeStorage('nboost:generated-content', generated)
    showToast(`${day.date}에 콘텐츠를 생성했습니다.`)
  }

  const handleReport = () => {
    const latest = history[0]
    const rows = [
      ['구분', '값'],
      ['도구', latest?.tool ?? activeToolMeta.label],
      ['키워드', latest?.keyword ?? keyword],
      ['지역', latest?.location ?? location],
      ['예상 순위', `${analysis.rank}위`],
      ['노출 점수', analysis.score],
      ['히든 키워드', analysis.hidden],
      ['월 예상 노출', analysis.exposure],
      ['매출', profitSummary.revenue],
      ['광고비', profitSummary.adCost],
      ['운영비', profitSummary.operatingCost],
      ['기타비', profitSummary.extraCost],
      ['총비용', profitSummary.totalCost],
      ['순익', profitSummary.netProfit],
      ['마진율', `${profitSummary.margin}%`],
      ['ROAS', `${profitSummary.roas}배`],
      [],
      ['키워드', '오늘 순위', '전일 순위', '저장', '블로그 리뷰', '방문 리뷰'],
      ...rankRows.map((row) => [row.keyword, row.today, row.yesterday, row.save, row.blog, row.visit]),
    ]
    downloadCsv(`mabu-report-${new Date().toISOString().slice(0, 10)}.csv`, rows)
    showToast('CSV 리포트를 다운로드했습니다.')
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="app-shell">
      {toast && <div className="toast">{toast}</div>}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>
          <div>
            <strong>마부</strong>
            <span>마케팅 부스트</span>
          </div>
        </div>

        <nav className="tool-nav grouped" aria-label="분석 도구">
          {toolGroups.map((group) => (
            <div className={openGroups[group.id] ? 'nav-group open' : 'nav-group'} key={group.id}>
              <button className="nav-group-head" type="button" onClick={() => toggleGroup(group.id)}>
                <span>{group.label}</span>
                <ChevronDown size={15} />
              </button>
              {openGroups[group.id] && (
                <div className="nav-group-list">
                  {group.toolIds.map((toolId) => {
                    const tool = tools.find((item) => item.id === toolId)
                    const Icon = tool.icon
                    return (
                      <button
                        className={!activeUtility && activeTool === tool.id ? 'nav-item active' : 'nav-item'}
                        key={tool.id}
                        onClick={() => handleToolChange(tool.id)}
                        type="button"
                      >
                        <Icon size={18} />
                        <span>{tool.label}</span>
                        {tool.badge && <em>{tool.badge}</em>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className={openGroups.utility ? 'utility-nav open' : 'utility-nav'}>
          <button className="utility-nav-head" type="button" onClick={() => toggleGroup('utility')}>
            <span>기타</span>
            <ChevronDown size={15} />
          </button>
          {openGroups.utility && (
            <div className="utility-nav-list">
              {utilities.map((utility) => {
                const Icon = utility.icon
                return (
                  <button
                    key={utility.id}
                    type="button"
                    className={activeUtility === utility.id ? 'utility-nav-item active' : 'utility-nav-item'}
                    onClick={() => handleUtilityChange(utility.id)}
                  >
                    <Icon size={16} />
                    {utility.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="sidebar-panel">
          <div className="panel-title">
            <Bell size={16} />
            오늘 알림
          </div>
          <p>추적 {trackedItems.length}건과 분석 히스토리 {history.length}건이 저장되어 있습니다.</p>
        </div>
      </aside>

      <main className="workspace">
        {activeUtility ? (
          <UtilityWorkspace activeUtility={activeUtility} setActiveUtility={handleUtilityChange} showToast={showToast} />
        ) : activeTool === 'content-automation' ? (
          <ContentAutomationWorkspace showToast={showToast} />
        ) : activeTool === 'marketing-design' ? (
          <MarketingDesignWorkspace showToast={showToast} />
        ) : activeTool === 'seller-keyword' ? (
          <SellerKeywordWorkspace showToast={showToast} />
        ) : activeTool === 'seller-finder' ? (
          <SellerKeywordFinderWorkspace showToast={showToast} />
        ) : activeTool === 'seller-product' ? (
          <SellerProductWorkspace showToast={showToast} />
        ) : activeTool === 'seller-rank' ? (
          <SellerRankWorkspace showToast={showToast} />
        ) : activeTool === 'seller-ai' ? (
          <SellerAiWorkspace showToast={showToast} />
        ) : activeTool === 'blog-planner' ? (
          <BlogPlannerWorkspace showToast={showToast} />
        ) : activeTool === 'blog-writer' ? (
          <BlogWriterWorkspace showToast={showToast} />
        ) : activeTool === 'influencer' ? (
          <InfluencerConnectWorkspace showToast={showToast} />
        ) : activeTool === 'campaign' ? (
          <BrandCampaignWorkspace showToast={showToast} />
        ) : activeTool === 'finder' ? (
          <InfluencerFinderWorkspace showToast={showToast} />
        ) : activeTool === 'blog-index' ? (
          <BlogIndexEstimator showToast={showToast} />
        ) : activeTool === 'volume' ? (
          <NaverKeywordAnalyzer showToast={showToast} />
        ) : (
          <>
        <header className="topbar">
          <div>
            <span className="eyebrow">광고 운영 대시보드</span>
            <h1>검색 노출과 콘텐츠 성과를 한 곳에서 관리하세요.</h1>
          </div>
          <div className="topbar-actions">
            <button type="button" className="icon-button" aria-label="로그아웃" onClick={handleLogout}>
              <LogOut size={19} />
            </button>
            <button type="button" className="icon-button" aria-label="설정">
              <Settings size={19} />
            </button>
            <button type="button" className="secondary-action" onClick={handleReport}>
              <Download size={17} />
              리포트
            </button>
            <button type="button" className="primary-action" onClick={addTracking}>
              <Plus size={18} />
              추적 추가
            </button>
          </div>
        </header>

        {activeTool === 'dashboard' && (
        <>
        <section className="dashboard-overview-panel" aria-label="통합 대시보드">
          <div className="section-header">
            <div>
              <span className="eyebrow">통합 대시보드</span>
              <h2>마케팅 현황, 콘텐츠 일정, 순익을 한 화면에서 봅니다.</h2>
            </div>
            <button type="button" className="ghost-button" onClick={() => handleToolChange('blog-planner')}>
              <Sparkles size={17} />
              콘텐츠 기획
            </button>
          </div>
          <div className="dashboard-summary-grid">
            {dashboardSummary.map((item) => (
              <article key={item.label} className="dashboard-summary-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="monthly-calendar-panel" aria-label="월간 콘텐츠 달력">
          <div className="section-header">
            <div>
              <span className="eyebrow">월간 콘텐츠 달력</span>
              <h2>{dashboardCalendar.title} 일정</h2>
            </div>
            <div className="calendar-controls" aria-label="달력 월 이동">
              <button type="button" className="icon-button" onClick={() => moveCalendarMonth(-1)} aria-label="이전 달">
                <ChevronLeft size={18} />
              </button>
              <button type="button" className="ghost-button" onClick={resetCalendarMonth}>
                <CalendarDays size={17} />
                이번 달
              </button>
              <button type="button" className="icon-button" onClick={() => moveCalendarMonth(1)} aria-label="다음 달">
                <ChevronRight size={18} />
              </button>
              <button type="button" className="ghost-button" onClick={() => handleToolChange('content-automation')}>
                일정 자동화
              </button>
            </div>
          </div>
          <div className="month-calendar-weekdays" aria-hidden="true">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="month-calendar-grid">
            {dashboardCalendar.cells.map((cell) =>
              cell.blank ? (
                <div key={cell.id} className="month-calendar-cell blank" />
              ) : (
                <article key={cell.id} className={cell.isToday ? 'month-calendar-cell today' : 'month-calendar-cell'}>
                  <strong>{cell.day}</strong>
                  <div>
                    {cell.items.length === 0 ? (
                      <span className="empty-day">일정 없음</span>
                    ) : (
                      cell.items.slice(0, 3).map((item, index) => (
                        <button
                          key={`${cell.date}-${item.title}-${index}`}
                          type="button"
                          onClick={() => {
                            if (item.toolId) handleToolChange(item.toolId)
                          }}
                        >
                          <em>{item.platform}</em>
                          {item.title}
                        </button>
                      ))
                    )}
                  </div>
                </article>
              ),
            )}
          </div>
        </section>

        <section className="marketing-command-center" aria-label="플랫폼별 마케팅 현황">
          <div className="section-header">
            <div>
              <span className="eyebrow">플랫폼별 마케팅 현황</span>
              <h2>오늘 어디를 밀어야 하는지 바로 확인하세요.</h2>
            </div>
            <button type="button" className="ghost-button" onClick={refreshTracking}>
              <RefreshCw size={17} />
              현황 갱신
            </button>
          </div>
          <div className="platform-status-grid">
            {platformMarketingStatus.map((item) => (
              <button
                type="button"
                key={item.platform}
                className={`platform-status-card ${item.accent}${activeTool === item.toolId ? ' active' : ''}`}
                onClick={() => handleToolChange(item.toolId)}
              >
                <div className="platform-status-head">
                  <strong>{item.platform}</strong>
                  <span>{item.status}</span>
                </div>
                <p>{item.focus}</p>
                <div className="platform-status-metric">
                  <b>{item.metric}</b>
                  <em>{item.progress}%</em>
                </div>
                <div className="platform-progress" aria-hidden="true">
                  <span style={{ width: `${item.progress}%` }} />
                </div>
                <small>{item.next}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="content-calendar-panel" aria-label="콘텐츠 캘린더">
          <div className="section-header">
            <div>
              <span className="eyebrow">콘텐츠 캘린더</span>
              <h2>4주 동안의 발행과 점검 일정을 한눈에 관리합니다.</h2>
            </div>
            <button type="button" className="ghost-button" onClick={() => handleToolChange('content-automation')}>
              <CalendarDays size={17} />
              자동화 열기
            </button>
          </div>
          <div className="topic-planner-grid">
            <form className="ai-topic-chat" onSubmit={handleTopicPlannerSubmit}>
              <div className="ai-topic-chat-head">
                <Sparkles size={19} />
                <div>
                  <strong>AI 주제 기획 대화창</strong>
                  <span>원하는 방향을 말하면 드래그 가능한 주제가 생성됩니다.</span>
                </div>
              </div>
              <div className="topic-message-list">
                {topicMessages.map((message, index) => (
                  <p key={`${message.role}-${index}`} className={message.role}>
                    {message.text}
                  </p>
                ))}
              </div>
              <label>
                <span>기획 요청</span>
                <textarea
                  value={topicPrompt}
                  onChange={(event) => setTopicPrompt(event.target.value)}
                  placeholder="예: 강남 샤브샤브 경쟁 블로그를 이길 수 있는 주제 5개 추천해줘"
                />
              </label>
              <button className="analyze-button" type="submit">
                <Sparkles size={18} />
                주제 생성
              </button>
            </form>

            <div className="topic-idea-board">
              <div className="section-header compact">
                <div>
                  <span className="eyebrow">드래그 주제</span>
                  <h2>날짜 칸으로 끌어 넣으세요.</h2>
                </div>
              </div>
              <div className="topic-idea-list">
                {topicIdeas.map((topic) => (
                  <article
                    key={topic.id}
                    className="topic-idea-card"
                    draggable
                    onDragStart={(event) => handleTopicDragStart(event, topic)}
                  >
                    <span>{topic.platform}</span>
                    <strong>{topic.title}</strong>
                    <p>{topic.angle}</p>
                    <em>{topic.intent}</em>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="content-calendar-grid">
            {contentCalendarItems.map((item) => (
              <article
                key={`${item.date}-${item.title}`}
                className={`content-calendar-day ${item.accent}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleCalendarDrop(event, item)}
              >
                <small className="content-week-label">{item.week}</small>
                <span>{item.day}</span>
                <strong>{item.date}</strong>
                <em>{item.platform}</em>
                <p>{item.title}</p>
                <b>{item.status}</b>
                {(calendarPlan[item.date] || []).map((planned) => (
                  <button
                    key={planned.id}
                    type="button"
                    className="planned-content-chip"
                    onClick={() => setGeneratedContent(planned.generated)}
                  >
                    {planned.title}
                  </button>
                ))}
              </article>
            ))}
          </div>
          {generatedContent && (
            <article className="generated-content-preview">
              <div>
                <span className="eyebrow">자동 생성 콘텐츠</span>
                <h3>{generatedContent.title}</h3>
                <p>{generatedContent.hook}</p>
              </div>
              <ul>
                {generatedContent.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <strong>{generatedContent.cta}</strong>
            </article>
          )}
        </section>
        </>
        )}

        {activeTool !== 'dashboard' && (
        <>
        <section className="hero-dashboard">
          <form className="analysis-form" onSubmit={handleAnalyze}>
            <div className="form-heading">
              <ActiveToolIcon size={21} />
              <div>
                <strong>{activeToolMeta.label}</strong>
                <span>{activeToolMeta.headline}</span>
              </div>
            </div>

            <label>
              <span>{activeToolMeta.urlLabel}</span>
              <div className="input-shell">
                <Link2 size={18} />
                <input value={placeUrl} onChange={(event) => setPlaceUrl(event.target.value)} />
              </div>
            </label>

            <div className="field-grid">
              <label>
                <span>{activeToolMeta.keywordLabel}</span>
                <div className="input-shell">
                  <Search size={18} />
                  <input value={keyword} onChange={(event) => setKeyword(event.target.value)} />
                </div>
              </label>
              <label>
                <span>{activeToolMeta.locationLabel}</span>
                <div className="input-shell">
                  <Store size={18} />
                  <input value={location} onChange={(event) => setLocation(event.target.value)} />
                </div>
              </label>
            </div>

            <div className="quick-tags">
              {activeToolMeta.tags.map((item) => (
                <button key={item} type="button" onClick={() => setKeyword(item)}>
                  {item}
                </button>
              ))}
            </div>

            <button className="analyze-button" type="submit">
              <RefreshCw size={18} className={isAnalyzed ? '' : 'spin'} />
              분석 업데이트
            </button>
          </form>

          <div className="insight-board">
            <div className="metric-card primary">
              <span>{activeToolMeta.primaryMetric}</span>
              <strong>{activeTool === 'combo' || activeTool === 'auto' ? `${analysis.hidden * 3}개` : `${analysis.rank}위`}</strong>
              <p>{activeToolMeta.headline}</p>
            </div>
            <div className="metric-card">
              <Gauge size={20} />
              <span>노출 점수</span>
              <strong>{analysis.score}</strong>
            </div>
            <div className="metric-card">
              <ListChecks size={20} />
              <span>히든 키워드</span>
              <strong>{analysis.hidden}개</strong>
            </div>
            <div className="metric-card">
              <Activity size={20} />
              <span>월 예상 노출</span>
              <strong>{analysis.exposure.toLocaleString()}</strong>
            </div>
          </div>
        </section>

        <section className="tool-overview" aria-label={`${activeToolMeta.label} 주요 기능`}>
          {activeToolMeta.cards.map((card, index) => (
            <article key={card}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{card}</strong>
              <p>{activeToolMeta.label} 탭에서 바로 확인하고 분석 히스토리에 저장할 수 있습니다.</p>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <div className="rank-panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">{activeToolMeta.tableEyebrow}</span>
                <h2>{activeToolMeta.tableTitle}</h2>
              </div>
              <button type="button" className="ghost-button">
                <CalendarDays size={17} />
                최근 7일
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>키워드</th>
                    <th>오늘</th>
                    <th>변동</th>
                    <th>저장</th>
                    <th>리뷰</th>
                    <th>추적</th>
                  </tr>
                </thead>
                <tbody>
                  {rankRows.map((row) => (
                    <tr key={row.keyword}>
                      <td>
                        <button className="keyword-cell" type="button" onClick={() => setKeyword(row.keyword)}>
                          {row.keyword}
                        </button>
                      </td>
                      <td>{row.today}위</td>
                      <td className={row.today < row.yesterday ? 'positive' : 'negative'}>
                        {row.today < row.yesterday ? '+' : '-'}
                        {Math.abs(row.yesterday - row.today)}
                      </td>
                      <td>{row.save}</td>
                      <td>{row.blog.toLocaleString()}</td>
                      <td>
                        <button
                          type="button"
                          className={selectedRows.includes(row.keyword) ? 'check-button checked' : 'check-button'}
                          onClick={() => toggleRow(row.keyword)}
                          aria-label={`${row.keyword} 추적`}
                        >
                          <ClipboardCheck size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="trend-panel">
            <div className="section-header compact">
              <div>
                <span className="eyebrow">{activeToolMeta.trendTitle}</span>
                <h2>7일 변화</h2>
              </div>
              <TrendingUp size={22} />
            </div>
            <div className="chart">
              {[58, 44, 51, 36, 42, 31, 26].map((height, index) => (
                <div className="bar-column" key={dates[index]}>
                  <span style={{ height: `${Math.max(18, height - analysis.rank)}%` }} />
                  <em>{dates[index]}</em>
                </div>
              ))}
            </div>
            <div className="trend-note">
              <strong>{keyword}</strong>
              <span>{activeToolMeta.trendNote}</span>
            </div>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="tracker-panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">자동 모니터링</span>
                <h2>진행 중인 추적</h2>
              </div>
              <button type="button" className="icon-button" aria-label="추적 새로고침" onClick={refreshTracking}>
                <RefreshCw size={18} />
              </button>
            </div>
            <div className="tracked-list">
              {trackedItems.map((item) => (
                <article key={item.id} className="tracked-item">
                  <div className={`status-dot ${item.color}`} />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.channel}</span>
                  </div>
                  <em>{item.status}</em>
                  <b>{item.change}</b>
                </article>
              ))}
            </div>
          </div>

          <div className="combo-panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">키워드 조합기</span>
                <h2>즉시 생성 결과</h2>
              </div>
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  navigator.clipboard.writeText(combinations.join('\n'))
                  showToast('키워드 목록을 복사했습니다.')
                }}
              >
                <Combine size={17} />
                복사
              </button>
            </div>
            <div className="combo-list">
              {combinations.map((item) => (
                <button key={item} type="button" onClick={() => setKeyword(item)}>
                  {item}
                </button>
              ))}
            </div>

            <div className="history-list">
              <span className="eyebrow">분석 히스토리</span>
              {history.length === 0 ? (
                <p>분석 업데이트를 누르면 기록이 저장됩니다.</p>
              ) : (
                history.slice(0, 4).map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      if (item.toolId) {
                        setActiveTool(item.toolId)
                      }
                      setKeyword(item.keyword)
                      setLocation(item.location)
                      setPlaceUrl(item.placeUrl)
                      setAnalysis(item.analysis)
                    }}
                  >
                    <strong>{item.keyword}</strong>
                    <span>{new Date(item.analysis.createdAt).toLocaleString('ko-KR')}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>
        </>
        )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
