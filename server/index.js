import 'dotenv/config'
import express from 'express'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import app from './app.js'

const port = Number(process.env.PORT || 5174)
const host = process.env.HOST || '0.0.0.0'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../dist')

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
