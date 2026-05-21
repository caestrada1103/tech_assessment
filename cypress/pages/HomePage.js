class HomePage {
	constructor() {
		this.homeBannerImage = () => cy.get('.banner-image');
		this.homeHeaderImage = () => cy.get('header').get('img');
		this.linkForCategoryCards = () => cy.get('.category-cards').find('a');
		this.footer = () => cy.get('footer');
	}

	getLinkForCategoryCards() {
		return this.linkForCategoryCards();
	}

	getHomeHeaderImage() {
		return this.homeHeaderImage();
	}

	getHomeBannerImage() {
		return this.homeBannerImage();
	}

	getFooter() {
		return this.footer();
	}

	getCategoryCardLink(category) {
		return this.linkForCategoryCards().contains(category);
	}
}

module.exports = HomePage;
