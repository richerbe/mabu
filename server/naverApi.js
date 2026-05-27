import crypto from 'node:crypto'

const NAVER_OPEN_API_BASE = 'https://openapi.naver.com/v1'
const NAVER_SEARCHAD_BASE = 'https://api.searchad.naver.com'

function getOpenApiHeaders() {
  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return null
  }

  return {
    'X-Naver-Client-Id': clientId,
    'X-Naver-Client-Secret': clientSecret,
  }
}

function getSearchAdConfig() {
  const apiKey = process.env.NAVER_SEARCHAD_API_KEY
  const secretKey = process.env.NAVER_SEARCHAD_SECRET_KEY
  const customerId = process.env.NAVER_SEARCHAD_CUSTOMER_ID

  if (!apiKey || !secretKey || !customerId) {
    return null
  }

  return { apiKey, secretKey, customerId }
}

function parseCount(value) {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/[^\d]/g, '')
    return normalized ? Number(normalized) : 0
  }

  return 0
}

function stripHtml(value = '') {
  return value.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options)
  const body = await response.text()
  let data

  try {
    data = body ? JSON.parse(body) : null
  } catch {
    data = { raw: body }
  }

  if (!response.ok) {
    const message = data?.errorMessage || data?.message || data?.raw || `HTTP ${response.status}`
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

async function requestText(url, options = {}) {
  const response = await fetch(url, options)
  const body = await response.text()

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`)
    error.status = response.status
    error.data = body
    throw error
  }

  return body
}

function decodeHtml(value = '') {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractMetaContent(html, key) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["']`, 'i'),
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) {
      return decodeHtml(match[1])
    }
  }

  return ''
}

function extractBlogPageSummary(html, url) {
  const ogTitle = extractMetaContent(html, 'og:title')
  const ogDescription = extractMetaContent(html, 'og:description')
  const metaDescription = extractMetaContent(html, 'description')
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
  const title = ogTitle || decodeHtml(titleMatch?.[1] || '')
  const description = ogDescription || metaDescription

  return {
    url,
    title: title || '제목 추출 실패',
    description,
  }
}

function extractGenericPageSummary(html, url) {
  const ogTitle = extractMetaContent(html, 'og:title')
  const ogDescription = extractMetaContent(html, 'og:description')
  const ogImage = extractMetaContent(html, 'og:image')
  const metaDescription = extractMetaContent(html, 'description')
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
  const title = ogTitle || decodeHtml(titleMatch?.[1] || '')
  const description = ogDescription || metaDescription

  return {
    url,
    title: title || '상품명 추출 실패',
    description,
    image: ogImage,
  }
}

const TOKEN_STOPWORDS = new Set([
  'naver',
  'blog',
  'com',
  'https',
  'home',
  'post',
  'view',
  'the',
  'with',
  'this',
  'that',
  '있는',
  '하는',
  '그리고',
  '정리',
  '후기',
  '추천',
  '리뷰',
  '방법',
  '정보',
  '가이드',
  '공유',
  '기록',
  '이야기',
  '블로그',
  '콘텐츠',
  '오늘',
  '이번',
  '정말',
  '너무',
  '위해',
  '대한',
  '경쟁',
])

function tokenizeKoreanText(text) {
  return (text.match(/[가-힣A-Za-z0-9]{2,}/g) ?? [])
    .map((token) => token.toLowerCase())
    .filter((token) => !TOKEN_STOPWORDS.has(token))
}

function countTokens(items) {
  const counter = new Map()

  items.forEach((item) => {
    tokenizeKoreanText(item).forEach((token) => {
      counter.set(token, (counter.get(token) ?? 0) + 1)
    })
  })

  return [...counter.entries()].sort((a, b) => b[1] - a[1])
}

function humanizeToken(token) {
  if (/^[a-z0-9]+$/.test(token)) {
    return token.toUpperCase()
  }

  return token
}

