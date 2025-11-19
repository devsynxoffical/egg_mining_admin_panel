import { createServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { extname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = process.env.PORT || 3001
const distPath = join(__dirname, 'dist')

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
}

const server = createServer((req, res) => {
  let filePath = join(distPath, req.url === '/' ? 'index.html' : req.url)

  // Security: prevent directory traversal
  if (!filePath.startsWith(distPath)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  // If file doesn't exist, serve index.html (for SPA routing)
  if (!existsSync(filePath) || !existsSync(filePath) && extname(filePath) === '') {
    filePath = join(distPath, 'index.html')
  }

  const ext = extname(filePath)
  const contentType = mimeTypes[ext] || 'application/octet-stream'

  try {
    const content = readFileSync(filePath)
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content, 'utf-8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If still not found, serve index.html
      try {
        const indexContent = readFileSync(join(distPath, 'index.html'))
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(indexContent, 'utf-8')
      } catch (err) {
        res.writeHead(404)
        res.end('File not found')
      }
    } else {
      res.writeHead(500)
      res.end('Server error')
    }
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Serving files from ${distPath}`)
})

