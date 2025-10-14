import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SearchBar } from '../components/SearchBar';

describe('<SearchBar />', () => {
  it('renderiza input accesible (aria-label="buscar") y placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox', { name: /buscar/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Buscar artículos');
    // botón "Limpiar" NO debe existir cuando value === ''
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('llama onChange al escribir y refleja el valor tras rerender (controlado)', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    const { rerender } = render(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: /buscar/i });

    await user.type(input, 'playwright');
    expect(onChange).toHaveBeenCalled(); // se invoca por cada tecla

    // Simula controlado: el padre actualiza y volvemos a renderizar
    rerender(<SearchBar value="playwright" onChange={onChange} />);
    expect(screen.getByRole('textbox', { name: /buscar/i })).toHaveValue('playwright');

    // Botón "Limpiar" aparece cuando hay valor
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('al hacer clic en "Limpiar" invoca onChange con string vacío y oculta el botón', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    const { rerender } = render(<SearchBar value="react" onChange={onChange} />);
    const clearBtn = screen.getByRole('button', { name: /clear/i });

    await user.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith('');

    // Simula que el padre aplica el cambio
    rerender(<SearchBar value="" onChange={onChange} />);
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('muestra el botón de limpiar cuando el valor es sólo espacios (no trimea por diseño actual)', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    const { rerender } = render(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: /buscar/i });

    await user.type(input, '   '); // tres espacios
    // El padre setea "   " tal cual; simulamos el rerender controlado
    rerender(<SearchBar value={'   '} onChange={onChange} />);

    expect(screen.getByRole('textbox', { name: /buscar/i })).toHaveValue('   ');
    // Sigue siendo truthy → debe existir el botón "Limpiar"
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('no interpreta HTML en el valor (XSS básico: se trata como texto)', () => {
    const payload = `<img src=x onerror=alert(1)>`;
    const onChange = jest.fn();

    const { rerender } = render(<SearchBar value="" onChange={onChange} />);
    // Simulamos que el padre establece un valor "peligroso"
    rerender(<SearchBar value={payload} onChange={onChange} />);

    const input = screen.getByRole('textbox', { name: /buscar/i });
    expect(input).toHaveValue(payload);
    // No debe renderizarse ninguna <img> en el árbol del componente
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});