function cleanProductTitle(title) {
  return title
    .replace(/\s*\|.*$/, '')
    .replace(/\s*-\s*.*$/, '')
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function inferBlogTopic(keyword, rankedTokens) {
  const joined = rankedTokens.map(([token]) => token).join(' ')

  if (/(맛집|카페|메뉴|식당|디저트|점심|저녁)/.test(joined)) {
    return '맛집 리뷰'
  }

  if (/(피부|병원|의원|치과|시술|관리)/.test(joined)) {
    return '병원/시술 정보'
  }

  if (/(여행|호텔|숙소|펜션|코스|관광)/.test(joined)) {
    return '여행 후기'
  }

  if (/(상품|구매|가격|비교|가전|화장품|추천템)/.test(joined)) {
    return '제품 리뷰'
  }

  if (/(운동|다이어트|헬스|필라테스|요가)/.test(joined)) {
    return '건강/운동 정보'
  }

  return `${keyword} 정보형 콘텐츠`
}

const INTENT_MARKERS = ['맛집', '카페', '병원', '후기', '추천', '리뷰', '가격', '비교', '예약']

function inferPrimaryKeywordFromPages(pages, rankedTokens) {
  if (rankedTokens.length === 0) {
    return '대표 키워드'
  }

  const titleTokens = pages
    .map((page) => tokenizeKoreanText(page.title))
    .filter((tokens) => tokens.length > 0)
  const repeatedTokenSet = new Set(rankedTokens.filter(([, count]) => count >= 2).map(([token]) => token))
  let locationToken = ''
  let itemToken = ''
  let intentToken = ''

  titleTokens.forEach((tokens) => {
    const markerIndex = tokens.findIndex((token) => INTENT_MARKERS.includes(token))
    if (markerIndex >= 0 && !intentToken) {
      intentToken = tokens[markerIndex]
    }
    if (markerIndex > 0 && !itemToken) {
      itemToken = tokens[markerIndex - 1]
    }
    if (markerIndex > 1 && !locationToken) {
      locationToken = tokens[0]
    }
  })

  if (!itemToken) {
    itemToken =
      rankedTokens.find(([token]) => repeatedTokenSet.has(token) && !INTENT_MARKERS.includes(token))?.[0] ??
      rankedTokens[0][0]
  }

  if (!intentToken) {
    intentToken = rankedTokens.find(([token]) => INTENT_MARKERS.includes(token))?.[0] ?? ''
  }

  const parts = [locationToken, itemToken, intentToken]
    .filter(Boolean)
    .slice(0, 3)
    .map((token) => humanizeToken(token))

  return [...new Set(parts)].join(' ')
}

const LABLOG_STYLE_GRADE_SCALE = [
  { label: '최적4+', min: 90, max: 100, band: '최적+ 등급', description: '상위노출 경쟁력이 매우 강한 단계' },
  { label: '최적3+', min: 85, max: 89, band: '최적+ 등급', description: '검색 반응과 콘텐츠 신뢰가 매우 높은 단계' },
  { label: '최적2+', min: 80, max: 84, band: '최적+ 등급', description: '상위권 진입 가능성이 높은 우수 단계' },
  { label: '최적1+', min: 75, max: 79, band: '최적+ 등급', description: '안정적으로 키워드를 공략할 수 있는 단계' },
  { label: '최적3', min: 70, max: 74, band: '최적 등급', description: '주요 키워드에서 강한 성과를 기대할 수 있는 단계' },
  { label: '최적2', min: 65, max: 69, band: '최적 등급', description: '성장 탄력이 붙은 최적화 단계' },
  { label: '최적1', min: 60, max: 64, band: '최적 등급', description: '상위노출 기반이 갖춰진 단계' },
  { label: '준최적7', min: 55, max: 59, band: '준최적 등급', description: '최적권 바로 아래의 강한 성장 단계' },
  { label: '준최적6', min: 50, max: 54, band: '준최적 등급', description: '꾸준함과 주제 집중이 잘 보이는 단계' },
  { label: '준최적5', min: 45, max: 49, band: '준최적 등급', description: '반응과 발행 리듬이 안정화되는 단계' },
  { label: '준최적4', min: 40, max: 44, band: '준최적 등급', description: '검색 노출 기반이 점차 잡히는 단계' },
  { label: '준최적3', min: 35, max: 39, band: '준최적 등급', description: '주제 일관성과 콘텐츠 축적이 필요한 단계' },
  { label: '준최적2', min: 30, max: 34, band: '준최적 등급', description: '기초 세팅은 되었지만 신호가 약한 단계' },
  { label: '준최적1', min: 25, max: 29, band: '준최적 등급', description: '발행량과 구조화가 더 필요한 단계' },
  { label: '일반', min: 0, max: 24, band: '일반 등급', description: '아직 초기 운영 패턴이 강한 단계' },
]

function clampNumber(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

function average(numbers) {
  if (!numbers.length) {
    return 0
  }

  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length
}

function resolveLablogStyleGrade(score) {
  const tier = LABLOG_STYLE_GRADE_SCALE.find((item) => score >= item.min) ?? LABLOG_STYLE_GRADE_SCALE.at(-1)
  const rangeLabel = tier.max >= 100 ? `${tier.min}점 이상` : `${tier.min}-${tier.max}점`

  return {
    ...tier,
    rangeLabel,
  }
}

function extractBlogIdentity(url) {
  try {
    const parsed = new URL(url)
    const pathParts = parsed.pathname.split('/').filter(Boolean)
    const isNaverBlog = /(^|\.)blog\.naver\.com$/i.test(parsed.hostname)
    const blogId = isNaverBlog ? pathParts[0] || parsed.hostname.split('.')[0] : pathParts[0] || parsed.hostname.replace(/^www\./, '')
    const provider = isNaverBlog ? 'naver-blog' : parsed.hostname.replace(/^www\./, '')
    const homeUrl = isNaverBlog ? `https://blog.naver.com/${blogId}` : `${parsed.protocol}//${parsed.hostname}/${blogId}`

    return {
      provider,
      blogId,
      homeUrl,
      hostname: parsed.hostname.replace(/^www\./, ''),
      displayName: blogId || parsed.hostname.replace(/^www\./, ''),
    }
  } catch {
    return {
      provider: 'unknown',
      blogId: url,
      homeUrl: url,
      hostname: '',
      displayName: url,
    }
  }
}

function isSameBlog(topBlog, identity) {
  const candidates = [topBlog.link, topBlog.bloggerlink].filter(Boolean).join(' ').toLowerCase()
  return [identity.blogId, identity.homeUrl, identity.hostname].filter(Boolean).some((item) => candidates.includes(String(item).toLowerCase()))
}

function buildLablogStyleIndex(identity, pages, keyword, keywordInsight) {
  const rankedTokens = countTokens(pages.flatMap((page) => [page.title, page.description]))
  const keywordTokens = tokenizeKoreanText(keyword).slice(0, 3)
  const titleKeywordHits = pages.filter((page) => keywordTokens.some((token) => page.title.toLowerCase().includes(token))).length
  const titleMatchRate = pages.length ? titleKeywordHits / pages.length : 0
  const topTokenStrength = rankedTokens[0]?.[1] ?? 0
  const avgTitleLength = average(pages.map((page) => page.title.length))
  const avgDescriptionLength = average(pages.map((page) => page.description.length))
  const topBlogIndex = keywordInsight?.topBlogs?.findIndex((item) => isSameBlog(item, identity)) ?? -1
  const repeatedTokenScore = clampNumber(Math.round((topTokenStrength / Math.max(1, pages.length)) * 28))
  const consistencyScore = clampNumber(Math.round(titleMatchRate * 62 + repeatedTokenScore))
  const contentDepthScore = clampNumber(Math.round(avgTitleLength * 1.8 + avgDescriptionLength * 0.45 + Math.min(18, pages.length * 6)))
  const searchPresenceScore = clampNumber(
    Math.round((topBlogIndex >= 0 ? 78 - topBlogIndex * 9 : 30) + Math.min(12, pages.length * 3) + (keywordInsight?.chance ?? 38) * 0.16),
  )
  const trustScore = clampNumber(
    Math.round(consistencyScore * 0.34 + contentDepthScore * 0.26 + searchPresenceScore * 0.4 + (identity.provider === 'naver-blog' ? 4 : 0)),
  )
  const grade = resolveLablogStyleGrade(trustScore)

  return {
    ...identity,
    pageCount: pages.length,
    score: trustScore,
    grade: grade.label,
    gradeBand: grade.band,
    gradeRange: grade.rangeLabel,
    note: grade.description,
    metrics: [
      {
        label: '주제 일관성',
        value: consistencyScore,
        note: `${pages.length}개 링크 중 ${titleKeywordHits}개가 핵심 키워드 패턴과 맞닿아 있습니다.`,
      },
      {
        label: '콘텐츠 밀도',
        value: contentDepthScore,
        note: `제목 평균 ${Math.round(avgTitleLength)}자, 설명 평균 ${Math.round(avgDescriptionLength)}자 기준입니다.`,
      },
      {
        label: '검색 존재감',
        value: searchPresenceScore,
        note: topBlogIndex >= 0 ? `네이버 상위 블로그 결과 ${topBlogIndex + 1}위권에서 같은 블로그 신호가 감지됐습니다.` : '현재 상위 블로그 결과에서는 직접 일치 신호가 약합니다.',
      },
    ],
    actions: [
      `${keyword} 키워드가 제목 첫 부분에 더 자주 보이도록 제목 패턴을 통일하세요.`,
      '리뷰형 글만 반복하지 말고 비교, 가격, 체크리스트형 글을 함께 묶어 클러스터를 만드세요.',
      topBlogIndex >= 0 ? '이미 상위노출 신호가 있으니 같은 주제의 연관 키워드를 확장해 권위를 넓히세요.' : '상위노출 글의 제목 구조와 본문 질문형 소제목을 참고해 첫 3문단을 더 선명하게 다듬으세요.',
    ],
  }
}

function buildAggregateLablogStyleIndex(items) {
  if (items.length === 0) {
    return null
  }

  const totalPages = items.reduce((sum, item) => sum + item.pageCount, 0)
  const weightedScore = Math.round(items.reduce((sum, item) => sum + item.score * item.pageCount, 0) / Math.max(1, totalPages))
  const grade = resolveLablogStyleGrade(weightedScore)
  const averageConsistency = Math.round(average(items.map((item) => item.metrics[0].value)))
  const averageDepth = Math.round(average(items.map((item) => item.metrics[1].value)))
  const averagePresence = Math.round(average(items.map((item) => item.metrics[2].value)))

  return {
    score: weightedScore,
    grade: grade.label,
    gradeBand: grade.band,
    gradeRange: grade.rangeLabel,
    note: grade.description,
    metrics: [
      { label: '주제 일관성', value: averageConsistency, note: '링크들의 제목 패턴과 핵심 토큰 반복도를 종합했습니다.' },
      { label: '콘텐츠 밀도', value: averageDepth, note: '제목/설명 정보량과 수집 링크 깊이를 반영했습니다.' },
      { label: '검색 존재감', value: averagePresence, note: '네이버 블로그 검색 상위 결과 일치 여부를 함께 봤습니다.' },
    ],
    actions: [
      '등급은 블연플 스타일 15단계 범위를 따르되, 점수는 수집 링크와 검색 신호 기반 추정값입니다.',
      '경쟁 블로그가 높은 등급일수록 같은 키워드보다는 하위 의도 키워드와 비교형 제목으로 우회 공략하는 것이 좋습니다.',
      '한 블로그에서 상위노출 흔적이 반복되면 그 블로그의 제목 길이, 후기 구조, CTA 배치를 벤치마킹하세요.',
    ],
  }
}

export async function analyzeCompetitorBlogLinks(links) {
  const normalizedLinks = links.map((link) => String(link).trim()).filter(Boolean).slice(0, 10)

  if (normalizedLinks.length === 0) {
    const error = new Error('블로그 링크를 1개 이상 입력해 주세요.')
    error.status = 400
    throw error
  }

  const pages = await Promise.all(
    normalizedLinks.map(async (url) => {
      try {
        const html = await requestText(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          },
        })
        return extractBlogPageSummary(html, url)
      } catch {
        return {
          url,
          title: decodeURIComponent(url.split('/').filter(Boolean).at(-1) ?? url),
          description: '',
        }
      }
    }),
  )

  const rankedTokens = countTokens(pages.flatMap((page) => [page.title, page.description]))
  const keyword = inferPrimaryKeywordFromPages(pages, rankedTokens)
  const topic = inferBlogTopic(keyword, rankedTokens)
  const titlePatterns = pages.map((page) => page.title).filter(Boolean).slice(0, 5)
  const keywordInsight = await getNaverKeywordInsight(keyword)
  const groupedBlogs = new Map()

  pages.forEach((page) => {
    const identity = extractBlogIdentity(page.url)
    const groupKey = `${identity.provider}:${identity.blogId}`
    const current = groupedBlogs.get(groupKey) ?? { identity, pages: [] }
    current.pages.push(page)
    groupedBlogs.set(groupKey, current)
  })

  const competitorIndexList = [...groupedBlogs.values()]
    .map(({ identity, pages: groupPages }) => buildLablogStyleIndex(identity, groupPages, keyword, keywordInsight))
    .sort((a, b) => b.score - a.score)
  const aggregateIndex = buildAggregateLablogStyleIndex(competitorIndexList)

  return {
    keyword,
    topic,
    titlePatterns,
    competitorSummaries: pages,
    keywordInsight,
    blogIndex: aggregateIndex,
    competitorIndexList,
    gradeScale: LABLOG_STYLE_GRADE_SCALE.map((item) => ({
      label: item.label,
      band: item.band,
      rangeLabel: item.max >= 100 ? `${item.min}점 이상` : `${item.min}-${item.max}점`,
      description: item.description,
    })),
    tokenInsights: rankedTokens.slice(0, 8).map(([token, count]) => ({
      token: humanizeToken(token),
      count,
    })),
  }
}

