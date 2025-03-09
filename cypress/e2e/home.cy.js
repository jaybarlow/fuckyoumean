describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001')
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
    cy.visit('http://localhost:3001')
    cy.contains('Modern Shadow Website').should('be.visible')
    cy.contains('Get Started').should('be.visible')
  })
}) 