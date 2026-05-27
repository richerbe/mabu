import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateBlogWriterArticle, getAiApiStatus } from './aiApi.js'
import { analyzeCompetitorBlogLinks, analyzeProductLink, analyzeYoutubeLink, getNaverApiStatus, getNaverKeywordInsight } from './naverApi.js'

const app = express()
const port = Number(process.env.PORT || 5174)
const host = process.env.HOST || '0.0.0.0'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../dist')

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'mabu-api' })
})

app.get('/api/naver/status', (req, res) => {
  res.json(getNaverApiStatus())
})

app.get('/api/ai/status', (req, res) => {
  res.json(getAiApiStatus())
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

app.use(express.static(distPath))
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, host, () => {
  const networkHosts = Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item?.family === 'IPv4' && !item.internal)
    .map((item) => `http://${item.address}:${port}`)

  console.log(`마부 server running at http://127.0.0.1:${port}`)
  networkHosts.forEach((url) => console.log(`마부 network URL: ${url}`))
})
