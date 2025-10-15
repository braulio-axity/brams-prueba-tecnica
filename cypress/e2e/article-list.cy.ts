/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

// Elegimos mobile para garantizar paginación con la mayoría de datasets.
const PAGE_SIZE = 4; // mobile (<640) según tu usePageSize actual (4/8/12)

describe('Article List', () => {
  beforeEach(() => {
    cy.viewport(400, 800); // mobile

    // Cargamos la fixture una vez y la usamos en asserts dinámicos
    cy.fixture('articles.json').as('fx');

    cy.intercept('GET', '/mock/articles.json', { fixture: 'articles.json' }).as('getArticles');

    cy.visit('/');
    cy.wait('@getArticles');
  });

  it('carga inicial: header, cards (página 1) y estado de paginación', function () {
    cy.findByRole('heading', { level: 1, name: /dev tester assessment/i }).should('be.visible');

    const total = this.fx.length as number;
    const expectedFirstPage = Math.min(PAGE_SIZE, total);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    cy.findAllByLabelText('article-card').should('have.length', expectedFirstPage);
    cy.findByTestId('page-indicator').should('have.text', `Página 1 de ${totalPages}`);

    // prev deshabilitado en página 1; next depende de si hay más páginas
    cy.findByRole('button', { name: /prev/i }).should('be.disabled');
    if (totalPages > 1) {
      cy.findByRole('button', { name: /next/i }).should('be.enabled');
    } else {
      cy.findByRole('button', { name: /next/i }).should('be.disabled');
    }
  });

  it('filtra usando el SearchBar', function () {
    const total = this.fx.length as number;

    // Busca "react" (en title o summary)
    cy.findByRole('textbox', { name: /buscar/i }).clear().type('react');

    const filtered = (this.fx as any[]).filter((a) =>
      /react/i.test(a.title) || /react/i.test(a.summary)
    );
    const expectedVisible = Math.min(PAGE_SIZE, filtered.length);

    cy.findAllByLabelText('article-card').should('have.length', expectedVisible);

    // Sólo espacios -> trim => vuelve a lista completa (página 1)
    cy.findByRole('textbox', { name: /buscar/i }).clear().type('   ');
    const expectedFirstPage = Math.min(PAGE_SIZE, total);
    cy.findAllByLabelText('article-card').should('have.length', expectedFirstPage);

    // Sin coincidencias
    cy.findByRole('textbox', { name: /buscar/i }).clear().type('zzzzzz');
    cy.findByRole('status').should('have.text', 'No hay artículos');
  });

  it('navega entre páginas (next / prev)', function () {
    const total = this.fx.length as number;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    if (totalPages === 1) {
      // No hay paginación posible con este dataset; validamos estado bloqueado
      cy.findByTestId('page-indicator').should('have.text', 'Página 1 de 1');
      cy.findByRole('button', { name: /prev/i }).should('be.disabled');
      cy.findByRole('button', { name: /next/i }).should('be.disabled');
      return;
    }

    // Ir a página 2
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByTestId('page-indicator').should('have.text', `Página 2 de ${totalPages}`);

    // Conteo en página 2: si quedan menos de PAGE_SIZE, muestra el resto
    const remainderAfterPage1 = total - PAGE_SIZE;
    const expectedPage2 = Math.min(PAGE_SIZE, remainderAfterPage1);
    cy.findAllByLabelText('article-card').should('have.length', expectedPage2);

    // En última página, next debe estar deshabilitado
    if (totalPages === 2) {
      cy.findByRole('button', { name: /next/i }).should('be.disabled');
    } else {
      // Avanza al final para verificar bloqueo
      for (let p = 3; p <= totalPages; p++) cy.findByRole('button', { name: /next/i }).click();
      cy.findByTestId('page-indicator').should('have.text', `Página ${totalPages} de ${totalPages}`);
      cy.findByRole('button', { name: /next/i }).should('be.disabled');
    }

    // Volver a página 1
    for (let p = totalPages - 1; p >= 1; p--) cy.findByRole('button', { name: /prev/i }).click();
    cy.findByTestId('page-indicator').should('have.text', 'Página 1 de ' + totalPages);
    cy.findByRole('button', { name: /prev/i }).should('be.disabled');
  });
});