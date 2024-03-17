describe('List Component', () => {

  it('should show sessions after logged in as admin', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'First try',
          date: '2023-09-30T00:00:00.000+00:00',
          teacher_id: 1,
          description: 'Yoga could be some cool activity to try',
          users: [],
          createdAt: '2023-09-30T16:40:26',
          updatedAt: '2023-09-30T16:41:53',
        }
      ]
    ).as('session');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`);

    cy.get('.mat-card-title').contains('First');
  });

  it('should display the list of rentals', () => {
    cy.get('.list').should('exist');
    cy.get('mat-card-title').should('contain', 'Rentals available');
    cy.get('.item').should('have.length.gt', 0);
  });

  it('should display the "Edit" button for admin users', () => {
    cy.get('.list .item button').eq(1).should('exist').should('contain', 'Edit');
  });

  it('should display the "Create" button for admin users', () => {
    cy.get('.list button[routerLink="create"]').should('exist').should('contain', 'Create');
  });

  it('should navigate to the update page when "Edit" button is clicked', () => {
    cy.get('.list .item button').eq(1).click();

    cy.url().should('include', '/update');
  });

  it('should show sessions after logged in as user', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'First try',
          date: '2023-09-30T00:00:00.000+00:00',
          teacher_id: 1,
          description: 'Yoga could be some cool activity to try',
          users: [],
          createdAt: '2023-09-30T16:40:26',
          updatedAt: '2023-09-30T16:41:53',
        }
      ]
    ).as('session');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`);
  });

  it('should not display the "Create" button for non-admin users', () => {
    cy.get('.list button[routerLink="create"]').should('not.exist');
  });

  it('should not display the "Edit" button for non-admin users', () => {
    cy.get('.list .item button[routerLink*="update"]').should("not.exist");
  });

  it('should navigate to the detail page when "Detail" button is clicked', () => {
    cy.get('.list .item button').first().click();

    cy.url().should('include', '/detail');
  });
});
