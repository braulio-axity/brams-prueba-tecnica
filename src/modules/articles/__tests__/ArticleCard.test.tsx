import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ArticleCard } from '../components/ArticleCard';

const mockArticle = {
  id: '1',
  title: 'Título de prueba',
  image: 'https://picsum.photos/seed/test/400/300',
  summary: 'Resumen de prueba',
};

describe('<ArticleCard />', () => {
  it('renderiza título (h3), imagen (con alt) y resumen', () => {
    render(<ArticleCard article={mockArticle} />);

    // Imagen accesible por alt = title
    const img = screen.getByRole('img', { name: /título de prueba/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockArticle.image);
    expect(img).toHaveAttribute('alt', mockArticle.title);

    // Heading nivel 3 con el título
    expect(
      screen.getByRole('heading', { level: 3, name: /título de prueba/i })
    ).toBeInTheDocument();

    // Resumen visible
    expect(screen.getByText(/resumen de prueba/i)).toBeInTheDocument();
  });

  it('expone el contenedor con aria-label="article-card"', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByLabelText(/article-card/i)).toBeInTheDocument();
  });

  it('soporta datos “vacíos” sin crashear (title/summary vacíos)', () => {
    const emptyArticle = {
      id: '2',
      title: '',
      image: 'https://picsum.photos/seed/test/400/300',
      summary: '',
    };
    render(<ArticleCard article={emptyArticle} />);

    // El <img alt=""> NO tiene role="img"; es presentational.
    // Opción A: localizar por alt vacío:
    const decorativeImg = screen.getByAltText('');
    expect(decorativeImg).toBeInTheDocument();

    // El h3 existe pero sin nombre accesible
    const h3 = screen.getByRole('heading', { level: 3 });
    expect(h3).toBeInTheDocument();
    expect(h3).toHaveTextContent('');

    // El párrafo existe y está vacío
    const p = screen.getByText('', { selector: 'p.card-summary' });
    expect(p).toBeInTheDocument();
    expect(p).toHaveTextContent('');
  });
});