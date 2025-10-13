/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Article List', () => {
  it('carga artículos, filtra y navega entre páginas', () => {
    cy.visit('/')

    // Carga inicial
    cy.findByRole('heading', { name: /dev tester assessment/i }).should('exist')
    // Esperar a que el fetch simulado cargue y haya al menos 1 card
    cy.findAllByLabelText('article-card').its('length').should('be.gte', 1)

    // Paginación (si aplica): ir a siguiente y volver antes de filtrar
    cy.findByRole('button', { name: /next/i }).click({ force: true })
    cy.findByTestId('page-indicator').should('contain.text', 'Página')
    cy.findByRole('button', { name: /prev/i }).click({ force: true })

    // Filtrar
    cy.findByRole('textbox', { name: /buscar/i }).type('Cypress')
    cy.findAllByLabelText('article-card').each(($el) => {
      cy.wrap($el).contains(/cypress/i)
    })
  })
})
