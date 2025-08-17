import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Only scroll to top if the pathname actually changed (not on page refresh)
    if (prevPathnameRef.current !== pathname) {
      console.log('ScrollToTop: Pathname changed, scrolling to top');
      window.scrollTo(0, 0);
      prevPathnameRef.current = pathname;
    } else {
      console.log('ScrollToTop: Pathname unchanged (likely page refresh)');
    }
  }, [pathname]);

  return null;
}; 