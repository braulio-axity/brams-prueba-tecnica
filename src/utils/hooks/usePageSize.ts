import { useMemo } from 'react';
import { useMediaQuery } from './useMediaQuery';

/**
 * Hook para establecer breakpoints como ejercicio de prueba
 * Regla:
 * - Mobile (<640px): 3 por página
 * - Tablet (>=640 && <1024): 4 por página
 * - Desktop (>=1024): 6 por página
 */
export function usePageSize() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 640px)'); // si es true y no desktop => tablet

  return useMemo(() => {
    if (isDesktop) return 12;
    if (isTablet) return 8;
    return 4; // mobile
  }, [isDesktop, isTablet]);
}