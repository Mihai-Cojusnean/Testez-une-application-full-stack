describe('List Component', () => {

  it('should show sessions after logged in as admin', () => {
    cy.login(true);

    cy.get('.mat-card-title').contains('Session 1');
  });

  it('should display the list of rentals', () => {
    cy.login(true);

    cy.get('.list').should('exist');
    cy.get('mat-card-title').should('contain', 'Rentals available');
    cy.get('.item').should('have.length.gt', 0);
  });

  it('should display the "Edit" button for admin users', () => {
    cy.login(true);

    cy.get('.list .item button').eq(1).should('exist').should('contain', 'Edit');
  });

  it('should display the "Create" button for admin users', () => {
    cy.login(true);

    cy.get('.list button[routerLink="create"]').should('exist').should('contain', 'Create');
  });

  it('should navigate to the update page when "Edit" button is clicked', () => {
    cy.login(true);

    cy.get('.list .item button').eq(1).click();

    cy.url().should('include', '/update');
  });

  it('should show sessions after logged in as user', () => {
    cy.login(false);
  });

  it('should not display the "Create" button for non-admin users', () => {
    cy.login(false);

    cy.get('.list button[routerLink="create"]').should('not.exist');
  });

  it('should not display the "Edit" button for non-admin users', () => {
    cy.login(false);

    cy.get('.list .item button[routerLink*="update"]').should("not.exist");
  });

  it('should navigate to the detail page when "Detail" button is clicked', () => {
    cy.login(false);

    cy.get('.list .item button').first().click();

    cy.url().should('include', '/detail');
  });
});
