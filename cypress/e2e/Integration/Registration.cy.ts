describe("Registration", () => {
    let user: {
        username: string;
        email: string;
        password: string;
        imageUrl: string;
    };

    before(() => {
        // Set up test data using fixtures
        cy.fixture("users.json").then((users) => {
            user = users[1];
        });
    });

    it("Try to register with a new email and Gold plan", () => {
        cy.visit("/register");

        // 1st step
        cy.get(".register_userInfo__radioContainer__Fyawa").within(() => {
            cy.get("label").contains("Email").click();
        });

        cy.get("#usernameInput").type(user.username);
        cy.get("#emailInput").type(user.email);
        cy.get("#passwordInput").type(user.password);

        cy.get("button").contains("Continue to next step").click();

        // 2nd step
        cy.get(".register_accountPlan__radioContainer__jv1Tj").within(() => {
            cy.get("div").eq(1).within(() => {
                cy.get("label").contains("Gold").click();
            });
        });

        cy.get("button").contains("Create Account").click();

        // Wait for the URL to change to the expected URL
        cy.location('pathname', { timeout: 10000 }).should('eq', '/');

        // Check if the user has registered
        cy.get("aside").within(() => {
            cy.get(".sidebar_userProfile__userActionsContainer__PSYLv").within(() => {
                cy.get("a").should("have.attr", "href", "/profile").within(() => {
                    cy.get(".sidebar_userProfile__username__udhaV").should("have.text", user.username);
                    cy.get("img").should("have.attr", "src", user.imageUrl);
                });
            });
        });
    });

    // after the test is done, log out
    after(() => {
        cy.get(".sidebar_logoutButton__tyerN").click();
    });
});

export { };