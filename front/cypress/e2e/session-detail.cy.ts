import * as cypress from "cypress";

const clickDetailAndAssert = () => {
  cy.get('.list .item button').should('exist').should('contain', 'Detail').first().click();

  cy.get('.mat-card-title').contains('Session 1');
  cy.get('.ml1').contains('January 1, 1902');
  cy.get('.ml1').contains('DELAHAYE');
  cy.get('.description').contains('Yoga could be some cool activity to try');
};

describe('Form Component', () => {

  beforeEach(() => {
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
  });

  it('should show session data after user logged and clicked detail', () => {
    cy.login(true);
    clickDetailAndAssert();
  });

  it('should display the "Delete" button for admin user', () => {
    cy.get('.ml1').contains('Delete');
  });

  it('should show session data after detail button click by user', () => {
    cy.login(false);
    clickDetailAndAssert();
  });

  it('should display the "Do not participate" button for admin user', () => {
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
        users: [],
        createdAt: '2023-09-30T16:40:26',
        updatedAt: '2023-09-30T16:41:53',
      }
    ).as('session-detail');
    cy.intercept(
      {
        method: 'DELETE',
        url: '/api/session/1/participate/1',
      },
      {}
    ).as('session-detail');

    cy.get('button span.ml1').eq(0).should('contain', 'Do not participate');
    cy.get('button span.ml1').eq(0).click();
    cy.get('button span.ml1').eq(0).should('contain', 'Participate');
  });

  it('should show session data after detail button click by user', () => {
    cy.login(false);
    clickDetailAndAssert();

    cy.contains('button', 'arrow_back').click();

    cy.url().should('eq', 'http://localhost:4200/sessions');
  });
});
