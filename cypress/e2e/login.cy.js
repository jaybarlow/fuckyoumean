describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002/login')
  })

  it('displays the login form', () => {
    cy.get('form').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it.skip('shows validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click()
    cy.get('form').contains(/required|invalid/i).should('be.visible')
  })

  it('has a working forgot password link', () => {
    cy.contains(/forgot|reset/i).click()
    cy.url().should('include', '/forgot-password')
  })

  it.skip('navigates to signup when clicking sign up link', () => {
    cy.get('a').contains(/sign up|register|create account/i).click({ force: true })
    cy.url().should('include', '/signup')
  })
}) 