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

  cy.intercept(
    {
      method: 'PUT',
      url: '/api/session/1',
    },
    {
      statusCode: 200,
    }
  ).as('session');
};

describe('Form Component', () => {
  it('should show correct session form data after "Edit" button was clicked', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });
    interceptSessionData();

    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher',
      },
      {
        id: 1,
        lastName: 'DELAHAYE',
        firstName: 'Margot',
        createdAt: '2023-09-30T15:23:53',
        updatedAt: '2023-09-30T15:23:53',
      }
    ).as('teacher');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`);

    cy.get('.list .item button').eq(1).should('exist').should('contain', 'Edit').click();

    cy.contains('Update session').should('exist');
    cy.get('[formControlName="name"]').should('have.value', 'Session 1');
    cy.get('[formControlName="date"]').should('have.value', '1902-01-01');
    cy.get('[formControlName="description"]').should('have.value', 'Yoga could be some cool activity to try');
  });

  it('should display error message for missing mandatory field', () => {
    cy.get('[formControlName="name"]').clear();
    cy.get('[formControlName="date"]').click();
    cy.get('button[type=submit]').should('be.disabled');
    cy.get('input[formControlName=name]').should('have.class', 'ng-invalid');
  });

  it('should update an existing session', () => {
    interceptSessionData();

    cy.get('[formControlName="name"]').clear().type('Updated Session');
    cy.get('[formControlName="date"]').clear().type('2024-02-02');
    cy.get('[formControlName="description"]').clear().type('This session has been updated.');

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/sessions');
  });
});
