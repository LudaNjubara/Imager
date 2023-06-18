describe("Home Page", () => {

    let user: {
        username: string;
        email: string;
        password: string;
        imageUrl: string;
    };

    before(() => {
        // Set up test data using fixtures
        cy.fixture("users.json").then((users) => {
            user = users[0];
        });
    });

    // before the test, log in
    before(() => {
        cy.visit("/login");

        cy.get("#emilInput").type(user.email);
        cy.get("#passwordInput").type(user.password);

        cy.get("button").contains("Log in").click();

        // Wait for the URL to change to the expected URL
        cy.location('pathname', { timeout: 10000 }).should('eq', '/');
    });

    it("should have a sidebar with links to home and search page, and a div with a link to the profile page and a button", () => {
        cy.visit("/");

        cy.get("aside").within(() => {
            cy.contains("Home").should("have.attr", "href", "/");
            cy.contains("Search").should("have.attr", "href", "/search");

            cy.get("div").contains("cytest").should("have.attr", "href", "/profile")
            cy.get("button").should("have.attr", "type", "button");
        });
    });

    it("should have a main element with a section with a heading, and a list of articles below", () => {
        cy.visit("/");

        cy.get("main").within(() => {
            cy.get("h3").contains("Latest Uploads");

            cy.get("article").should("have.length.greaterThan", 0);
        });
    });

    it("should have articles with a data-item-image-url attribute, and an image with src attribute containing amazonaws.com in it", () => {
        cy.visit("/");

        cy.get("main").within(() => {
            cy.get("article").each(($article) => {
                cy.wrap($article).should("have.attr", "data-item-image-url").and("include", "amazonaws.com");

                cy.wrap($article).find("img").should("have.attr", "src").and("include", "amazonaws.com");
            });
        });
    });

    // after the test is done, log out
    after(() => {
        cy.get(".sidebar_logoutButton__tyerN").click();
    });
});

export { };
