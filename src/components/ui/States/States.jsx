import { AlertCircle, BookOpenText, LoaderCircle, RefreshCw } from 'lucide-react';
import './States.css';

export function LoadingState({ label = 'Loading the library…' }) {
  return (
    <div aria-live="polite" className="status-state">
      <LoaderCircle aria-hidden="true" className="status-state__spinner" size={30} />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="status-state status-state--error" role="alert">
      <AlertCircle aria-hidden="true" size={30} />
      <p>{message}</p>
      {onRetry && (
        <button className="btn-editorial btn-editorial--secondary" onClick={onRetry} type="button">
          <RefreshCw size={16} /> Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ action, description, title = 'Nothing here yet.' }) {
  return (
    <div className="status-state status-state--empty">
      <BookOpenText aria-hidden="true" size={34} />
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
