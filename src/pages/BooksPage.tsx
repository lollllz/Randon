import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookCover } from '../components/BookCover'
import { Chip } from '../components/Chip'
import { DefenseOnly } from '../components/DefenseOnly'
import { Card } from '../components/ui/card'
import { BOOKS } from '../data/books'
import { TOPICS } from '../data/topics'
import { useBookDownload } from '../hooks/useBookDownload'
import { navigateWithMorph, staggerDelay } from '../lib/motion'
import { useRandon } from '../store/RandonProvider'

type BookFilter = 'all' | 'device'

export function BooksPage() {
  const navigate = useNavigate()
  const { profile, bookText } = useRandon()
  const { stateFor, download, toast, error } = useBookDownload()
  const [filter, setFilter] = useState<BookFilter>('all')
  const userTopics = profile?.topics ?? []

  const catalog = useMemo(() => {
    const used = new Set<string>()
    return BOOKS.filter((book) => {
      if (!book.topics.some((topic) => userTopics.includes(topic))) return false
      if (used.has(book.id)) return false
      used.add(book.id)
      return true
    })
  }, [userTopics])

  const books = catalog.filter((book) =>
    filter === 'device' ? Boolean(bookText(book.id)) : true,
  )

  const sections = useMemo(() => {
    return TOPICS.filter((topic) => books.some((book) => book.topics[0] === topic.id)).map(
      (topic) => ({
        topic,
        books: books.filter((book) => book.topics[0] === topic.id),
      }),
    )
  }, [books])

  return (
    <div className="page">
      <h1 className="text-[28px] font-semibold tracking-tight text-ink">Books</h1>
      <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
        Public-domain plain text for your topics. Saved copies open here, on this device.
      </p>

      <div className="chip-row mt-4">
        <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>
          All
        </Chip>
        <Chip selected={filter === 'device'} onClick={() => setFilter('device')}>
          On device
        </Chip>
      </div>

      {books.length === 0 ? (
        <Card className="mt-6 px-5 py-8">
          <p className="text-sm text-ink-soft">
            {filter === 'device'
              ? 'Nothing here yet'
              : 'Add a topic in Settings to see matching open texts.'}
          </p>
        </Card>
      ) : (
        sections.map((section, sectionIndex) => (
          <section key={section.topic.id} className="mt-6">
            <p className="section-label">
              {section.topic.label}
              {section.topic.id === 'cybersecurity' && (
                <>
                  {' '}
                  · <DefenseOnly />
                </>
              )}
            </p>
            <ul className="book-grid mt-3">
              {section.books.map((book, index) => (
                <li
                  key={book.id}
                  className="rise"
                  style={{ animationDelay: staggerDelay(sectionIndex * 2 + index, 40) }}
                >
                  <Link
                    to={`/books/${book.id}`}
                    className="block text-inherit no-underline"
                    onClick={(event) => {
                      event.preventDefault()
                      navigateWithMorph(navigate, `/books/${book.id}`)
                    }}
                  >
                    <BookCover
                      book={book}
                      state={stateFor(book.id)}
                      onDownload={() => void download(book)}
                      onOpen={() => navigate(`/books/${book.id}/read`)}
                    />
                    <h2 className="book-title">{book.title}</h2>
                    <p className="book-author">{book.author}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      {error && <p className="mt-4 text-sm text-ink-soft">{error}</p>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