export async function analyzeProductLink(productUrl) {
  const url = String(productUrl || '').trim()

  if (!url) {
    const error = new Error('제품 링크를 입력해 주세요.')
    error.status = 400
    throw error
  }

  const html = await requestText(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
  })

  const page = extractGenericPageSummary(html, url)
  const productName = cleanProductTitle(page.title)
  const rankedTokens = countTokens([productName, page.description])
  const keyword = inferPrimaryKeywordFromPages([{ title: productName, description: page.description }], rankedTokens)
  const topic = inferBlogTopic(keyword, rankedTokens)
  const keywordInsight = await getNaverKeywordInsight(keyword)

  return {
    url,
    productName,
    description: page.description,
    image: page.image,
    keyword,
    topic,
    keywordInsight,
    tokenInsights: rankedTokens.slice(0, 8).map(([token, count]) => ({
      token: humanizeToken(token),
      count,
    })),
  }
}

function extractYoutubeVideoId(videoUrl) {
  try {
    const parsed = new URL(videoUrl)
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.split('/').filter(Boolean)[0] ?? ''
    }

    if (parsed.searchParams.get('v')) {
      return parsed.searchParams.get('v')
    }

    const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/)
    if (shortsMatch?.[1]) {
      return shortsMatch[1]
    }

    const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/)
    return embedMatch?.[1] ?? ''
  } catch {
    return ''
  }
}

