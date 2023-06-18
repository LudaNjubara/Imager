describe('Search', () => {
    let user: {
        username: string;
        email: string;
        password: string;
        imageUrl: string;
    };

    const testAuthor = "LudaNjubara";
    const testHashtag = "whatasave";


    before(() => {
        cy.fixture("users.json").then((users) => {
            user = users[0];
        });
    });

    before(() => {
        cy.visit("/login");

        cy.get("#emilInput").type(user.email);
        cy.get("#passwordInput").type(user.password);

        cy.get("button").contains("Log in").click();

        // Wait for the URL to change to the expected URL
        cy.location('pathname', { timeout: 10000 }).should('eq', '/');
    });

    it('should search for an image by author, and display results', () => {
        cy.visit('/search');

        // from select dropdown select author
        cy.get(".searchBar_searchBar__searchDropdown__YBvpi").select("author");

        // type in author name
        cy.get("#searchBar__search").type(testAuthor);

        // click search button
        cy.get(".searchBar_searchBar__searchButton__h_PeY").click();

        // check if results are displayed
        cy.get(".imagesContainer_imagesContainer__wrapper__OOZtA").should('be.visible').within(() => {
            // check if all results are by the specified author
            cy.get(".imageItem_imageItem__item__SpWfF").should('be.visible').each(($article) => {
                cy.wrap($article).find(".imageItem_imageItem__info__title__2_7gL").contains(testAuthor);
            });

        });

    });

    it('should search for an image by hashtags, and display results', () => {
        cy.visit('/search');

        // from select dropdown select hashtags
        cy.get(".searchBar_searchBar__searchDropdown__YBvpi").select("hashtags");

        // type in hashtags
        cy.get("#searchBar__search").type(testHashtag);

        // click search button
        cy.get(".searchBar_searchBar__searchButton__h_PeY").click();

        // check if results are displayed
        cy.get(".imagesContainer_imagesContainer__wrapper__OOZtA").should('be.visible').within(() => {
            // check if all results contain a testHashtag
            cy.get(".imageItem_imageItem__item__SpWfF").should('be.visible').each(($article) => {
                cy.wrap($article).find(".imageItem_imageItem__info__top__9qJDv").find("span").contains(testHashtag);
            });

        });

    });

    // after the test is done, log out
    /*     after(() => {
            cy.get(".sidebar_logoutButton__tyerN").click();
        }); */
});

export { }