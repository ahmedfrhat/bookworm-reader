const CACHE_NAME = 'bookworm-reader-text-v1';
const MAX_CACHED_BOOKS = 3;
const memoryCache = new Map();

function textRequest(bookId) {
  return new Request('/api/read-book?bookId=' + encodeURIComponent(bookId));
}

function remember(bookId, text) {
  memoryCache.delete(bookId);
  memoryCache.set(bookId, text);

  if (memoryCache.size > MAX_CACHED_BOOKS) {
    memoryCache.delete(memoryCache.keys().next().value);
  }
}

async function openCache() {
  if (!('caches' in window)) {
    return null;
  }

  return window.caches.open(CACHE_NAME);
}

async function cacheResponse(request, response) {
  try {
    const cache = await openCache();
    if (!cache) {
      return;
    }

    await cache.put(request, response);
    const savedRequests = await cache.keys();
    await Promise.all(
      savedRequests.slice(0, Math.max(0, savedRequests.length - MAX_CACHED_BOOKS)).map(function removeOldText(savedRequest) {
        return cache.delete(savedRequest);
      }),
    );
  } catch {
    return undefined;
  }
}

function assertTextResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || !contentType.toLowerCase().startsWith('text/plain')) {
    throw new Error('The in-app reader is unavailable for this book right now.');
  }
}

export async function getReaderText(bookId, options = {}) {
  if (memoryCache.has(bookId)) {
    return memoryCache.get(bookId);
  }

  const request = textRequest(bookId);
  let response;

  try {
    const cache = await openCache();
    response = cache ? await cache.match(request) : null;
  } catch {
    response = null;
  }

  if (!response) {
    response = await fetch(request, { signal: options.signal });
    assertTextResponse(response);
    cacheResponse(request, response.clone());
  }

  assertTextResponse(response);
  const text = await response.text();
  remember(bookId, text);
  return text;
}
