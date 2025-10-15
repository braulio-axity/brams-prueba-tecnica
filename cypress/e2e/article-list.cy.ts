/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Article List', () => {
  beforeEach(() => {
    // Desktop para asegurar page size = 6 en tu ArticleList responsive
    cy.viewport(1280, 800);

    // Intercepta el fetch y sirve un dataset estable
    cy.intercept('GET', '/mock/articles.json', { fixture: 'articles.json' }).as('getArticles');

    cy.visit('/');
    cy.wait('@getArticles'); // Espera la carga
  });

  it('carga inicial: header, cards (página 1) y estado de paginación', () => {
    // Header
    cy.findByRole('heading', { level: 1, name: /dev tester assessment/i }).should('be.visible');

    // En desktop: 6 cards visibles (7mo queda en página 2)
    cy.findAllByLabelText('article-card').should('have.length', 6);

    // Indicador de página y estado de botones
    cy.findByTestId('page-indicator').should('have.text', 'Página 1 de 2');
    cy.findByRole('button', { name: /prev/i }).should('be.disabled');
    cy.findByRole('button', { name: /next/i }).should('be.enabled');
  });

  it('filtra usando el SearchBar', () => {
    // 1) Filtro positivo
    cy.findByRole('textbox', { name: /buscar/i }).clear().type('react');
  
    // Con la fixture, deberían quedar 2 cards: "React Tips" y "Accesibilidad" (summary contiene React)
    cy.findAllByLabelText('article-card').should('have.length', 2);
  
    // Valida por texto visible (títulos/summaries)
    cy.findByRole('heading', { level: 3, name: /react tips/i }).should('be.visible');
    cy.findByRole('heading', { level: 3, name: /accesibilidad/i }).should('be.visible');
  
    // 2) Sólo espacios -> trim => vuelve lista completa (página 1, desktop = 6)
    cy.findByRole('textbox', { name: /buscar/i }).clear().type('   ');
    cy.findAllByLabelText('article-card').should('have.length', 6);
  
    // 3) Sin coincidencias
    cy.findByRole('textbox', { name: /buscar/i }).clear().type('zzzzzz');
    cy.findByRole('status').should('have.text', 'No hay artículos');
  });

  it('navega entre páginas (next / prev)', () => {
    // Ir a página 2
    cy.findByRole('button', { name: /next/i }).click();

    cy.findByTestId('page-indicator').should('have.text', 'Página 2 de 2');
    cy.findAllByLabelText('article-card').should('have.length', 1); // 7mo ítem en desktop
    cy.findByRole('button', { name: /next/i }).should('be.disabled');
    cy.findByRole('button', { name: /prev/i }).should('be.enabled');

    // Volver a página 1
    cy.findByRole('button', { name: /prev/i }).click();
    cy.findByTestId('page-indicator').should('have.text', 'Página 1 de 2');
    cy.findAllByLabelText('article-card').should('have.length', 6);
  });
});
