const { BOOK_STORE_ACCORDION } = require('../support/constants/bookStore');

class BookStorePage {
	constructor() {
		// Sidebar
		this.accordionHeaders = () => cy.get('.left-pannel .header-wrapper');
		this.sidebarMenuItems = () =>
			this.accordionHeaders()
				.contains(BOOK_STORE_ACCORDION)
				.parents('.element-group')
				.find('.menu-list li');
		this.sidebarMenuLinks = () =>
			this.accordionHeaders()
				.contains(BOOK_STORE_ACCORDION)
				.parents('.element-group')
				.find('.menu-list li a');

		// Search area
		this.searchInput = () => cy.get('#searchBox');
		this.loginButton = () => cy.get('#login');

		// Table
        this.tableContainer = () => cy.get('.books-wrapper');
		this.table = () => this.tableContainer().find('table');
		this.tableHeaders = () => this.table().find('thead th');
		this.tableRows = () => this.table().find('tbody tr');
		this.bookTitleLinks = () => this.table().find('tbody .action-buttons a');

		// Pagination
		this.prevButton = () => cy.contains('button', 'Previous');
		this.nextButton = () => cy.contains('button', 'Next');
		this.pageInfo = () => cy.contains(/^Page \d+ of \d+$/);
	}

	getSidebarMenuItems() {
		return this.sidebarMenuItems();
	}

	getSidebarMenuLinks() {
		return this.sidebarMenuLinks();
	}

	getSearchInput() {
		return this.searchInput();
	}

	getLoginButton() {
		return this.loginButton();
	}

	getTable() {
		return this.table();
	}

	getTableHeaders() {
		return this.tableHeaders();
	}

	getTableHeader(index) {
		return this.tableHeaders().eq(index);
	}

	getTableRows() {
		return this.tableRows();
	}

	getBookTitleLinks() {
		return this.bookTitleLinks();
	}

	getPrevButton() {
		return this.prevButton();
	}

	getNextButton() {
		return this.nextButton();
	}

	getPageInfo() {
		return this.pageInfo();
	}

	searchBook(query) {
		this.searchInput().clear().type(query);
	}
}

module.exports = BookStorePage;
