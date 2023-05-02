describe('Search', () => {
    // before the test, log in
    before(() => {
        cy.visit("/login");

        cy.get("#emilInput").type("cytest@gmail.com");
        cy.get("#passwordInput").type("T3$tT3$t");

        cy.get("button").contains("Log in").click();

        // Wait for the URL to change to the expected URL
        cy.location('pathname').should('eq', '/');
    });

    it('should search for an image by author, and display results', () => {
        cy.visit('/search');

        // from select dropdown select author
        cy.get(".searchBar_searchBar__searchDropdown__YBvpi").select("author");

        // type in author name
        cy.get("#searchBar__search").type("Dorijan Polic");

        // click search button
        cy.get(".searchBar_searchBar__searchButton__h_PeY").click();

        // check if results are displayed
        cy.get(".imagesContainer_imagesContainer__wrapper__OOZtA").should('be.visible').within(() => {
            // check if all results are by Dorijan Polic
            cy.get(".imageItem_imageItem__item__SpWfF").should('be.visible').each(($article) => {
                cy.wrap($article).find(".imageItem_imageItem__info__title__2_7gL").contains("Dorijan Polic");
            });

        });

    });

    it('should search for an image by hashtags, and display results', () => {
        cy.visit('/search');

        // from select dropdown select hashtags
        cy.get(".searchBar_searchBar__searchDropdown__YBvpi").select("hashtags");

        // type in hashtags
        cy.get("#searchBar__search").type("whatasave");

        // click search button
        cy.get(".searchBar_searchBar__searchButton__h_PeY").click();

        // check if results are displayed
        cy.get(".imagesContainer_imagesContainer__wrapper__OOZtA").should('be.visible').within(() => {
            // check if all results have #whatasave hashtag
            cy.get(".imageItem_imageItem__item__SpWfF").should('be.visible').each(($article) => {
                cy.wrap($article).find(".imageItem_imageItem__info__top__9qJDv").find("span").contains("whatasave");
            });

        });

    });

    // after the test is done, log out
    after(() => {
        cy.get(".sidebar_logoutButton__tyerN").click();
    });
});

export { }