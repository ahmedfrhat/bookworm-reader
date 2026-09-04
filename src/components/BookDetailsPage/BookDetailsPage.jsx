import { ArrowLeft, BookOpen, ExternalLink, Heart, Languages, LibraryBig, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLibrary } from '../../context/LibraryContext/LibraryContext';
import { getBook } from '../../services/GutendexApi/GutendexApi';
import { formatAuthors, formatDownloads } from '../../utils/bookHelpers/bookHelpers';
import { ErrorState, LoadingState } from '../ui/States/States';
import './BookDetailsPage.css';

export default function BookDetailsPage() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useLibrary();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(
    function loadBook() {
      const controller = new AbortController();
      setLoading(true);
      setError('');

      getBook(id, { signal: controller.signal })
        .then(setBook)
        .catch(function handleBookError(requestError) {
          if (requestError.name !== 'CanceledError') {
            setError('This book could not be loaded.');
          }
        })
        .finally(function finishBookRequest() {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        });

      return function cancelBookRequest() {
        controller.abort();
      };
    },
    [id, refreshKey],
  );

  if (loading) {
    return (
      <section className="page-shell">
        <div className="container"><LoadingState label="Opening this book…" /></div>
      </section>
    );
  }

  if (error || !book) {
    return (
      <section className="page-shell">
        <div className="container">
          <ErrorState
            message={error || 'This book was not found.'}
            onRetry={function retryBook() {
              setRefreshKey(function nextKey(currentKey) {
                return currentKey + 1;
              });
            }}
          />
        </div>
      </section>
    );
  }

  const favorite = isFavorite(book.id);

  return (
    <section className="page-shell book-details">
      <div className="container">
        <Link className="book-details__back" to="/library">
          <ArrowLeft aria-hidden="true" size={16} /> Back to library
        </Link>
        <div className="book-details__layout">
          <div className="book-details__cover-wrap">
            {book.coverUrl ? (
              <img alt={'Cover of ' + book.title} className="book-details__cover" src={book.coverUrl} />
            ) : (
              <div className="book-details__cover book-details__cover--fallback">
                <BookOpen size={38} />
                <span>Bookworm</span>
              </div>
            )}
          </div>
          <div className="book-details__content">
            <p className="eyebrow">A classic to keep</p>
            <h1 className="page-title">{book.title}</h1>
            <p className="book-details__author">{formatAuthors(book.authors)}</p>
            {book.summary && <p className="book-details__summary">{book.summary}</p>}
            <div className="book-details__actions">
              {book.hasReadableText ? (
                <Link className="btn-editorial" to={'/read/' + book.id}>
                  <BookOpen aria-hidden="true" size={17} /> Read in Bookworm
                </Link>
              ) : (
                <a
                  className="btn-editorial"
                  href={book.sourceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink aria-hidden="true" size={17} /> Open source
                </a>
              )}
              <button
                aria-pressed={favorite}
                className="btn-editorial btn-editorial--secondary"
                onClick={function saveBook() {
                  toggleFavorite(book);
                }}
                type="button"
              >
                <Heart fill={favorite ? 'currentColor' : 'none'} size={17} />
                {favorite ? 'Saved to shelf' : 'Save to shelf'}
              </button>
            </div>
            <dl className="book-details__meta">
              <div>
                <dt><Languages aria-hidden="true" size={16} /> Languages</dt>
                <dd>{book.languages.length ? book.languages.join(', ').toUpperCase() : 'Not listed'}</dd>
              </div>
              <div>
                <dt><Star aria-hidden="true" size={16} /> Downloads</dt>
                <dd>{formatDownloads(book.downloadCount)}</dd>
              </div>
              <div>
                <dt><LibraryBig aria-hidden="true" size={16} /> Availability</dt>
                <dd>{book.copyrightStatus === false ? 'Public domain in the U.S.' : 'Check source'}</dd>
              </div>
            </dl>
            {(book.subjects.length > 0 || book.bookshelves.length > 0) && (
              <div className="book-details__topics">
                <h2>Explore its themes</h2>
                <div>
                  {[...book.bookshelves, ...book.subjects].slice(0, 8).map(function renderTopic(topic) {
                    return <span key={topic}>{topic}</span>;
                  })}
                </div>
              </div>
            )}
            <a
              className="book-details__source"
              href={book.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              View this title on Project Gutenberg <ExternalLink aria-hidden="true" size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
