describe('Register Component', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display the registration form', () => {
    cy.get('.register').should('exist');
    cy.get('mat-card-title').should('contain', 'Register');
    cy.get('.register-form').should('exist');
  });

  it('should successfully register with valid information', () => {
    cy.intercept('POST', '/api/auth/register', {})
    cy.get('[formControlName="firstName"]').type('John');
    cy.get('[formControlName="lastName"]').type('Doe');
    cy.get('[formControlName="email"]').type('yoga@studio.com');
    cy.get('[formControlName="password"]').type(`${"test!1234"}{enter}{enter}`);

    cy.url().should('include', '/login')
  });

  it('should display an error message for invalid input', () => {
    cy.get('[formControlName="firstName"]').type('J');
    cy.get('[formControlName="lastName"]').type('D');
    cy.get('[formControlName="email"]').type('invalid-email');
    cy.get('[formControlName="password"]').type('short');

    cy.contains('Submit').should('be.disabled')
  });

  it('should display an error if email already exists', () => {
    cy.intercept('POST', '/api/auth/register', { statusCode: 400 })

    cy.get('[formControlName="firstName"]').type('John');
    cy.get('[formControlName="lastName"]').type('Doe');
    cy.get('[formControlName="email"]').type('yoga@studio.com');
    cy.get('[formControlName="password"]').type(`${"test!1234"}{enter}{enter}`);

    cy.contains('An error occurred')
  })
});