export async function analyzeYoutubeLink(videoUrl) {
  const url = String(videoUrl || '').trim()

  if (!url) {
    const error = new Error('유튜브 영상 링크를 입력해 주세요.')
    error.status = 400
    throw error
  }

  const videoId = extractYoutubeVideoId(url)
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : url
  let oembed = null
  let html = ''

  try {
    oembed = await requestJson(`https://www.youtube.com/oembed?${new URLSearchParams({ url: watchUrl, format: 'json' })}`)
  } catch {
    oembed = null
  }

  try {
    html = await requestText(watchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    })
  } catch {
    html = ''
  }

  const ogTitle = html ? extractMetaContent(html, 'og:title') : ''
  const ogDescription = html ? extractMetaContent(html, 'og:description') : ''
  const metaKeywords = html ? extractMetaContent(html, 'keywords') : ''
  const title = oembed?.title || ogTitle || decodeURIComponent(url.split('/').filter(Boolean).at(-1) ?? '유튜브 영상')
  const author = oembed?.author_name || 'YouTube Creator'
  const thumbnail = oembed?.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '')
  const tags = metaKeywords
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10)
  const rankedTokens = countTokens([title, ogDescription, tags.join(' ')])
  const keyword = inferPrimaryKeywordFromPages([{ title, description: ogDescription }], rankedTokens)
  const topic = inferBlogTopic(keyword, rankedTokens)

  return {
    url: watchUrl,
    videoId,
    title,
    author,
    authorUrl: oembed?.author_url || '',
    thumbnail,
    description: ogDescription,
    tags,
    keyword,
    topic,
    tokenInsights: rankedTokens.slice(0, 8).map(([token, count]) => ({
      token: humanizeToken(token),
      count,
    })),
  }
}

