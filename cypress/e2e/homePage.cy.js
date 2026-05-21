const HomePage = require('../pages/HomePage');
const { CATEGORIES_CARD, URL_CATEGORY_MAP } = require('../support/constants/homePages');

describe('Home page', { tags: ['@smoke', '@homePage'] }, () => {
	let homePage;
	beforeEach(() => {
		cy.visit(Cypress.config('baseUrl'));
		homePage = new HomePage();
	});

	it('should have the correct title', () => {
		cy.title().should('eq', 'demosite');
	});

	it('should display the correct header', () => {
		homePage.getHomeHeaderImage().should('have.attr', 'src').should('include', '/assets/Toolsqa-');
	});

	it('should have a working navigation menu', () => {
		homePage.getLinkForCategoryCards().should('have.length', CATEGORIES_CARD.length);
		homePage.getLinkForCategoryCards().each((list, index) => {
			cy.wrap(list).scrollIntoView();
			cy.wrap(list)
				.should('have.attr', 'href')
				.should('be.visible')
				.should('have.text', CATEGORIES_CARD[index]);
		});
	});

	it('Home banner should have accessible image', () => {
		homePage.getHomeBannerImage().should('have.attr', 'alt', 'Selenium Online Training');
	});

	it('should have a working footer', () => {
		homePage.getFooter().should('be.visible').should('have.text', '© 2013-2026 TOOLSQA.COM | ALL RIGHTS RESERVED.');
	});

	CATEGORIES_CARD.forEach((category) => {
		it(`should navigate to the correct page when clicking on ${category} card`, () => {
			const expectedUrl = URL_CATEGORY_MAP[category] ?? category.toLowerCase().replace(/,|\s/g, '');
			homePage.getCategoryCardLink(category).scrollIntoView().should('be.visible').click();
			cy.url().should('include', `/${expectedUrl}`);
		});
	});
});
