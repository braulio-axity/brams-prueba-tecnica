import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

describe('useMediaQuery', () => {
  const originalMM = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMM;
  });

  it('retorna false si window.matchMedia no existe', () => {
    window.matchMedia = undefined;
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(false);
  });

  it('escucha cambios (event listener "change") y actualiza matches', () => {
    // mock controlable
    let _matches = false;
    const listeners = new Set<(e: MediaQueryListEvent) => void>();
    window.matchMedia = (q: string) => ({
      media: q,
      matches: _matches,
      addEventListener: (_evt: 'change', cb: any) => listeners.add(cb),
      removeEventListener: (_evt: 'change', cb: any) => listeners.delete(cb),
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => true,
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(false);

    act(() => {
      _matches = true;
      const ev = { matches: true } as MediaQueryListEvent;
      listeners.forEach((cb) => cb(ev));
    });

    expect(result.current).toBe(true);
  });
});