async function naverSearch(type, query, options = {}) {
  const headers = getOpenApiHeaders()

  if (!headers) {
    return { configured: false, total: null, items: [] }
  }

  const params = new URLSearchParams({
    query,
    display: String(options.display ?? 10),
    start: String(options.start ?? 1),
    sort: options.sort ?? 'sim',
  })

  const data = await requestJson(`${NAVER_OPEN_API_BASE}/search/${type}.json?${params}`, { headers })

  return {
    configured: true,
    total: data.total ?? 0,
    items: (data.items ?? []).map((item) => ({
      title: stripHtml(item.title),
      description: stripHtml(item.description),
      link: item.link,
      bloggername: item.bloggername,
      bloggerlink: item.bloggerlink,
      postdate: item.postdate,
    })),
  }
}

async function naverDatalabTrend(keyword) {
  const headers = getOpenApiHeaders()

  if (!headers) {
    return { configured: false, data: [] }
  }

  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - 12)
  const format = (date) => date.toISOString().slice(0, 10)

  const data = await requestJson(`${NAVER_OPEN_API_BASE}/datalab/search`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate: format(start),
      endDate: format(end),
      timeUnit: 'month',
      keywordGroups: [
        {
          groupName: keyword,
          keywords: [keyword],
        },
      ],
    }),
  })

  return {
    configured: true,
    data: data.results?.[0]?.data ?? [],
  }
}

