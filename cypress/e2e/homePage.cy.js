const { CATEGORIES_CARD, URL_CATEGORY_MAP } = require('../../support/constants/homePages');

describe('Home page', () => {
	let linkForCategoryCards;

	beforeEach(() => {
		cy.visit(Cypress.config('baseUrl'));
		linkForCategoryCards = cy.get('.category-cards').find('a');
	});

	it('should have the correct title', () => {
		cy.title().should('eq', 'demosite');
	});

	it('should display the correct header', () => {
		cy.get('header').get('img').should('have.attr', 'src').should('include', '/assets/Toolsqa-');
	});

	it('should have a working navigation menu', () => {
		linkForCategoryCards.should('have.length', CATEGORIES_CARD.length);
		linkForCategoryCards.each((list, index) => {
			cy.wrap(list)
				.scrollIntoView()
				.should('have.attr', 'href')
				.should('be.visible')
				.should('have.text', CATEGORIES_CARD[index]);
		});
	});

	it('Home banner should have accessible image', () => {
		cy.get('.banner-image').should('have.attr', 'alt', 'Selenium Online Training');
	});

	it('should have a working footer', () => {
		cy.get('footer').should('be.visible').should('have.text', '© 2013-2026 TOOLSQA.COM | ALL RIGHTS RESERVED.');
	});

	CATEGORIES_CARD.forEach((category, i) => {
		it(`should navigate to the correct page when clicking on ${category} card`, () => {
			const expectedUrl = URL_CATEGORY_MAP[category] ?? category.toLowerCase().replace(/,|\s/g, '');
			cy.get('.category-cards a').eq(i).scrollIntoView().should('be.visible').click();
			cy.url().should('include', `/${expectedUrl}`);
		});
	});
});
