import { BookOpenCheck, Heart, LibraryBig } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCard from '../ui/BookCard/BookCard';
import { useLibrary } from '../../context/LibraryContext/LibraryContext';
import { useReader } from '../../context/ReaderContext/ReaderContext';
import './MyShelfPage.css';

export default function MyShelfPage() {
  const { favorites, completed } = useLibrary();
  const { progressByBook } = useReader();
  const inProgress = favorites.filter(function hasSavedProgress(book) {
    return progressByBook[book.id]?.ratio > 0 && !completed.includes(book.id);
  });

  return (
    <section className="shelf-page page-section">
      <div className="container">
        <div className="page-intro shelf-page__intro">
          <p className="eyebrow">Your private corner</p>
          <h1>My shelf</h1>
          <p>
            The books you save, your reader preferences, and your reading place stay in
            this browser.
          </p>
        </div>

        <div className="shelf-page__stats" aria-label="Shelf summary">
          <article><Heart aria-hidden="true" /><strong>{favorites.length}</strong><span>Saved books</span></article>
          <article><LibraryBig aria-hidden="true" /><strong>{inProgress.length}</strong><span>In progress</span></article>
          <article><BookOpenCheck aria-hidden="true" /><strong>{completed.length}</strong><span>Finished</span></article>
        </div>

        {inProgress.length > 0 && (
          <section className="shelf-page__section" aria-labelledby="continue-reading-title">
            <div className="section-heading">
              <div><p className="eyebrow">Pick up the thread</p><h2 id="continue-reading-title">Continue reading</h2></div>
            </div>
            <div className="shelf-page__continue-grid">
              {inProgress.slice(0, 3).map(function renderProgress(book) {
                const ratio = Math.round((progressByBook[book.id]?.ratio || 0) * 100);
                return (
                  <article className="continue-card" key={book.id}>
                    {book.coverUrl ? <img alt="" src={book.coverUrl} /> : <div className="continue-card__fallback" />}
                    <div>
                      <p>{ratio}% read</p>
                      <h3>{book.title}</h3>
                      <div aria-label={ratio + '% completed'} className="continue-card__progress"><span style={{ width: ratio + '%' }} /></div>
                      <Link className="btn-editorial btn-editorial--small" to={'/read/' + book.id}>Continue</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section className="shelf-page__section" aria-labelledby="saved-books-title">
          <div className="section-heading">
            <div><p className="eyebrow">Your collection</p><h2 id="saved-books-title">Saved books</h2></div>
          </div>
          {favorites.length ? (
            <div className="book-grid">
              {favorites.map(function renderBook(book) { return <BookCard book={book} key={book.id} />; })}
            </div>
          ) : (
            <div className="shelf-page__empty">
              <Heart aria-hidden="true" size={28} />
              <h2>Your shelf is waiting.</h2>
              <p>Save a book from the library and it will appear here.</p>
              <Link className="btn-editorial" to="/library">Explore the library</Link>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
