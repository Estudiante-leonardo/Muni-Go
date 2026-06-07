import { useEffect } from 'react';

export default function useEscapeKey(handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handler();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handler, enabled]);
}
