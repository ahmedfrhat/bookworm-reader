export function cleanGutenbergText(text = '') {
  const startMarker = text.search(/\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG EBOOK/i);
  const endMarker = text.search(/\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG EBOOK/i);
  const afterHeader = startMarker >= 0 ? text.slice(text.indexOf('\n', startMarker) + 1) : text;

  return endMarker >= 0 ? afterHeader.slice(0, endMarker) : afterHeader;
}

export function paragraphsFromText(text = '') {
  return cleanGutenbergText(text)
    .split(/\n\s*\n/)
    .map(function cleanParagraph(paragraph) {
      return paragraph.replace(/\s*\n\s*/g, ' ').trim();
    })
    .filter(Boolean);
}
