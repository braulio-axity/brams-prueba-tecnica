import '@testing-library/jest-dom';

declare global {
  interface Window {
    __width?: number;
  }
}

/**
 * Mock de matchMedia con un ancho "virtual" controlable.
 * Por defecto, 1280px (desktop).
 */
function matchMediaMock(query: string) {
  const width = window.__width ?? 1280;

  const min = /min-width:\s*(\d+)px/.exec(query);
  const max = /max-width:\s*(\d+)px/.exec(query);

  let matches = true;
  if (min) matches = matches && width >= Number(min[1]);
  if (max) matches = matches && width <= Number(max[1]);

  const mql: MediaQueryList = {
    media: query,
    matches,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},    // legacy (jsdom)
    removeListener: () => {}, // legacy
    dispatchEvent: () => true,
  } as any;

  return mql;
}

if (!window.matchMedia) {
  window.matchMedia = (q: string) => matchMediaMock(q);
}