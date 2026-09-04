import {
  BookmarkPlus,
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLibrary } from '../../context/LibraryContext/LibraryContext';
import { useReader } from '../../context/ReaderContext/ReaderContext';
import { getBook } from '../../services/GutendexApi/GutendexApi';
import { getReaderText } from '../../services/ReaderTextCache/ReaderTextCache';
import { formatAuthors } from '../../utils/bookHelpers/bookHelpers';
import { paragraphsFromText } from '../../utils/readerHelpers/readerHelpers';
import { EmptyState, ErrorState, LoadingState } from '../ui/States/States';
import './ReaderPage.css';

function createProgressBook(book) {
  return {
    id: book.id,
    title: book.title,
    authors: book.authors,
    coverUrl: book.coverUrl,
    languages: book.languages,
    subjects: book.subjects,
    bookshelves: book.bookshelves,
    sourceUrl: book.sourceUrl,
    hasReadableText: book.hasReadableText,
  };
}

function usesPageScroll() {
  return window.matchMedia('(max-width: 767.98px)').matches;
}

function getReadingScrollTarget(container) {
  if (usesPageScroll()) {
    return document.scrollingElement || document.documentElement;
  }

  return container;
}

function scrollToReadingPosition(target, top, behavior = 'auto') {
  if (usesPageScroll()) {
    window.scrollTo({ top, behavior });
    return;
  }

  target.scrollTo({ top, behavior });
}

