describe("Login", () => {
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

    it("Try to login with an existing email account", () => {
        cy.visit("/login");

        cy.get("#emilInput").type(user.email);
        cy.get("#passwordInput").type(user.password);

        cy.get("button").contains("Log in").click();

        // Wait for the URL to change to the expected URL
        cy.location('pathname', { timeout: 10000 }).should('eq', '/');

        // Check if the user is logged in
        cy.get("aside").within(() => {
            cy.get(".sidebar_userProfile__userActionsContainer__PSYLv").within(() => {
                cy.get("a").should("have.attr", "href", "/profile").within(() => {
                    cy.get(".sidebar_userProfile__username__udhaV").should("have.text", user.username);
                    cy.get("img").should("have.attr", "src", user.imageUrl);
                });
            });
        });
    })

    // after the test is done, log out
    after(() => {
        cy.get(".sidebar_logoutButton__tyerN").click();
    });
});

export { }