const interceptLoginData = (isAdmin: boolean) => {
  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 1,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: isAdmin,
    },
  });
};

const interceptSessionData = () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/api/session',
    },
    [{
      id: 1,
      name: 'Session 1',
      date: '1902-01-01T00:00:00.000+00:00',
      teacher_id: 1,
      description: 'Yoga could be some cool activity to try',
      users: [1],
      createdAt: '2023-09-30T16:40:26',
      updatedAt: '2023-09-30T16:41:53',
    }]
  ).as('session');
}

const interceptUserData = (isAdmin: boolean) => {
  cy.intercept(
    {
      method: 'GET',
      url: '/api/user/1',
    },
    {
      id: 1,
      email: 'yoga@studio.com',
      lastName: 'lastName',
      firstName: 'firstName',
      admin: isAdmin,
      createdAt: '2023-10-12T15:49:37',
      updatedAt: '2023-12-08T13:53:05',
    }
  ).as('me-details');
}

describe('User Information Component', () => {
  it('should login and access "Account" page as Admin', () => {
    interceptLoginData(true);
    interceptSessionData();
    interceptUserData(true);

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`);

    cy.get('[routerLink="me"]').click();

    cy.get('.mat-card-title').should('contain', 'User information');
  });

  it('should display correct user information', () => {
    cy.get('p').eq(0).should('contain', 'Name: firstName LASTNAME');
    cy.get('p').eq(1).should('contain', 'Email: yoga@studio.com');
    cy.get('p').eq(2).should('contain', 'You are admin');
    cy.get('p').eq(3).should('contain.text', 'Create at:  October 12, 2023');
    cy.get('p').eq(4).should('contain.text', 'Last update:  December 8, 2023');
  });

  it('should login and access "Account" page as User', () => {
    interceptLoginData(false);
    interceptSessionData();
    interceptUserData(false);

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`);

    cy.get('[routerLink="me"]').click();

    cy.get('.mat-card-title').should('contain', 'User information');
    cy.get('p').eq(2).should('not.contain', 'You are admin');
    // Should be delete!!
    cy.get('button').should('contain', 'Detail');
  });
});
