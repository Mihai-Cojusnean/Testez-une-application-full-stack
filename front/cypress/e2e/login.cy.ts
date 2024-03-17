describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.get('.login').should('exist');
    cy.get('mat-card-title').should('contain', 'Login');
    cy.get('.login-form').should('exist');
  });

  it('should successfully log in with valid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('[formControlName="email"]').type('yoga@studio.com');
    cy.get('[formControlName="password"]').type(`test!1234{enter}{enter}`);

    cy.url().should('include', '/sessions')
  });

  it('should display an error message for invalid credentials', () => {
    cy.get('[formControlName="email"]').type('invalid-email');
    cy.get('[formControlName="password"]').type(`short{enter}{enter}`);

    cy.get('.error').should('exist');
  });

  it('should display an error and submit button disabled if password field is not set', () => {
    cy.intercept('POST', '/api/auth/login', {statusCode: 401})

    cy.get('input[formControlName=email]').type(`yoga@studio.com{enter}{enter}`)
    cy.get('input[formControlName=password]').should('have.class', 'ng-invalid')
    cy.contains('Submit').should('be.disabled')
    cy.contains('An error occurred')
  })

  it('should display an error and submit button disabled if email field is not set', () => {
    cy.intercept('POST', '/api/auth/login', {statusCode: 401})

    cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`)
    cy.get('input[formControlName=email]').should('have.class', 'ng-invalid')
    cy.contains('Submit').should('be.disabled')
    cy.contains('An error occurred')
  })
});
