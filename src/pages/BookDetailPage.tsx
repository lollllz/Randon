import { ChevronLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BookCover } from '../components/BookCover'
import { Badge } from '../components/ui/badge'
import { Button, buttonVariants } from '../components/ui/button'
import { getBookById } from '../data/books'
import { useBookDownload } from '../hooks/useBookDownload'
import { inAppReadFormat, epubFileName } from '../lib/books'
import { cn } from '../lib/utils'
import { useRandon } from '../store/RandonProvider'

export function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { bookText } = useRandon()
  const { stateFor, download, toast, error } = useBookDownload()
  const book = id ? getBookById(id) : undefined

  if (!book) {
    return (
      <div className="page">
        <h1 className="text-2xl font-semibold">Book missing</h1>
        <p className="mt-2 text-ink-soft">That title is not in the public-domain shelf.</p>
        <Link className="mt-4 inline-block text-sm font-semibold text-teal" to="/books">
          Back to books
        </Link>
      </div>
    )
  }

  const state = stateFor(book.id)
  const onDevice = Boolean(bookText(book.id)) || state === 'saved'
  const format = inAppReadFormat(book)
  const readPath = `/books/${book.id}/read`

  return (
    <div className="page rise">
      <button
        type="button"
        className="-ml-1 mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-soft"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="size-4" aria-hidden />
        Books
      </button>

      <BookCover
        book={book}
        className="mx-auto w-[168px]"
        state={state}
        onDownload={() => void download(book)}
        onOpen={() => navigate(readPath)}
      />

      <h1 className="mt-5 text-[24px] font-semibold leading-snug tracking-tight text-ink">
        {book.title}
      </h1>
      <p className="mt-1 text-[15px] text-ink-soft">{book.author}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge className="bg-paper-2 text-ink-soft">{format.license}</Badge>
        <Badge>{format.chip}</Badge>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-ink">{book.blurb}</p>
      <p className="mt-3 text-[13px] text-ink-soft">{book.lengthLabel}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
        {format.license}. Source: {book.source}
        {book.year ? ` (${book.year})` : ''}. This copy is for reading, not for sale.
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{format.note}</p>

      <div className="mt-6">
        {onDevice ? (
          <Button size="lg" onClick={() => navigate(readPath)}>
            Open
          </Button>
        ) : (
          <Button size="lg" disabled={state === 'busy'} onClick={() => void download(book)}>
            {state === 'busy' ? 'Saving…' : 'Download'}
          </Button>
        )}
      </div>

      {format.epubLabel && book.downloadUrl && (
        <>
          <a
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'mt-3')}
            href={book.downloadUrl}
            download={epubFileName(book)}
            target="_blank"
            rel="noreferrer"
          >
            {format.epubLabel}
          </a>
          <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">
            A real .epub file from Gutenberg. It downloads in the browser and does not open in this
            app.
          </p>
        </>
      )}

      {error && <p className="mt-3 text-sm text-ink-soft">{error}</p>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
