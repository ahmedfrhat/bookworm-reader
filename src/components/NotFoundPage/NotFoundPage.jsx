import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <section className="not-found page-section">
      <div className="container not-found__inner">
        <p className="eyebrow">404 · Lost in the stacks</p>
        <p aria-hidden="true" className="not-found__number">404</p>
        <h1>That page has slipped between the pages.</h1>
        <p>Let’s take you somewhere with a better story.</p>
        <Link className="btn-editorial" to="/library"><ArrowLeft aria-hidden="true" size={17} /> Browse the library</Link>
      </div>
    </section>
  );
}
