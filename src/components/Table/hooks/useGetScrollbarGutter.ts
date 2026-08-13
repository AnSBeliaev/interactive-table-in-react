import { useLayoutEffect, useRef, useState } from 'react';
import { getScrollbarWidth } from '../helpers';
import type { TableRowItem, Tag } from '../types';

export const useGetScrollbarGutter = (
  normalizedDocuments: (TableRowItem & {
    tagsByOrder: Tag[];
  })[],
) => {
  const [scrollbarGutter, setScrollbarGutter] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const nativeScrollbarWidth = getScrollbarWidth();

    const updateScrollbarGutter = () => {
      const hasVerticalScrollbar = viewport.scrollHeight > viewport.clientHeight;
      setScrollbarGutter(hasVerticalScrollbar ? nativeScrollbarWidth : 0);
    };

    updateScrollbarGutter();

    const observer = new ResizeObserver(updateScrollbarGutter);
    observer.observe(viewport);
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);

    return () => observer.disconnect();
  }, [normalizedDocuments]);

  return { scrollbarGutter, viewportRef };
};
