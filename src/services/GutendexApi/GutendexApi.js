import axios from 'axios';
import { normalizeBook } from './bookNormalizer';

const BOOKS_URL = 'https://gutendex.com/books/';

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

  return {
    count: response.data.count,
    next: response.data.next,
    previous: response.data.previous,
    results: response.data.results.map(normalizeBook),
  };
}

export async function getBook(id, options = {}) {
  const response = await axios.get(BOOKS_URL + encodeURIComponent(id) + '/', {
    signal: options.signal,
  });

  return normalizeBook(response.data);
}
