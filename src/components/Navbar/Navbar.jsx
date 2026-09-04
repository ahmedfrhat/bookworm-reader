import { Menu, Search, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../Logo/Logo';
import './Navbar.css';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/library', label: 'Library' },
  { to: '/my-shelf', label: 'My Shelf' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Logo />
        <nav
          aria-label="Primary navigation"
          className={'site-nav' + (open ? ' site-nav--open' : '')}
        >
          {navItems.map(function renderNavItem(item) {
            return (
              <NavLink
                className={function getNavLinkClass({ isActive }) {
                  return 'site-nav__link' + (isActive ? ' site-nav__link--active' : '');
                }}
                end={item.end}
                key={item.to}
                onClick={closeMenu}
                to={item.to}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="site-header__actions">
          <NavLink aria-label="Search the library" className="site-header__search" to="/library">
            <Search size={18} strokeWidth={1.8} />
          </NavLink>
          <button
            aria-controls="primary-navigation"
            aria-expanded={open}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            className="site-header__menu"
            onClick={function toggleMenu() {
              setOpen(!open);
            }}
            type="button"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}
