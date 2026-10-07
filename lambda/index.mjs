// Serves the Vite build (bundled next to this file in ./dist) via a Lambda Function URL.
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
}

const TEXT_TYPES = ['.html', '.js', '.mjs', '.css', '.json', '.svg', '.txt']

async function serve(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const body = await readFile(filePath)
  const isText = TEXT_TYPES.includes(ext)
  return {
    statusCode: 200,
    headers: {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
      'Cache-Control': filePath.includes(`${path.sep}assets${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
    },
    body: isText ? body.toString('utf-8') : body.toString('base64'),
    isBase64Encoded: !isText,
  }
}

export const handler = async (event) => {
  const rawPath = decodeURIComponent(event.rawPath ?? '/')
  const requested = path.normalize(path.join(DIST, rawPath))

  // Block path traversal outside dist
  if (!requested.startsWith(DIST)) {
    return { statusCode: 403, body: 'Forbidden' }
  }

  try {
    return await serve(rawPath.endsWith('/') ? path.join(requested, 'index.html') : requested)
  } catch {
    // SPA fallback — unknown routes get index.html
    return serve(path.join(DIST, 'index.html'))
  }
}
