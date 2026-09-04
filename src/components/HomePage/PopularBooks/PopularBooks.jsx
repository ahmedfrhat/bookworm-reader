import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../../../services/GutendexApi/GutendexApi';
import BookCard from '../../ui/BookCard/BookCard';
import { ErrorState, LoadingState } from '../../ui/States/States';
import './PopularBooks.css';

export default function PopularBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(
    function loadPopularBooks() {
      const controller = new AbortController();
      setLoading(true);
      setError('');

      getBooks(
        { sort: 'popular', copyright: false },
        { signal: controller.signal },
      )
        .then(function updateBooks(data) {
          setBooks(data.results.slice(0, 4));
        })
        .catch(function handleError(requestError) {
          if (requestError.name !== 'CanceledError') {
            setError('Popular books could not be loaded right now.');
          }
        })
        .finally(function stopLoading() {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        });

      return function cancelPopularBooksRequest() {
        controller.abort();
      };
    },
    [refreshKey],
  );

  return (
    <section className="popular-books page-shell">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Start somewhere timeless</p>
            <h2>Popular classics</h2>
          </div>
          <Link className="popular-books__all" to="/library">
            Browse all <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        {loading && <LoadingState label="Finding popular classics…" />}
        {error && (
          <ErrorState
            message={error}
            onRetry={function retryPopularBooks() {
              setRefreshKey(function nextRefresh(currentKey) {
                return currentKey + 1;
              });
            }}
          />
        )}
        {!loading && !error && (
          <div className="popular-books__grid">
            {books.map(function renderBook(book, index) {
              return <BookCard book={book} key={book.id} priority={index < 2} />;
            })}
          </div>
        )}
      </div>
    </section>
  );
}
