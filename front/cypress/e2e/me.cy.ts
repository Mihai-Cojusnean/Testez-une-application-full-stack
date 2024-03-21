describe('User Information Component', () => {
  it('should login and access "Account" page as Admin', () => {
    cy.login(true);

    cy.get('[routerLink="me"]').click();

    cy.get('.mat-card-title').should('contain', 'User information');
  });

  it('should display correct user information', () => {
    cy.get('p').eq(0).should('contain', 'Name: firstName LASTNAME');
    cy.get('p').eq(1).should('contain', 'Email: yoga@studio.com');
    cy.get('p').eq(2).should('contain', 'You are admin');
    cy.get('p').eq(3).should('contain.text', 'Create at:  April 3, 2024');
    cy.get('p').eq(4).should('contain.text', 'Last update:  May 3, 2024');
  });

  it('should login and access "Account" page as User', () => {
    cy.login(false);

    cy.get('[routerLink="me"]').click();

    cy.get('.mat-card-title').should('contain', 'User information');
    cy.get('p').eq(2).should('not.contain', 'You are admin');
    // Should be delete!!
    cy.get('button').should('contain', 'Detail');
  });

  it('should require a name to be submitted', () => {
    cy.intercept('DELETE', `/api/user/1`, {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'yoga@studio.com',
        admin: false,
        createdAt: '04/03/2024',
        updatedAt: '05/03/2024'
      },
    }).as('userRetrieved');

    cy.login(false);

    cy.get('[routerLink="me"]').click();
    cy.contains('button', 'delete').click();

    cy.contains('Your account has been deleted !').should('be.visible');
    cy.url().should('eq', 'http://localhost:4200/');
  });

  it('should redirects sessions page when clicking the back button', () => {
    cy.login(false);

    cy.get('[routerLink="me"]').click();
    cy.contains('button', 'arrow_back').click();

    cy.url().should('eq', 'http://localhost:4200/sessions');
  });
});
