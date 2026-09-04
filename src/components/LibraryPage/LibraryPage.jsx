import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce/useDebounce';
import { getBooks } from '../../services/GutendexApi/GutendexApi';
import BookCard from '../ui/BookCard/BookCard';
import { EmptyState, ErrorState, LoadingState } from '../ui/States/States';
import FilterBar from './FilterBar/FilterBar';
import SearchBar from './SearchBar/SearchBar';
import './LibraryPage.css';

function getInitialFilters(searchParams) {
  return {
    search: searchParams.get('search') || '',
    language: searchParams.get('language') || '',
    topic: searchParams.get('topic') || '',
    sort: searchParams.get('sort') || 'popular',
  };
}

export default function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(function setInitialFilters() {
    return getInitialFilters(searchParams);
  });
  const [pageUrl, setPageUrl] = useState(null);
  const [libraryData, setLibraryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const debouncedSearch = useDebounce(filters.search);

  useEffect(
    function syncFiltersToUrl() {
      const nextParams = {};

      if (filters.search) {
        nextParams.search = filters.search;
      }
      if (filters.language) {
        nextParams.language = filters.language;
      }
      if (filters.topic) {
        nextParams.topic = filters.topic;
      }
      if (filters.sort !== 'popular') {
        nextParams.sort = filters.sort;
      }

      setSearchParams(nextParams, { replace: true });
    },
    [filters, setSearchParams],
  );

  useEffect(
    function loadLibrary() {
      const controller = new AbortController();
      setLoading(true);
      setError('');

      getBooks(
        {
          search: debouncedSearch,
          language: filters.language,
          topic: filters.topic,
          sort: filters.sort,
          copyright: false,
          pageUrl,
        },
        { signal: controller.signal },
      )
        .then(function updateLibrary(data) {
          setLibraryData(data);
        })
        .catch(function handleLibraryError(requestError) {
          if (requestError.name !== 'CanceledError') {
            setError('The library could not be reached. Please try again.');
          }
        })
        .finally(function finishLibraryRequest() {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        });

      return function cancelLibraryRequest() {
        controller.abort();
      };
    },
    [
      debouncedSearch,
      filters.language,
      filters.sort,
      filters.topic,
      pageUrl,
      refreshKey,
    ],
  );

  function updateFilter(key, value) {
    setPageUrl(null);
    setFilters(function updateCurrentFilters(currentFilters) {
      return { ...currentFilters, [key]: value };
    });
  }

  function clearFilters() {
    setPageUrl(null);
    setFilters({
      search: '',
      language: '',
      topic: '',
      sort: 'popular',
    });
  }

  function retryLibrary() {
    setRefreshKey(function nextRefreshKey(currentKey) {
      return currentKey + 1;
    });
  }

  return (
    <section className="page-shell library-page">
      <div className="container">
        <div className="page-intro">
          <p className="eyebrow">The collection</p>
          <h1 className="page-title">Find a book that keeps calling you back.</h1>
          <p>
            Explore public-domain classics by title, author, subject, language, or
            popularity.
          </p>
        </div>
        <div className="library-page__controls">
          <SearchBar
            onChange={function updateSearch(value) {
              updateFilter('search', value);
            }}
            value={filters.search}
          />
          <FilterBar filters={filters} onChange={updateFilter} onClear={clearFilters} />
        </div>
        {!loading && !error && libraryData && (
          <div className="library-page__summary">
            <p>
              {libraryData.count.toLocaleString('en-US')} books found
              {filters.search ? ' for “' + filters.search + '”' : ''}.
            </p>
          </div>
        )}
        {loading && <LoadingState label="Searching the shelves…" />}
        {error && <ErrorState message={error} onRetry={retryLibrary} />}
        {!loading && !error && libraryData && libraryData.results.length === 0 && (
          <EmptyState
            description="Try a different title, author, language, or subject."
            title="No books matched that search."
          />
        )}
        {!loading && !error && libraryData && libraryData.results.length > 0 && (
          <>
            <div className="library-page__grid">
              {libraryData.results.map(function renderBook(book, index) {
                return <BookCard book={book} key={book.id} priority={index < 2} />;
              })}
            </div>
            <div className="library-page__pagination">
              <button
                className="btn-editorial btn-editorial--secondary"
                disabled={!libraryData.previous}
                onClick={function goToPreviousPage() {
                  setPageUrl(libraryData.previous);
                }}
                type="button"
              >
                <ArrowLeft aria-hidden="true" size={16} /> Previous
              </button>
              <button
                className="btn-editorial btn-editorial--secondary"
                disabled={!libraryData.next}
                onClick={function goToNextPage() {
                  setPageUrl(libraryData.next);
                }}
                type="button"
              >
                Next <ArrowRight aria-hidden="true" size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
