describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/login')
  })

  it('displays the login form', () => {
    cy.contains('Welcome back').should('be.visible')
    cy.contains('Sign in to your account').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.contains('button', 'Sign In').should('be.visible')
  })

  it('shows validation errors for empty fields', () => {
    cy.contains('button', 'Sign In').click()
    cy.contains('Email is required').should('be.visible')
    cy.contains('Password is required').should('be.visible')
  })

  it('has a working forgot password link', () => {
    cy.contains('Forgot password?').click()
    cy.url().should('include', '/forgot-password')
  })

  it('navigates to signup when clicking "Sign up" link', () => {
    cy.contains('Sign up').click()
    cy.url().should('include', '/signup')
  })
}) 