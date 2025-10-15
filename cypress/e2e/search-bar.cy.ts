/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

// Forzamos mobile para que PAGE_SIZE sea 4 de forma determinística
const PAGE_SIZE_MOBILE = 4;

describe('SearchBar', () => {
  beforeEach(() => {
    cy.viewport(400, 800); // mobile

    // Cargamos fixture y la usamos en asserts dinámicos
    cy.fixture('articles.json').as('fx');

    cy.intercept('GET', '/mock/articles.json', { fixture: 'articles.json' }).as('getArticles');

    cy.visit('/');
    cy.wait('@getArticles');
  });

  it('muestra placeholder y el botón "Limpiar" aparece solo cuando hay texto', () => {
    cy.findByRole('textbox', { name: /buscar/i })
      .should('have.attr', 'placeholder', 'Buscar artículos')
      .and('have.value', '');

    // Sin texto => no aparece botón Limpiar
    cy.findByRole('button', { name: /clear/i }).should('not.exist');

    // Al tipear => aparece
    cy.findByRole('textbox', { name: /buscar/i }).type('react');
    cy.findByRole('button', { name: /clear/i }).should('be.visible');
  });

  it('filtra por texto presente en el TÍTULO (case-insensitive)', function () {
    cy.findByRole('textbox', { name: /buscar/i }).clear().type('react');

    const filtered = (this.fx as any[]).filter(
      (a) => /react/i.test(a.title) || /react/i.test(a.summary)
    );
    const expected = Math.min(PAGE_SIZE_MOBILE, filtered.length);

    cy.findAllByLabelText('article-card').should('have.length', expected);

    // Aseguramos que un título no relacionado NO aparezca
    const nonReact = (this.fx as any[]).find((a) => !/react/i.test(a.title));
    if (nonReact) {
      cy.findByRole('heading', { level: 3, name: new RegExp(`^${escapeRegex(nonReact.title)}$`, 'i') })
        .should('not.exist');
    }
  });

  it('filtra por texto presente en el SUMMARY (no sólo título)', function () {
    // Busca una palabra común de summaries en la fixture ("Controllers" o "A11y" etc.)
    // Usamos "A11y" como ejemplo
    cy.findByRole('textbox', { name: /buscar/i }).clear().type('a11y');

    const filtered = (this.fx as any[]).filter(
      (a) => /a11y/i.test(a.title) || /a11y/i.test(a.summary)
    );
    const expected = Math.min(PAGE_SIZE_MOBILE, filtered.length);

    cy.findAllByLabelText('article-card').should('have.length', expected);
  });

  it('trim: si escribo sólo espacios, se muestra la lista completa (página 1)', function () {
    cy.findByRole('textbox', { name: /buscar/i }).clear().type('   ');

    const total = (this.fx as any[]).length;
    const expected = Math.min(PAGE_SIZE_MOBILE, total);

    cy.findAllByLabelText('article-card').should('have.length', expected);
  });

  it('el botón "Limpiar" borra el texto y restaura la lista', function () {
    const total = (this.fx as any[]).length;

    cy.findByRole('textbox', { name: /buscar/i }).clear().type('react');
    cy.findAllByLabelText('article-card').should('have.length.lte', PAGE_SIZE_MOBILE);

    cy.findByRole('button', { name: /clear/i }).click();
    cy.findByRole('textbox', { name: /buscar/i }).should('have.value', '');

    const expected = Math.min(PAGE_SIZE_MOBILE, total);
    cy.findAllByLabelText('article-card').should('have.length', expected);
  });

  it('sin coincidencias: muestra mensaje de estado y deshabilita paginación', () => {
    cy.findByRole('textbox', { name: /buscar/i }).clear().type('zzzzzz');

    cy.findByRole('status').should('have.text', 'No hay artículos');
    cy.findByTestId('page-indicator').should('have.text', 'Página 1 de 1');
    cy.findByRole('button', { name: /prev/i }).should('be.disabled');
    cy.findByRole('button', { name: /next/i }).should('be.disabled');
  });

  it('accesibilidad básica del control: rol y label', () => {
    cy.findByRole('textbox', { name: /buscar/i }).should('exist');
    // Si en el futuro agregas label visible (no sólo aria-label), esto seguirá pasando
  });
});

// Utilidad para crear RegExp seguros a partir de strings literales
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
