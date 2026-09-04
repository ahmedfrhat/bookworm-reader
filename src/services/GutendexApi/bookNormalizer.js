function findFormat(formats, prefix) {
  const key = Object.keys(formats || {}).find(function findFormatKey(formatKey) {
    return formatKey.startsWith(prefix);
  });

  return key ? formats[key] : null;
}

export function normalizeBook(book) {
  const formats = book.formats || {};
  const textUrl = findFormat(formats, 'text/plain');
  const htmlUrl = findFormat(formats, 'text/html');
  const coverUrl = findFormat(formats, 'image/jpeg');

  return {
    id: book.id,
    title: book.title || 'Untitled work',
    authors: book.authors || [],
    summary: book.summaries && book.summaries.length ? book.summaries[0] : '',
    coverUrl,
    textUrl,
    htmlUrl,
    sourceUrl: 'https://www.gutenberg.org/ebooks/' + book.id,
    languages: book.languages || [],
    subjects: book.subjects || [],
    bookshelves: book.bookshelves || [],
    downloadCount: book.download_count || 0,
    copyrightStatus: book.copyright,
    hasReadableText: Boolean(textUrl),
  };
}
