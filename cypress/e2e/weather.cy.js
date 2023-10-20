describe("gets weather as a free/anonymous user", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/instantLogout");
    cy.get('[data-testid="search-input"]').type("London");
    cy.get('[data-testid="search-button"]').click();
    cy.get('[data-testid="welcome-message"]').should("exist");
    cy.get('[data-testid="local-time"]').should("exist");
    cy.get('[data-testid="now-temp"]').should("exist");
    cy.get('[data-testid="weather-main"]').should("exist");
    cy.get('[data-testid="weather-icon"]').should("exist");
    cy.get('[data-testid*="weather-info"]').should("have.length", 6);
    cy.get('[data-testid="forecast-item"]').should("have.length", 6);
    cy.get('[data-testid="sun-stat"]').should("have.length", 4);
    cy.get('[data-testid="air-quality"]').should("not.exist");
    cy.get('[data-testid="chart-view"]').should("not.exist");
    cy.get('[class="Toastify"]').should("be.empty");
  });
});

describe("user gets an error", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/instantLogout");
    cy.get('[data-testid="search-input"]').type("City that does not exist");
    cy.get('[data-testid="search-button"]').click();
    cy.contains('[class="Toastify"]', "Error fetching weather data.").should(
      "exist"
    );
  });
});

describe("gets weather as a paid user", () => {
  it("passes", () => {
    cy.visit(
      `http://localhost:3000/bypassLogin?email=${Cypress.env(
        "PAID_USER_EMAIL"
      )}&password=${Cypress.env("PAID_USER_PASSWORD")}`
    );
    cy.get('[data-testid="search-input"]').type("London");
    cy.get('[data-testid="search-button"]').click();
    cy.get('[data-testid="welcome-message"]').should("exist");
    cy.get('[data-testid="local-time"]').should("exist");
    cy.get('[data-testid="now-temp"]').should("exist");
    cy.get('[data-testid="weather-main"]').should("exist");
    cy.get('[data-testid="weather-icon"]').should("exist");
    cy.get('[data-testid*="weather-info"]').should("have.length", 6);
    cy.get('[data-testid="forecast-item"]').should("have.length", 12);
    cy.get('[data-testid="sun-stat"]').should("have.length", 4);
    cy.get('[data-testid="air-quality"]').should("exist");
    cy.get('[data-testid="chart-view"]').should("exist");
    cy.get('[class="Toastify"]').should("be.empty");
  });
});
