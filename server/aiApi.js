const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'

function getOpenAiConfig() {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini'

  if (!apiKey) {
    return null
  }

  return { apiKey, model }
}

function extractResponseText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim()
  }

  const textParts = []
  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (content?.type === 'output_text' && content?.text) {
        textParts.push(content.text)
      }
    }
  }

  return textParts.join('\n').trim()
}

function buildBlogWriterPrompt(payload) {
  const keywordInsight = payload.keywordInsight ?? {}
  const related = Array.isArray(keywordInsight.related) ? keywordInsight.related.slice(0, 8).join(', ') : ''
  const contentPlan = Array.isArray(keywordInsight.contentPlan) ? keywordInsight.contentPlan.slice(0, 6).join('\n- ') : ''
  const hashtags = Array.isArray(payload.hashtags) ? payload.hashtags.join(' ') : ''

  return `다음 조건으로 네이버 블로그 SEO에 맞는 완성형 한국어 블로그 글을 작성해줘.

[작성 조건]
- 글 타입: ${payload.type || '정보형 글'}
- 제목: ${payload.title || `${payload.keyword} ${payload.type || ''}`.trim()}
- 핵심 키워드: ${payload.keyword || '대표 키워드'}
- 목표 글자 수: 약 ${payload.length || 1500}자
- 글 스타일: ${payload.style || '친근한 설명체'}
- 강조 내용: ${payload.emphasis || '실제 독자가 선택할 때 필요한 기준'}
- 첨부 이미지 수: ${payload.imageCount || 0}장

[키워드 인사이트]
- 월 검색량: ${keywordInsight.monthly ?? '알 수 없음'}
- 블로그 문서량: ${keywordInsight.blogDocs ?? '알 수 없음'}
- 난이도: ${keywordInsight.difficulty ?? '알 수 없음'}
- 연관 키워드: ${related || '없음'}
- 추천 해시태그: ${hashtags || '자동 생성'}
- 콘텐츠 체크포인트:
- ${contentPlan || '제목 첫 부분에 핵심 키워드와 의도 키워드를 자연스럽게 배치'}

[작성 규칙]
1. 초안이 아니라 바로 게시 가능한 완성형 본문으로 작성한다.
2. 실제 방문/구매/시술 경험이 없는 내용은 단정하지 말고, 사용자가 사진과 정보를 넣어 완성할 수 있게 자연스러운 자리표시 문장을 넣는다.
3. 제목, 첫 문단, 소제목, 이미지 설명, 마무리 CTA까지 포함한다.
4. 키워드는 과도하게 반복하지 말고 자연스럽게 분산한다.
5. 네이버 상위노출을 보장한다는 표현은 쓰지 않는다. 대신 검색 의도 충족, 체류 시간, 정보성, 설득 구조 중심으로 작성한다.
6. 글의 흐름에 맞는 이미지 배치 추천을 본문 중간에 [이미지 배치 추천] 형식으로 넣는다.
7. 마지막에는 추천 해시태그를 포함한다.

출력은 블로그에 바로 붙여넣을 수 있는 본문만 작성해줘.`
}

export function getAiApiStatus() {
  return {
    openai: Boolean(getOpenAiConfig()),
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
  }
}

export async function generateBlogWriterArticle(payload) {
  const config = getOpenAiConfig()

  if (!config) {
    const error = new Error('OPENAI_API_KEY가 설정되어 있지 않습니다.')
    error.status = 503
    throw error
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      input: buildBlogWriterPrompt(payload),
      max_output_tokens: 4500,
      text: {
        format: { type: 'text' },
      },
    }),
  })

  const body = await response.text()
  let data

  try {
    data = body ? JSON.parse(body) : null
  } catch {
    data = { raw: body }
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.message || data?.raw || `OpenAI API HTTP ${response.status}`
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  const article = extractResponseText(data)
  if (!article) {
    const error = new Error('AI 응답에서 글 본문을 찾지 못했습니다.')
    error.status = 502
    error.data = data
    throw error
  }

  return {
    article,
    model: config.model,
    source: 'openai',
  }
}
