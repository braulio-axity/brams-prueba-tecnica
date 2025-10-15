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
    expect(onChange).toHaveBeenCalled();

    // volvemos a renderiizar
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

    // Simula que cambia el valor de entrada a "" no deberia verse el boton
    rerender(<SearchBar value="" onChange={onChange} />);
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();

     // Simula que cambia el valor de entrada a "holamundo" en este caso si deberia verse el boton
     rerender(<SearchBar value="holamundo" onChange={onChange} />);
     expect(screen.queryByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('muestra el botón de limpiar cuando el valor es sólo espacios, no hay restriccion', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    const { rerender } = render(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: /buscar/i });

    await user.type(input, '   ');
    rerender(<SearchBar value={'   '} onChange={onChange} />);

    expect(screen.getByRole('textbox', { name: /buscar/i })).toHaveValue('   ');
    // el boton limpiar deberia verse
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('no interpreta HTML en el valor (XSS básico)', () => {
    const payload = `<img src=x onerror=alert(1)>`;
    const onChange = jest.fn();

    const { rerender } = render(<SearchBar value="" onChange={onChange} />);
    // Simulamos llega un valor "peligroso"
    rerender(<SearchBar value={payload} onChange={onChange} />);

    const input = screen.getByRole('textbox', { name: /buscar/i });
    expect(input).toHaveValue(payload);
    // No debe renderizarse ninguna <img> en el árbol del componente
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});