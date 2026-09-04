import { SlidersHorizontal } from 'lucide-react';
import './FilterBar.css';

export default function FilterBar({ filters, onChange, onClear }) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__title">
        <SlidersHorizontal aria-hidden="true" size={17} />
        <span>Refine</span>
      </div>
      <label>
        <span>Language</span>
        <select
          onChange={function changeLanguage(event) {
            onChange('language', event.target.value);
          }}
          value={filters.language}
        >
          <option value="">All languages</option>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="es">Spanish</option>
        </select>
      </label>
      <label>
        <span>Topic</span>
        <select
          onChange={function changeTopic(event) {
            onChange('topic', event.target.value);
          }}
          value={filters.topic}
        >
          <option value="">All topics</option>
          <option value="Adventure">Adventure</option>
          <option value="Romance">Romance</option>
          <option value="Mystery">Mystery</option>
          <option value="Poetry">Poetry</option>
          <option value="Children">Children</option>
        </select>
      </label>
      <label>
        <span>Sort</span>
        <select
          onChange={function changeSort(event) {
            onChange('sort', event.target.value);
          }}
          value={filters.sort}
        >
          <option value="popular">Popular</option>
          <option value="descending">Newest IDs</option>
          <option value="ascending">Oldest IDs</option>
        </select>
      </label>
      <button className="filter-bar__clear" onClick={onClear} type="button">
        Clear filters
      </button>
    </div>
  );
}
