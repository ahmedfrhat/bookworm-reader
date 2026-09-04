import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useReducedMotion from '../../../hooks/useReducedMotion/useReducedMotion';
import Navbar from '../../Navbar/Navbar';
import Logo from '../../Logo/Logo';
import './AppShell.css';

export default function AppShell({ children }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  useEffect(
    function resetScrollOnRouteChange() {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    },
    [location.pathname, reducedMotion],
  );

  useEffect(
    function activateLenisForMarketingPages() {
      const shouldUseLenis = !reducedMotion && !location.pathname.startsWith('/read/');

      if (!shouldUseLenis) {
        return undefined;
      }

      let cancelled = false;
      let lenis;
      let frameId;

      function raf(time) {
        lenis.raf(time);
        frameId = window.requestAnimationFrame(raf);
      }

      async function startSmoothScroll() {
        const { default: Lenis } = await import('lenis');
        if (cancelled) {
          return;
        }

        lenis = new Lenis({
          duration: 0.9,
          smoothWheel: true,
          syncTouch: false,
        });
        frameId = window.requestAnimationFrame(raf);
      }

      startSmoothScroll();

      return function destroyLenis() {
        cancelled = true;
        if (frameId) {
          window.cancelAnimationFrame(frameId);
        }
        lenis?.destroy();
      };
    },
    [location.pathname, reducedMotion],
  );

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">{children}</main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div>
            <Logo />
            <p>Discover public-domain classics and keep your reading place.</p>
          </div>
          <div className="site-footer__links">
            <Link to="/library">Library</Link>
            <Link to="/my-shelf">My Shelf</Link>
            <Link to="/about">Sources & about</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
