import 'dotenv/config'
import { generateBlogWriterArticle, getAiApiStatus } from '../../server/aiApi.js'
import { buildKakaoErrorRedirect, buildKakaoLoginUrl, buildKakaoSuccessRedirect, completeKakaoLogin, getKakaoAuthStatus } from '../../server/kakaoAuth.js'
import { analyzeCompetitorBlogLinks, analyzeProductLink, analyzeYoutubeLink, getNaverApiStatus, getNaverKeywordInsight } from '../../server/naverApi.js'

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  }
}

function redirect(location, headers = {}) {
  return {
    statusCode: 302,
    headers: {
      Location: location,
      ...headers,
    },
    body: '',
  }
}

function getOrigin(event) {
  const host = event.headers.host || event.headers.Host || 'mabu-marketing-boost.netlify.app'
  const proto = event.headers['x-forwarded-proto'] || event.headers['X-Forwarded-Proto'] || 'https'
  return `${proto}://${host}`
}

function createRequestLike(event) {
  const origin = getOrigin(event)
  const url = new URL(event.rawUrl || `${origin}${event.path}`)
  return {
    headers: event.headers,
    protocol: url.protocol.replace(':', ''),
    get(name) {
      return event.headers[name.toLowerCase()] || event.headers[name] || ''
    },
  }
}

function readCookie(event, name) {
  const cookies = String(event.headers.cookie || event.headers.Cookie || '')
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
  const match = cookies.find((item) => item.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : ''
}

function parseBody(event) {
  if (!event.body) return {}

  try {
    return JSON.parse(event.body)
  } catch {
    return {}
  }
}

function getApiPath(event) {
  return event.path
    .replace(/^\/\.netlify\/functions\/api/, '')
    .replace(/^\/api/, '')
    .replace(/\/$/, '') || '/health'
}

async function handleRequest(event) {
  const path = getApiPath(event)
  const method = event.httpMethod
  const body = parseBody(event)

  if (method === 'OPTIONS') {
    return json(200, { ok: true })
  }

  if (method === 'GET' && path === '/health') {
    return json(200, { ok: true, service: 'mabu-api' })
  }

  if (method === 'GET' && path === '/naver/status') {
    return json(200, getNaverApiStatus())
  }

  if (method === 'GET' && path === '/ai/status') {
    return json(200, getAiApiStatus())
  }

  if (method === 'GET' && path === '/auth/kakao/status') {
    return json(200, getKakaoAuthStatus())
  }

  if (method === 'GET' && path === '/auth/kakao/login') {
    try {
      const req = createRequestLike(event)
      const { state, url } = buildKakaoLoginUrl(req)
      return redirect(url, {
        'Set-Cookie': `mabu_kakao_state=${encodeURIComponent(state)}; Max-Age=600; Path=/; HttpOnly; SameSite=Lax; Secure`,
      })
    } catch (error) {
      return redirect(buildKakaoErrorRedirect(error.message || '카카오 로그인을 시작하지 못했습니다.', getOrigin(event)))
    }
  }

  if (method === 'GET' && path === '/auth/kakao/callback') {
    try {
      const state = String(event.queryStringParameters?.state ?? '')
      const savedState = readCookie(event, 'mabu_kakao_state')
      if (savedState && state && savedState !== state) {
        const error = new Error('카카오 로그인 상태 검증에 실패했습니다.')
        error.status = 400
        throw error
      }

      const user = await completeKakaoLogin({
        code: String(event.queryStringParameters?.code ?? ''),
        req: createRequestLike(event),
      })
      return redirect(buildKakaoSuccessRedirect(user, getOrigin(event)), {
        'Set-Cookie': 'mabu_kakao_state=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax; Secure',
      })
    } catch (error) {
      return redirect(buildKakaoErrorRedirect(error.message || '카카오 로그인에 실패했습니다.', getOrigin(event)))
    }
  }

  if (method === 'GET' && path === '/naver/keyword') {
    const keyword = String(event.queryStringParameters?.keyword ?? '')
    return json(200, await getNaverKeywordInsight(keyword))
  }

  if (method === 'POST' && path === '/blog/planner-insights') {
    const links = Array.isArray(body.links) ? body.links : []
    return json(200, await analyzeCompetitorBlogLinks(links))
  }

  if (method === 'POST' && path === '/blog/write') {
    return json(200, await generateBlogWriterArticle(body))
  }

  if (method === 'POST' && path === '/product/insights') {
    return json(200, await analyzeProductLink(String(body.url ?? '')))
  }

  if (method === 'POST' && path === '/youtube/insights') {
    return json(200, await analyzeYoutubeLink(String(body.url ?? '')))
  }

  return json(404, { message: 'API 경로를 찾을 수 없습니다.' })
}

export async function handler(event) {
  try {
    return await handleRequest(event)
  } catch (error) {
    return json(error.status || 500, {
      message: error.message || 'API 요청에 실패했습니다.',
      detail: error.data ?? null,
    })
  }
}
