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
};

const interceptTeacherData = () => {
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
};

const login = () => {
  interceptSessionData();
  interceptTeacherData();

  cy.visit('/login');
  cy.get('input[formControlName=email]').type('yoga@studio.com');
  cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`);
}

const clickDetailAndAssert = () => {
  cy.get('.list .item button').should('exist').should('contain', 'Detail').first().click();

  cy.get('.mat-card-title').contains('Session 1');
  cy.get('.ml1').contains('January 1, 1902');
  cy.get('.ml1').contains('DELAHAYE');
  cy.get('.description').contains('Yoga could be some cool activity to try');
};

describe('Form Component', () => {

  it('should show session data after user logged and clicked detail', () => {
    interceptLoginData(true);
    login();
    clickDetailAndAssert();
  });

  it('should display the "Delete" button for admin user', () => {
    cy.get('.ml1').contains('Delete');
  });

  it('should show session data after detail button click by user', () => {
    interceptLoginData(false);
    login();
    clickDetailAndAssert();
  });

  it('should display the "Do not participate" button for admin user', () => {
    cy.get('button span.ml1').eq(0).should('contain', 'Do not participate');
  });
});
