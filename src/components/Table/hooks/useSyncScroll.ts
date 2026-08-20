import { useEffect, useRef } from 'react';

export const useSyncScroll = () => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const header = headerRef.current;
    const body = bodyRef.current;

    if (!footer) return;

    let isSyncing = false;

    const handleScroll = () => {
      if (isSyncing) return;
      isSyncing = true;

      const scrollLeft = footer.scrollLeft;

      if (header && header.scrollLeft !== scrollLeft) {
        header.scrollLeft = scrollLeft;
      }
      if (body && body.scrollLeft !== scrollLeft) {
        body.scrollLeft = scrollLeft;
      }

      isSyncing = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.shiftKey || e.deltaX !== 0) {
        e.preventDefault();

        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        footer.scrollLeft += delta;
      }
    };

    footer.addEventListener('scroll', handleScroll, { passive: true });

    if (header) header.addEventListener('wheel', handleWheel, { passive: false });
    if (body) body.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      footer.removeEventListener('scroll', handleScroll);
      if (header) header.removeEventListener('wheel', handleWheel);
      if (body) body.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return {
    headerScrollRef: headerRef,
    bodyScrollRef: bodyRef,
    footerScrollRef: footerRef,
  };
};
