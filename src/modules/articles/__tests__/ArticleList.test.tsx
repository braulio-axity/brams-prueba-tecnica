import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ArticleList } from '../components/ArticleList';

const mkArticles = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    title: `Artículo ${i + 1}`,
    image: `https://picsum.photos/seed/a${i}/200/150`,
    summary: `Resumen ${i + 1}`,
  }));

/**
 * Regla esperada:
 * - <640 => 3 por página
 * - 640..1023 => 4 por página
 * - >=1024 => 6 por página
 */
describe('<ArticleList /> responsive', () => {
  afterEach(() => {
    // default desktop
    (window as any).__width = 1280;
  });

  it('mobile: muestra 3 por página (<640px)', () => {
    (window as any).__width = 500; // mobile

    const items = mkArticles(10);
    render(<ArticleList items={items} />);

    for (let i = 1; i <= 3; i++) {
      expect(
        screen.getByRole('heading', { level: 3, name: `Artículo ${i}` })
      ).toBeInTheDocument();
    }
    expect(screen.queryByRole('heading', { name: 'Artículo 4' })).not.toBeInTheDocument();

    expect(screen.getByTestId('page-indicator')).toHaveTextContent('Página 1 de 4');
  });

  it('tablet: muestra 4 por página (>=640 && <1024)', () => {
    (window as any).__width = 800; // tablet

    const items = mkArticles(10);
    render(<ArticleList items={items} />);

    for (let i = 1; i <= 4; i++) {
      expect(
        screen.getByRole('heading', { level: 3, name: `Artículo ${i}` })
      ).toBeInTheDocument();
    }
    expect(screen.queryByRole('heading', { name: 'Artículo 5' })).not.toBeInTheDocument();

    expect(screen.getByTestId('page-indicator')).toHaveTextContent('Página 1 de 3');
  });

  it('desktop: muestra 6 por página (>=1024)', () => {
    (window as any).__width = 1280;

    const items = mkArticles(10);
    render(<ArticleList items={items} />);

    for (let i = 1; i <= 6; i++) {
      expect(
        screen.getByRole('heading', { level: 3, name: `Artículo ${i}` })
      ).toBeInTheDocument();
    }
    expect(screen.queryByRole('heading', { name: 'Artículo 7' })).not.toBeInTheDocument();

    expect(screen.getByTestId('page-indicator')).toHaveTextContent('Página 1 de 2');
  });

  it('cuando totalPages = 1 deshabilita prev y next', () => {
    const items = mkArticles(3);
    (window as any).__width = 1280;

    render(<ArticleList items={items} />);

    expect(screen.getByTestId('page-indicator')).toHaveTextContent('Página 1 de 1');
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});