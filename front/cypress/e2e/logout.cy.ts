describe('User Information Component', () => {
  it('should login and access "Account" page as Admin', () => {
    cy.login(true);

    cy.contains('.link', 'Logout').click();

    cy.url().should('equal', 'http://localhost:4200/')
  });
});
