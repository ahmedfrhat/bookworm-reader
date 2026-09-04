import axios from 'axios';
import { normalizeBook } from './bookNormalizer';

const BOOKS_URL = 'https://gutendex.com/books/';
const MAX_CACHED_BOOKS = 100;
const bookCache = new Map();

function rememberBook(book) {
  bookCache.delete(String(book.id));
  bookCache.set(String(book.id), book);

  if (bookCache.size > MAX_CACHED_BOOKS) {
    bookCache.delete(bookCache.keys().next().value);
  }

  return book;
}

function createBooksUrl(filters = {}) {
  if (filters.pageUrl) {
    return filters.pageUrl;
  }

  const url = new URL(BOOKS_URL);

  if (filters.search) {
    url.searchParams.set('search', filters.search);
  }

  if (filters.language) {
    url.searchParams.set('languages', filters.language);
  }

  if (filters.topic) {
    url.searchParams.set('topic', filters.topic);
  }

  if (filters.sort) {
    url.searchParams.set('sort', filters.sort);
  }

  if (filters.copyright !== undefined) {
    url.searchParams.set('copyright', String(filters.copyright));
  }

  return url.toString();
}

export async function getBooks(filters = {}, options = {}) {
  const response = await axios.get(createBooksUrl(filters), {
    signal: options.signal,
  });
  const results = response.data.results.map(normalizeBook).map(rememberBook);

  return {
    count: response.data.count,
    next: response.data.next,
    previous: response.data.previous,
    results,
  };
}

export async function getBook(id, options = {}) {
  const cachedBook = bookCache.get(String(id));
  if (cachedBook) {
    return cachedBook;
  }

  const response = await axios.get(BOOKS_URL + encodeURIComponent(id) + '/', {
    signal: options.signal,
  });

  return rememberBook(normalizeBook(response.data));
}
