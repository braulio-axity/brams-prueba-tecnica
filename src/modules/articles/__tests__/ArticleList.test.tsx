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
 * usePageSize actual:
 * - <640   => 4 por página
 * - 640..1023 => 8 por página
 * - >=1024 => 12 por página
 */
describe('<ArticleList /> responsive', () => {
  afterEach(() => {
    // aseguramos volver a "desktop" por defecto entre tests
    (window as any).__setViewportWidth?.(1280);
  });

  it('mobile: muestra 4 por página (<640px)', () => {
    (window as any).__setViewportWidth?.(500);

    render(<ArticleList items={mkArticles(10)} />);

    for (let i = 1; i <= 4; i++) {
      expect(
        screen.getByRole('heading', { level: 3, name: `Artículo ${i}` })
      ).toBeInTheDocument();
    }
    // el 5º no debe aparecer en la primera página
    expect(screen.queryByRole('heading', { level: 3, name: 'Artículo 5' })).not.toBeInTheDocument();

    // 10/4 => 3 páginas
    expect(screen.getByTestId('page-indicator')).toHaveTextContent('Página 1 de 3');
  });

  it('tablet: muestra 8 por página (>=640 && <1024)', () => {
    (window as any).__setViewportWidth?.(800);

    render(<ArticleList items={mkArticles(10)} />);

    for (let i = 1; i <= 8; i++) {
      expect(
        screen.getByRole('heading', { level: 3, name: `Artículo ${i}` })
      ).toBeInTheDocument();
    }
    // el 9º no debe estar en la primera página
    expect(screen.queryByRole('heading', { level: 3, name: 'Artículo 9' })).not.toBeInTheDocument();

    // 10/8 => 2 páginas
    expect(screen.getByTestId('page-indicator')).toHaveTextContent('Página 1 de 2');
  });

  it('desktop: muestra 12 por página (>=1024)', () => {
    (window as any).__setViewportWidth?.(1280);

    const items = mkArticles(10); // todo cabe en una sola página
    render(<ArticleList items={items} />);

    for (let i = 1; i <= 10; i++) {
      expect(
        screen.getByRole('heading', { level: 3, name: `Artículo ${i}` })
      ).toBeInTheDocument();
    }

    // indicador: 1 sola página
    expect(screen.getByTestId('page-indicator')).toHaveTextContent('Página 1 de 1');
  });

  it('cuando totalPages = 1 deshabilita prev y next', () => {
    (window as any).__setViewportWidth?.(1280); // desktop => 12 por página
    const items = mkArticles(3);

    render(<ArticleList items={items} />);

    expect(screen.getByTestId('page-indicator')).toHaveTextContent('Página 1 de 1');
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});