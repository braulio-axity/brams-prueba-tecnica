import { useEffect, useState } from 'react';

// Hook asociado a la determinacion del tamaño de la pantalla ayudando asi al responsive y como mostrar los datos
export function useMediaQuery(query: string) {
  const getMatch = () =>
    typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener?.('change', handler);
    return () => mql.removeEventListener?.('change', handler);
  }, [query]);

  return matches;
}