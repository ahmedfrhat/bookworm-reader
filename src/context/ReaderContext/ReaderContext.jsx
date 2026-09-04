/* eslint-disable react-refresh/only-export-components -- Context providers intentionally export their paired hook. */
import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage/useLocalStorage';

const defaultSettings = {
  theme: 'light',
  fontSize: 20,
  lineHeight: 1.75,
  contentWidth: '42rem',
};

const ReaderContext = createContext(null);

export function ReaderProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('bookworm:reader-settings', defaultSettings);
  const [progressByBook, setProgressByBook] = useLocalStorage(
    'bookworm:reading-progress',
    {},
  );
  const [bookmarksByBook, setBookmarksByBook] = useLocalStorage('bookworm:bookmarks', {});

  const updateSettings = useCallback(
    function updateSettings(nextSettings) {
      setSettings(function mergeSettings(currentSettings) {
        return { ...currentSettings, ...nextSettings };
      });
    },
    [setSettings],
  );

  const saveProgress = useCallback(
    function saveProgress(bookId, progress) {
      setProgressByBook(function updateProgress(currentProgress) {
        return {
          ...currentProgress,
          [bookId]: {
            ...currentProgress[bookId],
            ...progress,
            updatedAt: new Date().toISOString(),
          },
        };
      });
    },
    [setProgressByBook],
  );

  const addBookmark = useCallback(
    function addBookmark(bookId, bookmark) {
      setBookmarksByBook(function updateBookmarks(currentBookmarks) {
        const currentBookBookmarks = currentBookmarks[bookId] || [];
        const nextBookmark = {
          id: String(Date.now()),
          createdAt: new Date().toISOString(),
          ...bookmark,
        };

        return {
          ...currentBookmarks,
          [bookId]: [nextBookmark, ...currentBookBookmarks],
        };
      });
    },
    [setBookmarksByBook],
  );

  const removeBookmark = useCallback(
    function removeBookmark(bookId, bookmarkId) {
      setBookmarksByBook(function updateBookmarks(currentBookmarks) {
        return {
          ...currentBookmarks,
          [bookId]: (currentBookmarks[bookId] || []).filter(function keepBookmark(bookmark) {
            return bookmark.id !== bookmarkId;
          }),
        };
      });
    },
    [setBookmarksByBook],
  );

  const value = useMemo(
    function createReaderValue() {
      return {
        settings,
        progressByBook,
        bookmarksByBook,
        updateSettings,
        saveProgress,
        addBookmark,
        removeBookmark,
      };
    },
    [
      addBookmark,
      bookmarksByBook,
      progressByBook,
      removeBookmark,
      saveProgress,
      settings,
      updateSettings,
    ],
  );

  return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>;
}

export function useReader() {
  const context = useContext(ReaderContext);

  if (!context) {
    throw new Error('useReader must be used inside ReaderProvider.');
  }

  return context;
}
