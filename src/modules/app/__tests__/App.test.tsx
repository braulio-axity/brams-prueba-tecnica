import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { App } from '../App';

// 🔒 FIJAMOS page size a 12 en todas las pruebas de este archivo
jest.mock('../../../utils/hooks/usePageSize', () => ({
  usePageSize: () => 12,
}));

const mockArticles = [
  { id: '1', title: 'React Tips', image: 'a.jpg', summary: 'Testing Library y buenas prácticas' },
  { id: '2', title: 'NestJS Intro', image: 'b.jpg', summary: 'Controllers y Providers' },
  { id: '3', title: 'Playwright', image: 'c.jpg', summary: 'E2E estable' },
  { id: '4', title: 'Vitest vs Jest', image: 'd.jpg', summary: 'Pros y contras' },
  { id: '5', title: 'Accesibilidad', image: 'e.jpg', summary: 'A11y en React' },
  { id: '6', title: 'Prisma', image: 'f.jpg', summary: 'Migrations y seeds' }, // 👈 Asegúrate que sea "Prisma"
  { id: '7', title: 'k6', image: 'g.jpg', summary: 'Carga y performance' },
];

describe('<App />', () => {
  let originalFetch: typeof globalThis.fetch | undefined;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    (globalThis as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockArticles,
    });
  });

  afterEach(() => {
    if ((globalThis as any).fetch && (globalThis.fetch as any).mockClear) {
      (globalThis.fetch as any).mockClear();
    }
    (globalThis as any).fetch = originalFetch as any;
  });

  it('muestra estado vacío, luego renderiza artículos tras el fetch simulado', async () => {
    render(<App />);

    // Antes del fetch: lista vacía
    expect(screen.getByRole('status')).toHaveTextContent(/no hay artículos/i);

    // Avanza los 200ms del setTimeout y vuelve a timers reales
    jest.useFakeTimers();
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    jest.useRealTimers();

    // Espera a que la UI muestre los datos
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 3, name: /react tips/i })).toBeInTheDocument()
    );

    // Page size 12 (mockeado) + 7 artículos => TODOS visibles en Primera página
    for (const a of mockArticles) {
      expect(screen.getByRole('heading', { level: 3, name: a.title })).toBeInTheDocument();
    }
    expect(screen.getByTestId('page-indicator')).toHaveTextContent('Página 1 de 1');
  });

  it('filtra por query; `trim()` evita que espacios vacíos filtren todo', async () => {
    render(<App />);

    // Avanza los 200ms del setTimeout y vuelve a timers reales
    jest.useFakeTimers();
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    jest.useRealTimers();

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 3, name: /react tips/i })).toBeInTheDocument()
    );

    const user = userEvent.setup();
    const input = screen.getByRole('textbox', { name: /buscar/i });

    // 1) Coincidencia real
    await user.clear(input);
    await user.type(input, 'react');
    expect(screen.getByRole('heading', { level: 3, name: /react tips/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: /nestjs intro/i })).not.toBeInTheDocument();

    // 2) Sólo espacios -> trim => lista completa (página 1 con todos visibles)
    await user.clear(input);
    await user.type(input, '   ');
    for (const a of mockArticles) {
      expect(screen.getByRole('heading', { level: 3, name: a.title })).toBeInTheDocument();
    }
    expect(screen.getByTestId('page-indicator')).toHaveTextContent('Página 1 de 1');

    // 3) Sin coincidencias
    await user.clear(input);
    await user.type(input, 'zzzzzz');
    expect(screen.getByRole('status')).toHaveTextContent(/no hay artículos/i);
  });
});