export default function ReaderPage() {
  const { id } = useParams();
  const { isCompleted, toggleCompleted } = useLibrary();
  const {
    addBookmark,
    bookmarksByBook,
    progressByBook,
    removeBookmark,
    saveProgress,
    settings,
    updateSettings,
  } = useReader();
  const [book, setBook] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [textLoading, setTextLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const scrollContainerRef = useRef(null);
  const restoreAttemptedRef = useRef(false);

  useEffect(
    function loadReader() {
      const controller = new AbortController();
      restoreAttemptedRef.current = false;
      setLoading(true);
      setTextLoading(true);
      setError('');
      setText('');

      async function loadBookAndText() {
        const bookRequest = getBook(id, { signal: controller.signal });
        const textRequest = getReaderText(id, { signal: controller.signal }).then(
          function keepText(nextText) {
            return { text: nextText };
          },
          function keepTextError(requestError) {
            return { error: requestError };
          },
        );
        const nextBook = await bookRequest;
        setBook(nextBook);
        setLoading(false);

        if (!nextBook.hasReadableText) {
          setTextLoading(false);
          return;
        }

        const textResult = await textRequest;
        if (textResult.error) {
          throw textResult.error;
        }

        setText(textResult.text);
        setTextLoading(false);
      }

      loadBookAndText()
        .catch(function handleReaderError(requestError) {
          if (requestError.name !== 'AbortError' && requestError.name !== 'CanceledError') {
            setError(requestError.message || 'The reader could not be opened.');
          }
        })
        .finally(function finishReaderRequest() {
          if (!controller.signal.aborted) {
            setLoading(false);
            setTextLoading(false);
          }
        });

      return function cancelReaderRequest() {
        controller.abort();
      };
    },
    [id, refreshKey],
  );

  const paragraphs = useMemo(
    function createParagraphs() {
      return paragraphsFromText(text);
    },
    [text],
  );
  const savedProgress = progressByBook[id];
  const bookmarks = bookmarksByBook[id] || [];

  useEffect(
    function restoreReadingPosition() {
      if (
        !paragraphs.length ||
        !savedProgress ||
        restoreAttemptedRef.current
      ) {
        return;
      }

      const target = getReadingScrollTarget(scrollContainerRef.current);
      if (!target) {
        return;
      }

      restoreAttemptedRef.current = true;
      const frameId = window.requestAnimationFrame(function scrollToSavedPosition() {
        scrollToReadingPosition(target, savedProgress.scrollTop || 0);
      });

      return function cancelRestoreFrame() {
        window.cancelAnimationFrame(frameId);
      };
    },
    [paragraphs.length, savedProgress],
  );

  useEffect(
    function persistMobileReaderProgress() {
      if (!book || !text || !usesPageScroll()) {
        return undefined;
      }

      function savePageProgress() {
        const target = getReadingScrollTarget(scrollContainerRef.current);
        const maxScroll = Math.max(target.scrollHeight - target.clientHeight, 1);
        const scrollTop = window.scrollY;
        saveProgress(id, {
          scrollTop,
          ratio: Math.min(1, Math.max(0, scrollTop / maxScroll)),
          book: createProgressBook(book),
        });
      }

      window.addEventListener('scroll', savePageProgress, { passive: true });
      return function stopSavingMobileProgress() {
        window.removeEventListener('scroll', savePageProgress);
      };
    },
    [book, id, saveProgress, text],
  );

  function saveCurrentProgress() {
    const target = getReadingScrollTarget(scrollContainerRef.current);

    if (!target || !book) {
      return;
    }

    const maxScroll = Math.max(target.scrollHeight - target.clientHeight, 1);
    const scrollTop = usesPageScroll() ? window.scrollY : target.scrollTop;
    const ratio = Math.min(1, Math.max(0, scrollTop / maxScroll));
    saveProgress(id, {
      scrollTop,
      ratio,
      book: createProgressBook(book),
    });
  }

  function addCurrentBookmark() {
    const target = getReadingScrollTarget(scrollContainerRef.current);

    if (!target) {
      return;
    }

    const maxScroll = Math.max(target.scrollHeight - target.clientHeight, 1);
    const scrollTop = usesPageScroll() ? window.scrollY : target.scrollTop;
    addBookmark(id, {
      scrollTop,
      ratio: Math.min(1, Math.max(0, scrollTop / maxScroll)),
      label: 'Reading marker',
    });
  }

  function jumpToBookmark(bookmark) {
    const target = getReadingScrollTarget(scrollContainerRef.current);
    if (!target) {
      return;
    }

    scrollToReadingPosition(target, bookmark.scrollTop, 'smooth');
  }

  if (loading) {
    return (
      <section className="page-shell">
        <div className="container"><LoadingState label="Preparing your reading room…" /></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-shell">
        <div className="container">
          <ErrorState
            message={error}
            onRetry={function retryReader() {
              setRefreshKey(function nextKey(currentKey) {
                return currentKey + 1;
              });
            }}
          />
          {book && (
            <div className="reader-page__fallback-link">
              <a href={book.sourceUrl} rel="noreferrer" target="_blank">
                Open the official Gutenberg source <ExternalLink size={15} />
              </a>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (!book || !book.hasReadableText) {
    return (
      <section className="page-shell">
        <div className="container">
          <EmptyState
            action={
              book && (
                <a className="btn-editorial" href={book.sourceUrl} rel="noreferrer" target="_blank">
                  <ExternalLink size={16} /> Open official source
                </a>
              )
            }
            description="This title does not provide a plain-text reading format for Bookworm."
            title="This book cannot be opened in the reader."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="reader-page" data-reader-theme={settings.theme}>
      <div className="reader-page__topbar">
        <div className="container reader-page__topbar-inner">
          <Link className="reader-page__back" to={'/book/' + book.id}>
            <ChevronLeft aria-hidden="true" size={18} /> Details
          </Link>
          <div className="reader-page__title">
            <strong>{book.title}</strong>
            <span>{formatAuthors(book.authors)}</span>
          </div>
          <a
            aria-label="Open official source"
            className="reader-page__source"
            href={book.sourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink size={17} />
          </a>
        </div>
      </div>
      <div className="reader-page__workspace">
        <aside className="reader-page__toolbar" aria-label="Reading settings">
          <div className="reader-page__tool-group">
            <span>Text size</span>
            <div className="reader-page__tool-row">
              <button
                aria-label="Decrease font size"
                disabled={settings.fontSize <= 16}
                onClick={function decreaseFontSize() {
                  updateSettings({ fontSize: settings.fontSize - 2 });
                }}
                type="button"
              >
                <Minus size={16} />
              </button>
              <strong>{settings.fontSize}px</strong>
              <button
                aria-label="Increase font size"
                disabled={settings.fontSize >= 28}
                onClick={function increaseFontSize() {
                  updateSettings({ fontSize: settings.fontSize + 2 });
                }}
                type="button"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <label className="reader-page__setting">
            <span>Theme</span>
            <select
              onChange={function changeTheme(event) {
                updateSettings({ theme: event.target.value });
              }}
              value={settings.theme}
            >
              <option value="light">Paper</option>
              <option value="sepia">Sepia</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label className="reader-page__setting">
            <span>Width</span>
            <select
              onChange={function changeWidth(event) {
                updateSettings({ contentWidth: event.target.value });
              }}
              value={settings.contentWidth}
            >
              <option value="36rem">Narrow</option>
              <option value="42rem">Comfortable</option>
              <option value="52rem">Wide</option>
            </select>
          </label>
          <button className="reader-page__tool-action" onClick={addCurrentBookmark} type="button">
            <BookmarkPlus size={16} /> Mark place
          </button>
          <button
            className={'reader-page__tool-action' + (isCompleted(book.id) ? ' reader-page__tool-action--active' : '')}
            onClick={function markCompleted() {
              toggleCompleted(book.id);
            }}
            type="button"
          >
            <CheckCircle2 size={16} />
            {isCompleted(book.id) ? 'Completed' : 'Mark completed'}
          </button>
        </aside>
        <div
          className="reader-page__scroll"
          onScroll={saveCurrentProgress}
          ref={scrollContainerRef}
        >
          <article
            className="reader-page__content"
            style={{
              fontSize: settings.fontSize + 'px',
              lineHeight: settings.lineHeight,
              maxWidth: settings.contentWidth,
            }}
          >
            <header>
              <p className="eyebrow">Now reading</p>
              <h1>{book.title}</h1>
              <p>{formatAuthors(book.authors)}</p>
            </header>
            {textLoading ? (
              <div aria-live="polite" className="reader-page__loading-copy">
                <span />
                <span />
                <span />
                <p>Setting your pages…</p>
              </div>
            ) : (
              paragraphs.map(function renderParagraph(paragraph, index) {
                return <p key={index}>{paragraph}</p>;
              })
            )}
          </article>
        </div>
        <aside className="reader-page__markers">
          <div className="reader-page__markers-head">
            <span>Bookmarks</span>
            <button
              aria-label="Return to start"
              onClick={function returnToStart() {
                const target = getReadingScrollTarget(scrollContainerRef.current);
                if (target) {
                  scrollToReadingPosition(target, 0, 'smooth');
                }
              }}
              type="button"
            >
              <RotateCcw size={15} />
            </button>
          </div>
          {!bookmarks.length && <p>Mark a place to save it here.</p>}
          {bookmarks.map(function renderBookmark(bookmark) {
            return (
              <div className="reader-page__marker" key={bookmark.id}>
                <button onClick={function jumpToMarker() { jumpToBookmark(bookmark); }} type="button">
                  {Math.round(bookmark.ratio * 100)}% through
                </button>
                <button
                  aria-label="Remove bookmark"
                  onClick={function deleteBookmark() {
                    removeBookmark(id, bookmark.id);
                  }}
                  type="button"
                >
                  ×
                </button>
              </div>
            );
          })}
        </aside>
      </div>
    </section>
  );
}
