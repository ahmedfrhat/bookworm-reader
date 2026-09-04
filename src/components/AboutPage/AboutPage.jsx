import { ArrowUpRight, BookOpen, Heart, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <section className="about-page page-section">
      <div className="container">
        <div className="about-page__hero">
          <p className="eyebrow">About Bookworm</p>
          <h1>A quieter way to meet the classics.</h1>
          <p className="about-page__lede">Bookworm is a student-built browser library for discovering public-domain books and reading them with your place remembered.</p>
        </div>
        <div className="about-page__split">
          <div className="about-page__manifesto"><span aria-hidden="true">“</span><p>Reading should feel like opening a book—not fighting a busy interface.</p></div>
          <div className="about-page__copy"><p>The catalog is powered by Gutendex, an open API for Project Gutenberg’s public-domain collection. Bookworm does not host the texts or claim ownership of them.</p><p>Your shelf, bookmarks, reading progress, and reader settings are stored locally in your browser through localStorage. They are not sent to a user account or server.</p></div>
        </div>
        <section className="about-page__principles" aria-label="Bookworm principles">
          <article><BookOpen aria-hidden="true" /><h2>Discover</h2><p>Search an expansive classic catalog by title, author, topic, and language.</p></article>
          <article><Heart aria-hidden="true" /><h2>Keep your place</h2><p>Save books, make bookmarks, and return to the last place you were reading.</p></article>
          <article><Landmark aria-hidden="true" /><h2>Credit the source</h2><p>Every book remains connected to its Gutenberg source and its public-domain context.</p></article>
        </section>
        <section className="about-page__sources">
          <p className="eyebrow">Sources & attribution</p>
          <h2>Built around open literature.</h2>
          <div className="about-page__source-links">
            <a href="https://gutendex.com/" rel="noreferrer" target="_blank">Gutendex API <ArrowUpRight aria-hidden="true" size={16} /></a>
            <a href="https://www.gutenberg.org/" rel="noreferrer" target="_blank">Project Gutenberg <ArrowUpRight aria-hidden="true" size={16} /></a>
          </div>
          <p className="about-page__fine-print">Availability and rights can vary by country. Always follow the source’s terms before redistributing a text.</p>
        </section>
        <div className="about-page__cta"><h2>Find a story that stays with you.</h2><Link className="btn-editorial" to="/library">Browse the library</Link></div>
      </div>
    </section>
  );
}
