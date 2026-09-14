import { BookOpen, Cloud, LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SAVED_ON_DEVICE } from '../copy'
import { BookDownloadError, fetchBookText, isAbortError } from '../lib/books'
import { useRandon } from '../store/RandonProvider'
import type { OpenBook } from '../types'

export type DownloadState = 'idle' | 'busy' | 'saved'

export function useBookDownload() {
  const { bookText, saveBook } = useRandon()
  const [pending, setPending] = useState<Record<string, DownloadState>>({})
  const [toast, setToast] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const controllers = useRef(new Map<string, AbortController>())

  useEffect(() => {
    return () => {
      for (const controller of controllers.current.values()) {
        controller.abort()
      }
      controllers.current.clear()
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  function stateFor(id: string): DownloadState {
    if (pending[id] === 'busy') return 'busy'
    if (bookText(id) || pending[id] === 'saved') return 'saved'
    return 'idle'
  }

  async function download(book: OpenBook) {
    if (stateFor(book.id) !== 'idle') return
    setError(null)
    const controller = new AbortController()
    controllers.current.get(book.id)?.abort()
    controllers.current.set(book.id, controller)
    setPending((current) => ({ ...current, [book.id]: 'busy' }))
    try {
      const text = await fetchBookText(book, controller.signal)
      if (controller.signal.aborted) return
      await saveBook({ id: book.id, text, savedAt: new Date().toISOString() })
      setPending((current) => ({ ...current, [book.id]: 'saved' }))
      setToast(SAVED_ON_DEVICE)
    } catch (caught) {
      if (isAbortError(caught) || controller.signal.aborted) {
        setPending((current) => {
          const next = { ...current }
          delete next[book.id]
          return next
        })
        return
      }
      const message =
        caught instanceof BookDownloadError
          ? caught.message
          : 'Could not save that title. Try again in a moment.'
      setError(message)
      setPending((current) => {
        const next = { ...current }
        delete next[book.id]
        return next
      })
    } finally {
      controllers.current.delete(book.id)
    }
  }

  return { stateFor, download, toast, error, clearError: () => setError(null) }
}

export function DownloadGlyph({ state }: { state: DownloadState }) {
  if (state === 'busy') return <LoaderCircle className="spin size-4" aria-hidden />
  if (state === 'saved') return <BookOpen className="size-4" aria-hidden />
  return <Cloud className="size-4" aria-hidden />
}
