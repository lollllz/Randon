import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/badge'
import { getBookById } from '../data/books'
import { inAppReadFormat } from '../lib/books'
import { isReaderControl } from '../lib/motion'
import { useRandon } from '../store/RandonProvider'

export function BookReadPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { bookText } = useRandon()
  const [chromeOn, setChromeOn] = useState(true)
  const book = id ? getBookById(id) : undefined
  const text = id ? bookText(id) : undefined

  if (!book || !text) {
    return (
      <div className="page">
        <h1 className="text-2xl font-semibold">Not on this device</h1>
        <p className="mt-2 text-ink-soft">Download the title first, then it will open offline.</p>
        <Link className="mt-4 inline-block text-sm font-semibold text-teal" to={`/books/${id ?? ''}`}>
          Back to the book
        </Link>
      </div>
    )
  }

  const format = inAppReadFormat(book)

  return (
    <article
      className="page reader"
      data-chrome={chromeOn ? 'on' : 'off'}
      onClick={(event) => {
        if (isReaderControl(event.target)) return
        setChromeOn((value) => !value)
      }}
    >
      <div
        className={
          chromeOn ? 'reader-top reader-chrome' : 'reader-top reader-chrome reader-chrome-off'
        }
      >
        <button
          type="button"
          className="-ml-1 inline-flex items-center gap-1 text-sm font-medium text-ink-soft"
          onClick={() => navigate(`/books/${book.id}`)}
        >
          <ChevronLeft className="size-4" aria-hidden />
          {book.title}
        </button>
      </div>
      <h1 className="text-[24px] font-semibold leading-snug tracking-tight text-ink">
        {book.title}
      </h1>
      <p className="mt-1 text-[14px] text-ink-soft">{book.author}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge className="bg-paper-2 text-ink-soft">{format.license}</Badge>
        <Badge>{format.chip}</Badge>
      </div>
      <p className="mt-2 text-[13px] text-ink-soft">{format.note}</p>
      <div className="prose-lesson mt-6 whitespace-pre-wrap">{text}</div>
    </article>
  )
}
