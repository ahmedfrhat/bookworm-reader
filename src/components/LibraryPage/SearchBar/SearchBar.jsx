import { Search, X } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ onChange, value }) {
  return (
    <label className="library-search">
      <span className="visually-hidden">Search books or authors</span>
      <Search aria-hidden="true" size={19} />
      <input
        onChange={function updateQuery(event) {
          onChange(event.target.value);
        }}
        placeholder="Search by title or author"
        type="search"
        value={value}
      />
      {value && (
        <button
          aria-label="Clear search"
          onClick={function clearSearch() {
            onChange('');
          }}
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </label>
  );
}