async function naverSearchAdKeyword(keyword) {
  const config = getSearchAdConfig()

  if (!config) {
    return { configured: false, exact: null, related: [] }
  }

  const uri = '/keywordstool'
  const method = 'GET'
  const timestamp = Date.now().toString()
  const signature = crypto
    .createHmac('sha256', config.secretKey)
    .update(`${timestamp}.${method}.${uri}`)
    .digest('base64')
  const params = new URLSearchParams({
    hintKeywords: keyword.replace(/\s+/g, ''),
    showDetail: '1',
  })

  const data = await requestJson(`${NAVER_SEARCHAD_BASE}${uri}?${params}`, {
    headers: {
      'X-Timestamp': timestamp,
      'X-API-KEY': config.apiKey,
      'X-Customer': config.customerId,
      'X-Signature': signature,
    },
  })

  const related = data.keywordList ?? []
  const normalizedKeyword = keyword.replace(/\s+/g, '').toLowerCase()
  const exact =
    related.find((item) => item.relKeyword?.replace(/\s+/g, '').toLowerCase() === normalizedKeyword) ??
    related[0] ??
    null

  return {
    configured: true,
    exact,
    related: related.slice(0, 12),
  }
}

function buildRelatedKeywords(keyword, searchAdRelated) {
  if (searchAdRelated?.length) {
    return searchAdRelated.map((item) => item.relKeyword).filter(Boolean).slice(0, 8)
  }

  return [
    `${keyword} 추천`,
    `${keyword} 후기`,
    `${keyword} 가격`,
    `${keyword} 예약`,
    `${keyword} 주차`,
    `${keyword} 내돈내산`,
    `${keyword} 비교`,
    `${keyword} 위치`,
  ]
}

