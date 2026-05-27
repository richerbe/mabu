import 'dotenv/config'
import { generateBlogWriterArticle, getAiApiStatus } from '../../server/aiApi.js'
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
