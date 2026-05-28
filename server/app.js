import cors from 'cors'
import express from 'express'
import { generateBlogWriterArticle, getAiApiStatus } from './aiApi.js'
import { buildKakaoErrorRedirect, buildKakaoLoginUrl, buildKakaoSuccessRedirect, completeKakaoLogin, getKakaoAuthStatus } from './kakaoAuth.js'
import { analyzeCompetitorBlogLinks, analyzeProductLink, analyzeYoutubeLink, getNaverApiStatus, getNaverKeywordInsight } from './naverApi.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

function readCookie(req, name) {
  const cookies = String(req.headers.cookie || '')
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)

  const match = cookies.find((item) => item.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : ''
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'mabu-api' })
})

app.get('/api/naver/status', (req, res) => {
  res.json(getNaverApiStatus())
})

app.get('/api/ai/status', (req, res) => {
  res.json(getAiApiStatus())
})

app.get('/api/auth/kakao/status', (req, res) => {
  res.json(getKakaoAuthStatus())
})

app.get('/api/auth/kakao/login', (req, res) => {
  try {
    const { state, url } = buildKakaoLoginUrl(req)
    res.cookie('mabu_kakao_state', state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: req.secure || req.get('x-forwarded-proto') === 'https',
      maxAge: 10 * 60 * 1000,
    })
    res.redirect(url)
  } catch (error) {
    res.redirect(buildKakaoErrorRedirect(error.message || '카카오 로그인을 시작하지 못했습니다.'))
  }
})

app.get('/api/auth/kakao/callback', async (req, res) => {
  try {
    if (req.query.error) {
      const errorDescription = String(req.query.error_description || req.query.error || '카카오 로그인이 취소되었습니다.')
      const error = new Error(errorDescription)
      error.status = 400
      throw error
    }

    const state = String(req.query.state ?? '')
    const savedState = readCookie(req, 'mabu_kakao_state')
    if (savedState && state && savedState !== state) {
      const error = new Error('카카오 로그인 상태 검증에 실패했습니다.')
      error.status = 400
      throw error
    }

    const user = await completeKakaoLogin({ code: String(req.query.code ?? ''), req })
    res.clearCookie('mabu_kakao_state')
    res.redirect(buildKakaoSuccessRedirect(user))
  } catch (error) {
    res.redirect(buildKakaoErrorRedirect(error.message || '카카오 로그인에 실패했습니다.'))
  }
})

app.get('/api/naver/keyword', async (req, res) => {
  try {
    const keyword = String(req.query.keyword ?? '')
    const insight = await getNaverKeywordInsight(keyword)
    res.json(insight)
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || '네이버 API 요청에 실패했습니다.',
      detail: error.data ?? null,
    })
  }
})

app.post('/api/blog/planner-insights', async (req, res) => {
  try {
    const links = Array.isArray(req.body?.links) ? req.body.links : []
    const result = await analyzeCompetitorBlogLinks(links)
    res.json(result)
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || '경쟁 블로그 분석에 실패했습니다.',
      detail: error.data ?? null,
    })
  }
})

app.post('/api/blog/write', async (req, res) => {
  try {
    const result = await generateBlogWriterArticle(req.body ?? {})
    res.json(result)
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'AI 글 생성에 실패했습니다.',
      detail: error.data ?? null,
    })
  }
})

app.post('/api/product/insights', async (req, res) => {
  try {
    const productUrl = String(req.body?.url ?? '')
    const result = await analyzeProductLink(productUrl)
    res.json(result)
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || '제품 링크 분석에 실패했습니다.',
      detail: error.data ?? null,
    })
  }
})

app.post('/api/youtube/insights', async (req, res) => {
  try {
    const youtubeUrl = String(req.body?.url ?? '')
    const result = await analyzeYoutubeLink(youtubeUrl)
    res.json(result)
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || '유튜브 영상 분석에 실패했습니다.',
      detail: error.data ?? null,
    })
  }
})

export default app
