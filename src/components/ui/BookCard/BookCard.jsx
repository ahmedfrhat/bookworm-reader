import { Bookmark, Heart, MoveUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLibrary } from '../../../context/LibraryContext/LibraryContext';
import { formatAuthors, getPrimaryTopic } from '../../../utils/bookHelpers/bookHelpers';
import './BookCard.css';

export default function BookCard({ book, priority = false }) {
  const { isFavorite, toggleFavorite } = useLibrary();
  const favorite = isFavorite(book.id);

  return (
    <article className="book-card">
      <div className="book-card__cover-wrap">
        <Link aria-label={'View ' + book.title} to={'/book/' + book.id}>
          {book.coverUrl ? (
            <img
              alt={'Cover of ' + book.title}
              className="book-card__cover"
              fetchPriority={priority ? 'high' : 'auto'}
              loading={priority ? 'eager' : 'lazy'}
              src={book.coverUrl}
            />
          ) : (
            <div aria-label={'No cover available for ' + book.title} className="book-card__cover book-card__cover--fallback" role="img">
              <Bookmark aria-hidden="true" size={28} />
              <span>Bookworm</span>
            </div>
          )}
        </Link>
        <button
          aria-label={favorite ? 'Remove from shelf' : 'Save to shelf'}
          aria-pressed={favorite}
          className={'book-card__save' + (favorite ? ' book-card__save--active' : '')}
          onClick={function saveBook() {
            toggleFavorite(book);
          }}
          type="button"
        >
          <Heart fill={favorite ? 'currentColor' : 'none'} size={17} />
        </button>
      </div>
      <div className="book-card__body">
        <p className="book-card__topic">{getPrimaryTopic(book)}</p>
        <h3>
          <Link to={'/book/' + book.id}>{book.title}</Link>
        </h3>
        <p className="book-card__author">{formatAuthors(book.authors)}</p>
        <Link className="book-card__link" to={'/book/' + book.id}>
          View book <MoveUpRight aria-hidden="true" size={15} />
        </Link>
      </div>
    </article>
  );
}
