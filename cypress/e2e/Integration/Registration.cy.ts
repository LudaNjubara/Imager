describe("Registration", () => {
    it("Try to register with a new email and Gold plan", () => {
        cy.visit("/register");

        // 1st step
        cy.get(".register_userInfo__radioContainer__Fyawa").within(() => {
            cy.get("label").contains("Email").click();
        });

        cy.get("#usernameInput").type("cytest");
        cy.get("#emailInput").type("cytest@gmail.com");
        cy.get("#passwordInput").type("T3$tT3$t");

        cy.get("button").contains("Continue to next step").click();

        // 2nd step
        cy.get(".register_accountPlan__radioContainer__jv1Tj").within(() => {
            cy.get("div").eq(1).within(() => {
                cy.get("label").contains("Gold").click();
            });
        });

        cy.get("button").contains("Create Account").click();

        // Wait for the URL to change to the expected URL
        cy.location().should((loc) => {
            expect(loc.href).to.eq('http://localhost:3000/')
        });

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