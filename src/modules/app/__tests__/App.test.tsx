import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { App } from '../App';

const mockArticles = [
  { id: '1', title: 'React Tips', image: 'a.jpg', summary: 'Testing Library y buenas prácticas' },
  { id: '2', title: 'NestJS Intro', image: 'b.jpg', summary: 'Controllers y Providers' },
  { id: '3', title: 'Playwright', image: 'c.jpg', summary: 'E2E estable' },
  { id: '4', title: 'Vitest vs Jest', image: 'd.jpg', summary: 'Pros y contras' },
  { id: '5', title: 'Accesibilidad', image: 'e.jpg', summary: 'A11y en React' },
  { id: '6', title: 'Prisma', image: 'f.jpg', summary: 'Migrations y seeds' },
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

    jest.useFakeTimers();
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    jest.useRealTimers();

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { level: 3, name: /react tips/i })
      ).toBeInTheDocument()
    );

    // En desktop (matchMedia mock por defecto), se ven 6 ítems en página 1
    for (let i = 1; i <= 6; i++) {
      expect(
        screen.getByRole('heading', { level: 3, name: mockArticles[i - 1].title })
      ).toBeInTheDocument();
    }
    expect(
      screen.queryByRole('heading', { level: 3, name: mockArticles[6].title })
    ).not.toBeInTheDocument();
  });

  it('filtra por query; `trim()` evita que espacios vacíos filtren todo', async () => {
    render(<App />);

    jest.useFakeTimers();
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    jest.useRealTimers();

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { level: 3, name: /react tips/i })
      ).toBeInTheDocument()
    );

    const user = userEvent.setup();
    const input = screen.getByRole('textbox', { name: /buscar/i });

    // 1) Coincidencia real
    await user.clear(input);
    await user.type(input, 'react');
    expect(
      screen.getByRole('heading', { level: 3, name: /react tips/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 3, name: /nestjs intro/i })
    ).not.toBeInTheDocument();

    // 2) Sólo espacios -> trim => lista completa (primera página)
    await user.clear(input);
    await user.type(input, '   ');
    for (let i = 1; i <= 6; i++) {
      expect(
        screen.getByRole('heading', { level: 3, name: mockArticles[i - 1].title })
      ).toBeInTheDocument();
    }

    // 3) Sin coincidencias
    await user.clear(input);
    await user.type(input, 'zzzzzz');
    expect(screen.getByRole('status')).toHaveTextContent(/no hay artículos/i);
  });
});