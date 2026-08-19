import { useEffect, useRef } from 'react';

export const useSyncScroll = () => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const header = headerRef.current;
    const body = bodyRef.current;
    const footer = footerRef.current;

    if (!header || !body || !footer) return;
    const elements = [header, body, footer];
    let isSyncing = false;

    const listeners = elements.map((source) => {
      const targets = elements.filter((el) => el !== source);

      const handleScroll = () => {
        if (isSyncing) return;
        isSyncing = true;

        const scrollLeft = source.scrollLeft;

        targets.forEach((target) => {
          if (target.scrollLeft !== scrollLeft) {
            target.scrollLeft = scrollLeft;
          }
        });

        isSyncing = false;
      };

      source.addEventListener('scroll', handleScroll, { passive: true });

      return () => source.removeEventListener('scroll', handleScroll);
    });

    return () => {
      listeners.forEach((cleanUp) => cleanUp());
    };
  }, []);

  return { headerScrollRef: headerRef, bodyScrollRef: bodyRef, footerScrollRef: footerRef };
};
