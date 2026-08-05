import { useRef, type RefObject } from 'react';

type HandleScrollArgs<T> = {
  sourceRef: React.RefObject<T | null>;
  firstTargetRef: React.RefObject<T | null>;
  secondTargetRef: React.RefObject<T | null>;
};

export const useSyncScroll = <T>() => {
  const headerScrollRef = useRef<T | null>(null);
  const bodyScrollRef = useRef<T | null>(null);
  const footerScrollRef = useRef<T | null>(null);

  const activeSourceRef = useRef<RefObject<HTMLDivElement | null> | null>(null);
  const handleScroll = ({ sourceRef, firstTargetRef, secondTargetRef }: HandleScrollArgs<HTMLDivElement>) => {
    if (activeSourceRef.current && activeSourceRef.current !== sourceRef) {
      return;
    }

    activeSourceRef.current = sourceRef;

    if (firstTargetRef.current && sourceRef.current) {
      firstTargetRef.current.scrollLeft = sourceRef.current.scrollLeft;
    }
    if (secondTargetRef.current && sourceRef.current) {
      secondTargetRef.current.scrollLeft = sourceRef.current.scrollLeft;
    }

    window.requestAnimationFrame(() => {
      if (activeSourceRef.current === sourceRef) {
        activeSourceRef.current = null;
      }
    });
  };

  return { handleScroll, headerScrollRef, bodyScrollRef, footerScrollRef };
};
