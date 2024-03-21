describe('Form Component', () => {

  beforeEach(() => {
    cy.intercept(
      {
        method: 'put',
        url: '/api/session/1',
      },
      {
        id: 1,
        name: 'Updated session 1',
        date: '1902-01-01T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Yoga could be some cool activity to try',
        users: [1],
        createdAt: '2023-09-30T16:40:26',
        updatedAt: '2023-09-30T16:41:53',
      }
    ).as('session-detail');

    cy.login(true);
    cy.get('.list .item button').eq(1).should('exist').should('contain', 'Edit').click();
  })

  it('should show correct session form data after "Edit" button was clicked', () => {
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
    cy.get('[formControlName="name"]').clear().type('Updated Session');
    cy.get('[formControlName="date"]').clear().type('2024-02-02');
    cy.get('[formControlName="description"]').clear().type('This session has been updated.');

    cy.get('button[type="submit"]').click();
    cy.contains('Session updated !').should('be.visible');
    cy.url().should('include', '/sessions');
  });

  it('should redirects sessions page when clicking the back button', () => {
    cy.contains('button', 'arrow_back').click();
    cy.url().should('eq', 'http://localhost:4200/sessions');
  });
});
