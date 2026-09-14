import { SHELF_TEXTS } from '../data/shelfTexts'
import type { OpenBook } from '../types'

export class BookDownloadError extends Error {
  readonly kind: 'offline' | 'aborted' | 'failed'

  constructor(message: string, kind: 'offline' | 'aborted' | 'failed') {
    super(message)
    this.name = 'BookDownloadError'
    this.kind = kind
  }
}

function wrapLocal(book: OpenBook, body: string) {
  return [
    book.title,
    `${book.author} (${book.year})`,
    '',
    `Public domain. Source: ${book.source}.`,
    '',
    body.trim(),
  ].join('\n')
}

function looksLikePlainText(text: string) {
  const sample = text.slice(0, 80)
  if (sample.startsWith('PK')) return false
  if (text.includes('\u0000')) return false
  return text.trim().length > 200
}

async function readPlainText(response: Response, signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new BookDownloadError('Download cancelled.', 'aborted')
  }
  if (!response.ok) return null
  const contentType = response.headers.get('content-type') ?? ''
  if (/epub|octet-stream|zip/i.test(contentType) && !/text\//i.test(contentType)) {
    return null
  }
  const text = await response.text()
  return looksLikePlainText(text) ? text : null
}

function fetchSignal(timeoutMs: number, signal?: AbortSignal) {
  const timeout = AbortSignal.timeout(timeoutMs)
  if (!signal) return timeout
  if (typeof AbortSignal.any === 'function') return AbortSignal.any([signal, timeout])
  return timeout
}

async function bundledText(book: OpenBook, signal?: AbortSignal) {
  if (book.localExcerpt) {
    try {
      const response = await fetch(`/${book.localExcerpt}`, { signal })
      const text = await readPlainText(response, signal)
      if (text) return wrapLocal(book, text)
    } catch (error) {
      if (signal?.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
        throw new BookDownloadError('Download cancelled.', 'aborted')
      }
    }
  }

  const shelf = SHELF_TEXTS[book.id]
  if (shelf) return wrapLocal(book, shelf)
  return null
}

async function gutenbergPlainText(book: OpenBook, signal?: AbortSignal) {
  if (!book.gutenbergId || !navigator.onLine) return null
  const urls = [
    `https://www.gutenberg.org/cache/epub/${book.gutenbergId}/pg${book.gutenbergId}.txt`,
    `https://www.gutenberg.org/files/${book.gutenbergId}/${book.gutenbergId}-0.txt`,
  ]
  for (const url of urls) {
    try {
      const response = await fetch(url, { signal: fetchSignal(4000, signal) })
      const text = await readPlainText(response, signal)
      if (text) return text
    } catch (error) {
      if (signal?.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
        if (signal?.aborted) {
          throw new BookDownloadError('Download cancelled.', 'aborted')
        }
      }
    }
  }
  return null
}

/** Saves Gutenberg/plain text for the in-app reader. Never fetches the .epub URL. */
export async function fetchBookText(book: OpenBook, signal?: AbortSignal): Promise<string> {
  if (signal?.aborted) {
    throw new BookDownloadError('Download cancelled.', 'aborted')
  }

  const local = bundledText(book, signal)
  const remote = gutenbergPlainText(book, signal)
  const fromGutenberg = await remote
  if (fromGutenberg) {
    void local.catch(() => null)
    return fromGutenberg
  }

  const fromDevice = await local
  if (fromDevice) return fromDevice

  if (!navigator.onLine) {
    throw new BookDownloadError(
      'This title is not on the device yet, and there is no network to fetch it.',
      'offline',
    )
  }

  throw new BookDownloadError(
    'Could not reach the public-domain source. Try again when the connection is steadier.',
    'failed',
  )
}

export function isAbortError(error: unknown) {
  return (
    (error instanceof BookDownloadError && error.kind === 'aborted') ||
    (error instanceof DOMException && error.name === 'AbortError')
  )
}

/** In-app copies are Gutenberg plain text, never an EPUB renderer. */
export function inAppReadFormat(book: OpenBook) {
  const gutenberg = book.source === 'Project Gutenberg' || Boolean(book.gutenbergId)
  return {
    license: book.license,
    chip: 'TXT' as const,
    note: gutenberg
      ? 'In-app Open reads Gutenberg plain text (TXT) saved on this device. This is not an EPUB reader.'
      : 'In-app Open reads plain text saved on this device.',
    epubLabel: book.downloadUrl ? 'Download EPUB' : null,
  }
}

export function epubFileName(book: OpenBook) {
  return `${book.id}.epub`
}
