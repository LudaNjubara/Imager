describe("Login", () => {
    it("Try to login with an existing email account", () => {
        cy.visit("/login");

        cy.get("#emilInput").type("cytest@gmail.com");
        cy.get("#passwordInput").type("T3$tT3$t");

        cy.get("button").contains("Log in").click();

        // Wait for the URL to change to the expected URL
        cy.location('pathname').should('eq', '/');

        // Check if the user is logged in
        cy.get("aside").within(() => {
            cy.get(".sidebar_userProfile__userActionsContainer__PSYLv").within(() => {
                cy.get("a").should("have.attr", "href", "/profile").within(() => {
                    cy.get(".sidebar_userProfile__username__udhaV").should("have.text", "cytest");
                    cy.get("img").should("have.attr", "src", "/_next/image?url=%2Fimages%2FimagerLogo_small.png&w=96&q=75")
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