describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002')
  })

  it('displays the logo', () => {
    cy.contains('Shadow').should('be.visible')
    cy.contains('Site').should('be.visible')
  })

  it('has working navigation links', () => {
    cy.contains('About').click()
    cy.url().should('include', '/about')
    
    cy.contains('Services').click()
    cy.url().should('include', '/services')
    
    cy.contains('Contact').click()
    cy.url().should('include', '/contact')
    
    cy.contains('Login').click()
    cy.url().should('include', '/login')
  })

  it('displays the hero section', () => {
    cy.visit('http://localhost:3002')
    // Check for any heading text that's likely to be in the hero section
    cy.get('h1').should('be.visible')
    cy.get('a').contains(/get started|learn more/i).should('be.visible')
  })
}) 