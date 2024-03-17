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


describe('User Information Component', () => {
  it('should login and access "Account" page as Admin', () => {
    interceptLoginData(true);
    interceptSessionData();

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`);

    cy.contains('.link', 'Logout').click();

    cy.url().should('equal', 'http://localhost:4200/')
  });
});
