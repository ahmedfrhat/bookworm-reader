const MAX_TEXT_SIZE = 4_500_000;

function sendJson(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
}

function fetchWithTimeout(url, options = {}, timeout = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(function abortSlowRequest() {
    controller.abort();
  }, timeout);

  return fetch(url, { ...options, signal: controller.signal }).finally(function clearTimer() {
    clearTimeout(timer);
  });
}

function isGutenbergHost(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname === 'gutenberg.org' || hostname === 'www.gutenberg.org';
  } catch {
    return false;
  }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  const bookId = String(request.query.bookId || '');

  if (!/^[1-9][0-9]{0,6}$/.test(bookId)) {
    return sendJson(response, 400, { error: 'A valid bookId is required.' });
  }

  try {
    // Gutendex supplies catalog metadata to the browser. Fetch the text directly from
    // Gutenberg here because Gutendex blocks server-to-server calls from some hosts.
    const textUrl = 'https://www.gutenberg.org/ebooks/' + bookId + '.txt.utf-8';

    const textResponse = await fetchWithTimeout(textUrl, {
      headers: {
        Accept: 'text/plain, text/*;q=0.9, */*;q=0.1',
        'User-Agent': 'Bookworm student reader (public-domain text fetch)',
      },
    });

    if (!textResponse.ok || !isGutenbergHost(textResponse.url)) {
      return sendJson(response, 502, { error: 'The source text could not be retrieved.' });
    }

    const text = await textResponse.text();

    if (text.length > MAX_TEXT_SIZE) {
      return sendJson(response, 413, { error: 'This text is too large for the browser reader.' });
    }

    response
      .status(200)
      .setHeader('Content-Type', 'text/plain; charset=utf-8')
      .setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
      .send(text);
  } catch (error) {
    const status = error.name === 'AbortError' ? 504 : 502;
    return sendJson(response, status, { error: 'The reader source is temporarily unavailable.' });
  }
}
