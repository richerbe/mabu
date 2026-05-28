import { randomUUID } from 'node:crypto'

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize'
const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token'
const KAKAO_USER_URL = 'https://kapi.kakao.com/v2/user/me'

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function base64UrlJson(value) {
  return base64UrlEncode(JSON.stringify(value))
}

function randomState() {
  return base64UrlEncode(`${Date.now()}:${Math.random().toString(36).slice(2)}:${randomUUID()}`)
}

function getBaseUrl(req) {
  const configured = process.env.KAKAO_REDIRECT_BASE_URL || process.env.PUBLIC_SITE_URL
  if (configured) return configured.replace(/\/$/, '')

  const host = req?.get?.('host') || req?.headers?.host || 'localhost:5174'
  const protocol = req?.get?.('x-forwarded-proto') || req?.protocol || (host.includes('localhost') ? 'http' : 'https')
  return `${protocol}://${host}`
}

export function getKakaoRedirectUri(req) {
  return process.env.KAKAO_REDIRECT_URI || `${getBaseUrl(req)}/api/auth/kakao/callback`
}

export function getKakaoAuthStatus() {
  return {
    configured: Boolean(process.env.KAKAO_REST_API_KEY),
    redirectUri: process.env.KAKAO_REDIRECT_URI || `${process.env.PUBLIC_SITE_URL || 'https://mabu-marketing-boost.netlify.app'}/api/auth/kakao/callback`,
  }
}

export function buildKakaoLoginUrl(req) {
  const clientId = process.env.KAKAO_REST_API_KEY
  if (!clientId) {
    const error = new Error('KAKAO_REST_API_KEY가 설정되어 있지 않습니다.')
    error.status = 503
    throw error
  }

  const state = randomState()
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: getKakaoRedirectUri(req),
    state,
  })

  return {
    state,
    url: `${KAKAO_AUTHORIZE_URL}?${params.toString()}`,
  }
}

async function requestKakaoToken({ code, req }) {
  const clientId = process.env.KAKAO_REST_API_KEY
  const clientSecret = process.env.KAKAO_CLIENT_SECRET
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: getKakaoRedirectUri(req),
    code,
  })

  if (clientSecret) {
    body.set('client_secret', clientSecret)
  }

  const response = await fetch(KAKAO_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body,
  })
  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.error_description || '카카오 토큰 발급에 실패했습니다.')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

async function requestKakaoUser(accessToken) {
  const response = await fetch(KAKAO_USER_URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  })
  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.msg || '카카오 사용자 정보 조회에 실패했습니다.')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export async function completeKakaoLogin({ code, req }) {
  if (!code) {
    const error = new Error('카카오 인증 코드가 없습니다.')
    error.status = 400
    throw error
  }

  const token = await requestKakaoToken({ code, req })
  const kakaoUser = await requestKakaoUser(token.access_token)
  const account = kakaoUser.kakao_account ?? {}
  const profile = account.profile ?? {}

  return {
    id: `kakao:${kakaoUser.id}`,
    provider: 'kakao',
    name: profile.nickname || account.name || '카카오 사용자',
    email: account.email || '',
    avatar: profile.profile_image_url || profile.thumbnail_image_url || '',
    plan: 'Kakao',
    loggedInAt: new Date().toISOString(),
  }
}

export function buildKakaoSuccessRedirect(user, origin) {
  const baseUrl = (origin || process.env.PUBLIC_SITE_URL || 'https://mabu-marketing-boost.netlify.app').replace(/\/$/, '')
  const params = new URLSearchParams({
    kakao_login: 'success',
    kakao_user: base64UrlJson(user),
  })
  return `${baseUrl}/?${params.toString()}`
}

export function buildKakaoErrorRedirect(message, origin) {
  const baseUrl = (origin || process.env.PUBLIC_SITE_URL || 'https://mabu-marketing-boost.netlify.app').replace(/\/$/, '')
  const params = new URLSearchParams({
    kakao_login: 'error',
    message,
  })
  return `${baseUrl}/?${params.toString()}`
}
