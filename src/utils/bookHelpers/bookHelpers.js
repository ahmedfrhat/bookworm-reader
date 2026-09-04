export function formatAuthors(authors = []) {
  if (!authors.length) {
    return 'Unknown author';
  }

  return authors.map(function authorName(author) {
    return author.name;
  }).join(', ');
}

export function formatDownloads(count) {
  if (!Number.isFinite(count)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    notation: count > 9999 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(count);
}

export function getPrimaryTopic(book) {
  return (
    (book.bookshelves || [])[0] ||
    (book.subjects || [])[0] ||
    'Classic literature'
  );
}
