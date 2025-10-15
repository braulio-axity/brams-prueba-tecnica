// test/setupTests.ts
import '@testing-library/jest-dom';

declare global {
  interface Window {
    __width?: number;
    __setViewportWidth?: (w: number) => void;
  }
}

function matchMediaMock(query: string): MediaQueryList {
  const width = window.__width ?? 1280;
  const min = /min-width:\s*(\d+)px/.exec(query);
  const max = /max-width:\s*(\d+)px/.exec(query);
  let matches = true;
  if (min) matches = matches && width >= Number(min[1]);
  if (max) matches = matches && width <= Number(max[1]);
  return {
    media: query,
    matches,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true,
  } as any;
}

// ⚠️ Sobrescribe SIEMPRE:
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (q: string) => matchMediaMock(q),
});

window.__setViewportWidth = (w: number) => {
  window.__width = w;
};
