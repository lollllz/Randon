import { DownloadGlyph, type DownloadState } from '../hooks/useBookDownload'
import { TOPIC_BY_ID } from '../data/topics'
import { cn } from '../lib/utils'
import type { OpenBook, TopicId } from '../types'

export function BookCover({
  book,
  state,
  onDownload,
  onOpen,
  className,
}: {
  book: OpenBook
  state?: DownloadState
  onDownload?: () => void
  onOpen?: () => void
  className?: string
}) {
  const topic = TOPIC_BY_ID[book.topics[0] as TopicId]
  const initial = book.title.replace(/^The\s+/i, '').slice(0, 1).toUpperCase()
  const saved = state === 'saved'

  return (
    <div className={cn('book-cover', className)} style={{ background: topic.cover }}>
      {initial}
      {(onDownload || onOpen) && state && (
        <button
          type="button"
          className="book-dl"
          aria-label={
            saved
              ? `Open ${book.title}`
              : state === 'busy'
                ? 'Saving'
                : `Download ${book.title}`
          }
          disabled={state === 'busy'}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            if (saved) onOpen?.()
            else onDownload?.()
          }}
        >
          <DownloadGlyph state={state} />
        </button>
      )}
    </div>
  )
}
