import { Link } from 'react-router-dom';
import './Logo.css';

export default function Logo({ compact = false, light = false }) {
  return (
    <Link
      aria-label="Bookworm home"
      className={'brand-logo' + (light ? ' brand-logo--light' : '')}
      to="/"
    >
      <svg
        aria-hidden="true"
        className="brand-logo__mark"
        fill="none"
        viewBox="0 0 48 48"
      >
        <path d="M6 10.5C12 10.5 17.2 12.2 22 16v21C17.2 33.2 12 31.5 6 31.5v-21Z" />
        <path d="M42 10.5C36 10.5 30.8 12.2 26 16v21C30.8 33.2 36 31.5 42 31.5v-21Z" />
        <path className="brand-logo__bookmark" d="M22 16h4v22l-2-2-2 2V16Z" />
      </svg>
      {!compact && <span className="brand-logo__wordmark">Bookworm</span>}
    </Link>
  );
}
