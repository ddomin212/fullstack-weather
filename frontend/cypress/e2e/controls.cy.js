const { wait } = require("@testing-library/user-event/dist/utils");

describe("checks unit change from metric to imperial", () => {
  it("passes", () => {
    let temp_metric = 0;
    let temp_imperial = 0;
    cy.visit(
      `http://localhost:3000/bypassLogin?email=${Cypress.env(
        "USER_EMAIL"
      )}&password=${Cypress.env("USER_PASSWORD")}`
    );
    cy.get('[data-testid="search-input"]').type("London");
    cy.get('[data-testid="search-button"]').click();
    cy.get('[data-testid="now-temp"]')
      .invoke("text")
      .then((text) => {
        temp_metric = parseInt(text.replace("°", ""));
      });
    cy.get('[data-testid="weather-info-wind"]')
      .invoke("text")
      .then((text) => {
        text.includes("m/s");
      });

    //switched to metric
    cy.get('[data-testid="imperial-switch"]').click();
    cy.wait(2000);
    cy.get('[data-testid="now-temp"]')
      .invoke("text")
      .then((text) => {
        temp_imperial = parseInt(text.replace("°", ""));
        assert.isAbove(temp_imperial, temp_metric);
      });
    cy.get('[data-testid="weather-info-wind"]')
      .invoke("text")
      .then((text) => {
        text.includes("mph");
      });
  });
});
