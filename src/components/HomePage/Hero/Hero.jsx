import { ArrowRight, Bookmark, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__grid" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">A quieter way to read</p>
          <h1 className="display-title">Stories worth staying for.</h1>
          <p className="body-copy">
            Browse timeless books, read in your browser, and return exactly where you
            left off.
          </p>
          <div className="hero__actions">
            <Link className="btn-editorial" to="/library">
              Explore the library <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link className="btn-editorial btn-editorial--secondary" to="/my-shelf">
              <Bookmark aria-hidden="true" size={16} /> My shelf
            </Link>
          </div>
          <div className="hero__note">
            <Sparkles aria-hidden="true" size={15} />
            <span>Classic books, a more personal reading space.</span>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__bookmark" aria-hidden="true">
            <span />
          </div>
          <div className="hero__book hero__book--back">
            <span>BOOKWORM</span>
          </div>
          <div className="hero__book hero__book--front">
            <span>READ DEEPER</span>
            <i />
          </div>
          <div className="hero__open-book" aria-hidden="true">
            <div className="hero__page hero__page--left">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="hero__page hero__page--right">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="hero__progress-card">
            <p>Continue reading</p>
            <strong>Your next chapter is waiting.</strong>
            <div><span /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
