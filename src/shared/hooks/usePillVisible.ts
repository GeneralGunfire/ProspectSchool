import { useState, useEffect } from 'react';

export function usePillVisible() {
  const [pillVisible, setPillVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    let collapseAt = 0;

    const onScroll = () => {
      const y = window.scrollY;
      if (pillVisible && y > lastY && y > 150) {
        setPillVisible(false);
        collapseAt = y;
      } else if (!pillVisible && y < lastY && collapseAt - y > 80) {
        setPillVisible(true);
      }
      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pillVisible]);

  return pillVisible;
}
