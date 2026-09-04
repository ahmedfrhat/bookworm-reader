/* eslint-disable react-refresh/only-export-components -- Context providers intentionally export their paired hook. */
import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage/useLocalStorage';

const LibraryContext = createContext(null);

function toShelfBook(book) {
  return {
    id: book.id,
    title: book.title,
    authors: book.authors,
    coverUrl: book.coverUrl,
    sourceUrl: book.sourceUrl,
    languages: book.languages || [],
    subjects: book.subjects || [],
    bookshelves: book.bookshelves || [],
    hasReadableText: book.hasReadableText,
  };
}

export function LibraryProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('bookworm:favorites', []);
  const [completed, setCompleted] = useLocalStorage('bookworm:completed', []);

  const isFavorite = useCallback(
    function isFavorite(bookId) {
      return favorites.some(function findFavorite(book) {
        return book.id === Number(bookId);
      });
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    function toggleFavorite(book) {
      setFavorites(function updateFavorites(currentFavorites) {
        const exists = currentFavorites.some(function findFavorite(savedBook) {
          return savedBook.id === book.id;
        });

        if (exists) {
          return currentFavorites.filter(function keepOtherBooks(savedBook) {
            return savedBook.id !== book.id;
          });
        }

        return [toShelfBook(book), ...currentFavorites];
      });
    },
    [setFavorites],
  );

  const isCompleted = useCallback(
    function isCompleted(bookId) {
      return completed.includes(Number(bookId));
    },
    [completed],
  );

  const toggleCompleted = useCallback(
    function toggleCompleted(bookId) {
      const id = Number(bookId);
      setCompleted(function updateCompleted(currentCompleted) {
        return currentCompleted.includes(id)
          ? currentCompleted.filter(function keepIncomplete(currentId) {
              return currentId !== id;
            })
          : [id, ...currentCompleted];
      });
    },
    [setCompleted],
  );

  const value = useMemo(
    function createLibraryValue() {
      return {
        favorites,
        completed,
        isFavorite,
        toggleFavorite,
        isCompleted,
        toggleCompleted,
      };
    },
    [completed, favorites, isCompleted, isFavorite, toggleCompleted, toggleFavorite],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error('useLibrary must be used inside LibraryProvider.');
  }

  return context;
}