export async function getNaverKeywordInsight(keyword) {
  const primary = keyword.trim()

  if (!primary) {
    const error = new Error('키워드를 입력해 주세요.')
    error.status = 400
    throw error
  }

  const [blog, cafe, kin, web, trend, searchAd] = await Promise.allSettled([
    naverSearch('blog', primary, { display: 10, sort: 'sim' }),
    naverSearch('cafearticle', primary, { display: 5, sort: 'sim' }),
    naverSearch('kin', primary, { display: 5, sort: 'sim' }),
    naverSearch('webkr', primary, { display: 5, sort: 'sim' }),
    naverDatalabTrend(primary),
    naverSearchAdKeyword(primary),
  ])

  const pick = (settled, fallback) => (settled.status === 'fulfilled' ? settled.value : fallback)
  const blogData = pick(blog, { configured: Boolean(getOpenApiHeaders()), total: 0, items: [] })
  const cafeData = pick(cafe, { configured: Boolean(getOpenApiHeaders()), total: 0, items: [] })
  const kinData = pick(kin, { configured: Boolean(getOpenApiHeaders()), total: 0, items: [] })
  const webData = pick(web, { configured: Boolean(getOpenApiHeaders()), total: 0, items: [] })
  const trendData = pick(trend, { configured: Boolean(getOpenApiHeaders()), data: [] })
  const searchAdData = pick(searchAd, { configured: Boolean(getSearchAdConfig()), exact: null, related: [] })

  const monthlyPc = parseCount(searchAdData.exact?.monthlyPcQcCnt)
  const monthlyMobile = parseCount(searchAdData.exact?.monthlyMobileQcCnt)
  const monthly = monthlyPc + monthlyMobile
  const blogDocs = blogData.total ?? 0
  const cafeDocs = cafeData.total ?? 0
  const kinDocs = kinData.total ?? 0
  const webDocs = webData.total ?? 0
  const competitionBase = monthly > 0 ? (blogDocs + cafeDocs * 0.35 + kinDocs * 0.25) / monthly : blogDocs / 1000
  const competition = Math.max(8, Math.min(98, Math.round(competitionBase * 8)))
  const chance = Math.max(7, Math.min(92, 100 - competition))
  const difficulty = competition > 78 ? '높음' : competition > 52 ? '보통' : '낮음'
  const latestTrend = trendData.data.at(-1)?.ratio ?? null
  const trendDirection =
    trendData.data.length >= 2 && trendData.data.at(-1).ratio > trendData.data.at(-2).ratio
      ? '상승'
      : trendData.data.length >= 2 && trendData.data.at(-1).ratio < trendData.data.at(-2).ratio
        ? '하락'
        : '유지'

  return {
    primary,
    source: {
      openApi: blogData.configured,
      datalab: trendData.configured,
      searchAd: searchAdData.configured,
    },
    monthly: monthly || null,
    mobile: monthlyMobile || null,
    pc: monthlyPc || null,
    blogDocs,
    cafeDocs,
    kinDocs,
    webDocs,
    competition,
    chance,
    difficulty,
    latestTrend,
    trendDirection,
    trend: trendData.data,
    topBlogs: blogData.items.slice(0, 5),
    related: buildRelatedKeywords(primary, searchAdData.related),
    serp: [
      {
        name: 'VIEW/블로그',
        visible: `${blogDocs.toLocaleString('ko-KR')}개 문서`,
        strength: blogDocs > 100000 ? '강함' : blogDocs > 30000 ? '보통' : '낮음',
        action: '상위 블로그 제목, 발행일, 본문 구조를 비교해 차별화 포인트를 잡으세요.',
      },
      {
        name: '카페',
        visible: `${cafeDocs.toLocaleString('ko-KR')}개 문서`,
        strength: cafeDocs > 30000 ? '강함' : cafeDocs > 8000 ? '보통' : '낮음',
        action: '커뮤니티 질문형 문구를 FAQ 소제목으로 흡수하세요.',
      },
      {
        name: '지식iN',
        visible: `${kinDocs.toLocaleString('ko-KR')}개 문서`,
        strength: kinDocs > 20000 ? '강함' : kinDocs > 5000 ? '보통' : '낮음',
        action: '질문 의도를 반영한 답변형 문단을 본문 중반에 배치하세요.',
      },
      {
        name: '웹문서',
        visible: `${webDocs.toLocaleString('ko-KR')}개 문서`,
        strength: webDocs > 50000 ? '강함' : webDocs > 10000 ? '보통' : '낮음',
        action: '공식 정보, 가격표, 위치 정보처럼 검증 가능한 근거를 추가하세요.',
      },
    ],
    contentPlan: [
      '검색광고 월 검색량과 블로그 문서량의 비율로 경쟁 강도를 판단합니다.',
      '데이터랩 추이가 상승 중이면 발행 주기를 앞당기고, 하락 중이면 롱테일 키워드로 분산하세요.',
      '상위 블로그의 제목 반복어를 그대로 쓰지 말고 실제 경험, 가격, 비교 근거로 바꾸세요.',
      '카페와 지식iN 문서량이 많다면 질문형 소제목과 FAQ 문단을 강화하세요.',
      '마지막 문단에는 저장, 댓글, 예약, 문의 중 하나의 행동을 자연스럽게 연결하세요.',
    ],
    warnings: [
      !blogData.configured && 'NAVER_CLIENT_ID / NAVER_CLIENT_SECRET이 없어 검색 Open API는 비활성입니다.',
      !searchAdData.configured && '검색광고 API 키가 없어 월 검색량은 표시되지 않습니다.',
    ].filter(Boolean),
  }
}

export function getNaverApiStatus() {
  return {
    openApi: Boolean(getOpenApiHeaders()),
    searchAd: Boolean(getSearchAdConfig()),
  }
}
