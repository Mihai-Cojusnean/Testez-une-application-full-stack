Cypress.Commands.add("login", (isAdmin: boolean) => {
  cy.visit('/login');

  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 1,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: isAdmin
    },
  }).as('loginRequest');

  const id = '1';

  cy.intercept('GET', `/api/user/${id}`, {
    statusCode: 200,
    body: {
      id: 1,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'yoga@studio.com',
      admin: isAdmin,
      createdAt: '04/03/2024',
      updatedAt: '05/03/2024'
    },
  }).as('userRetrieved');

  cy.intercept('GET', '/api/session', {
    statusCode: 200,
    body: [
      {
        id: 1,
        name: "Session 1",
        description: "Yoga could be some cool activity to try 1",
        date: '06/03/2024',
        teacher_id: 1,
        users: [2, 3],
        createdAt: '06/03/2024',
        updatedAt: '06/03/2024',
      },
      {
        id: 2,
        name: "Session 2",
        description: "Yoga could be some cool activity to try 2",
        date: '07/03/2024',
        teacher_id: 1,
        users: [2, 3],
        createdAt: '06/03/2024',
        updatedAt: '06/03/2024',
      }
    ],
  }).as('sessionRetrieved');

  cy.intercept(
    {
      method: 'GET',
      url: '/api/session/1',
    },
    {
      id: 1,
      name: 'Session 1',
      date: '1902-01-01T00:00:00.000+00:00',
      teacher_id: 1,
      description: 'Yoga could be some cool activity to try',
      users: [1],
      createdAt: '2023-09-30T16:40:26',
      updatedAt: '2023-09-30T16:41:53',
    }
  ).as('session-detail');


  cy.intercept(
    {
      method: 'GET',
      url: '/api/teacher/1',
    },
    {
      id: 1,
      lastName: 'DELAHAYE',
      firstName: 'Margot',
      createdAt: '2023-09-30T15:23:53',
      updatedAt: '2023-09-30T15:23:53',
    }
  ).as('teacher');

  cy.get('input[formControlName=email]').type('yoga@studio.com');
  cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`);
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(isAdmin: boolean): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("loginAdmin", () => {
  cy.login(true);
});

Cypress.Commands.add("loginUser", () => {
  cy.login(false);
});
