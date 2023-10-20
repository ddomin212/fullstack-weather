describe("tests redirect on payment", () => {
  it("passes", () => {
    cy.visit(
      `http://localhost:3000/bypassLogin?email=${Cypress.env(
        "USER_EMAIL"
      )}&password=${Cypress.env("USER_PASSWORD")}`
    );
    cy.get('[data-testid="search-input"]').type("London");
    cy.get('[data-testid="search-button"]').click();
    cy.get('[data-testid="premium-button"]').click();
    cy.wait(2000);
    cy.url().then((url) => {
      expect(url).to.not.contain("http://localhost:3000/");
    });
  });
});
