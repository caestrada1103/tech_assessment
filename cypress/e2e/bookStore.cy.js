const BookStorePage = require('../pages/BookStorePage');
const HomePage = require('../pages/HomePage');
const {
	EXPECTED_TABLE_COLUMNS,
	BOOK_STORE_MENU_ITEMS,
	BOOK_STORE_PATH,
	BOOK_EXPECTED_API_FIELDS,
} = require('../support/constants/bookStore');

let apiUrl;

before(() => {
	cy.env(['BOOK_API_URL']).then(({ BOOK_API_URL: url }) => {
		apiUrl = url;
	});
});

describe('Book Store Application', { tags: ['@smoke', '@bookStore'] }, () => {
	let bookStorePage, homePage;

	before(() => {
		cy.request('GET', `${apiUrl}s`).then(({ body }) => {
			cy.writeFile('cypress/fixtures/books.json', body);
		});
	});

	beforeEach(() => {
		cy.visit(Cypress.config('baseUrl'));
		homePage = new HomePage();
		homePage.getCategoryCardLink('Book Store Application').scrollIntoView().should('be.visible').click();
		bookStorePage = new BookStorePage();
	});

	context('Page structure', () => {
		it('should display the correct page title', () => {
			cy.title().should('eq', 'demosite');
		});

		it('should display the search input with correct placeholder', () => {
			bookStorePage.getSearchInput().should('be.visible').and('have.attr', 'placeholder', 'Type to search');
		});

		it('should display the Login button', () => {
			bookStorePage.getLoginButton().should('be.visible').and('have.text', 'Login');
		});

		it('should display table with correct column headers', () => {
			EXPECTED_TABLE_COLUMNS.forEach((col, i) => {
				bookStorePage.getTableHeader(i).should('have.text', col);
			});
		});

		it('should display all books in the table', () => {
			cy.fixture('books').then(({ books }) => {
				bookStorePage.getTableRows().should('have.length', books.length);
			});
		});

		it('should display pagination controls with correct initial state', () => {
			bookStorePage.getPrevButton().should('be.visible').and('be.disabled');
			bookStorePage.getNextButton().should('be.visible').and('be.disabled');
			bookStorePage.getPageInfo().should('have.text', 'Page 1 of 1');
		});
	});

	context('Book data matches API', () => {
		it('should display book titles, authors and publishers matching the API', () => {
			cy.fixture('books').then(({ books }) => {
				bookStorePage.getTableRows().each((row, index) => {
					const book = books[index];
					cy.wrap(row).find('.action-buttons a').should('have.text', book.title);
					cy.wrap(row).find('td').eq(2).should('have.text', book.author);
					cy.wrap(row).find('td').eq(3).should('have.text', book.publisher);
				});
			});
		});

		it('should have the correct ISBN embedded in each book title link', () => {
			cy.fixture('books').then(({ books }) => {
				bookStorePage.getBookTitleLinks().each((link, index) => {
					cy.wrap(link).should('have.attr', 'href').and('include', `search=${books[index].isbn}`);
				});
			});
		});
	});

	context('Search functionality', () => {
		it('should filter books by title', () => {
			bookStorePage.searchBook('Git');
			bookStorePage.getTableRows().should('have.length', 1);
			bookStorePage.getBookTitleLinks().first().should('have.text', 'Git Pocket Guide');
		});

		it('should filter books by author name', () => {
			bookStorePage.searchBook('Kyle Simpson');
			bookStorePage.getTableRows().should('have.length', 1);
			bookStorePage.getBookTitleLinks().first().should('have.text', "You Don't Know JS");
		});

		it('should filter books by publisher', () => {
			bookStorePage.searchBook('No Starch Press');
			bookStorePage.getTableRows().should('have.length', 2);
		});

		it('should be case-insensitive when filtering', () => {
			bookStorePage.searchBook('javascript');
			bookStorePage.getTableRows().should('have.length.greaterThan', 0);
		});

		it('should restore all books after clearing the search input', () => {
			bookStorePage.searchBook('Git');
			bookStorePage.getTableRows().should('have.length', 1);
			bookStorePage.getSearchInput().clear();
			cy.fixture('books').then(({ books }) => {
				bookStorePage.getTableRows().should('have.length', books.length);
			});
		});
	});

	context('Search edge cases and error scenarios', () => {
		it('should show no results for a term that matches no book', () => {
			bookStorePage.searchBook('XXXXXXNOTABOOK');
			bookStorePage.getTableRows().should('have.length', 0);
		});

		it('should not crash when searching with special characters', () => {
			bookStorePage.searchBook('<script>alert(1)</script>');
			cy.url().should('include', BOOK_STORE_PATH);
			bookStorePage.getTable().should('be.visible');
		});

		it('should not crash when searching with a very long string', () => {
			bookStorePage.searchBook('a'.repeat(200));
			cy.url().should('include', BOOK_STORE_PATH);
			bookStorePage.getTable().should('be.visible');
		});

		it('should not crash when searching with only whitespace', () => {
			bookStorePage.searchBook('   ');
			cy.url().should('include', BOOK_STORE_PATH);
			bookStorePage.getTable().should('be.visible');
		});
	});

	context('Navigation', () => {
		it('should update the URL with the book ISBN when clicking a book title', () => {
			cy.fixture('books').then(({ books }) => {
				bookStorePage.getBookTitleLinks().first().click();
				cy.url().should('include', `${BOOK_STORE_PATH}?search=${books[0].isbn}`);
			});
		});

		it('should navigate to the login page when clicking the Login button', () => {
			bookStorePage.getLoginButton().click();
			cy.url().should('include', '/login');
		});
	});

	context('Sidebar navigation', () => {
		it('should display all Book Store Application menu items in the sidebar', () => {
			bookStorePage.getSidebarMenuItems().should('have.length', BOOK_STORE_MENU_ITEMS.length);
			BOOK_STORE_MENU_ITEMS.forEach((item) => {
				bookStorePage.getSidebarMenuItems().contains(item).should('be.visible');
			});
		});

		it('should navigate to the Profile page via the sidebar', () => {
			bookStorePage.getSidebarMenuLinks().contains('Profile').click();
			cy.url().should('include', '/profile');
		});

		it('should navigate to the Book Store API (Swagger) page via the sidebar', () => {
			bookStorePage.getSidebarMenuLinks().contains('Book Store API').click();
			cy.url().should('include', '/swagger');
		});

		it('should navigate to the Login page via the sidebar', () => {
			bookStorePage.getSidebarMenuLinks().contains('Login').click();
			cy.url().should('include', '/login');
		});
	});

	context('Accessibility', () => {
		it('should have a table with proper thead and tbody structure', () => {
			bookStorePage.getTable().find('thead').should('exist');
			bookStorePage.getTable().find('tbody').should('exist');
		});

		it('should have non-empty text on all table column headers', () => {
			bookStorePage.getTableHeaders().each((th) => {
				cy.wrap(th).invoke('text').should('not.be.empty');
			});
		});

		it('should have alt text on all book images', () => {
			bookStorePage.getTableRows().each((row) => {
				cy.wrap(row).find('img').should('have.attr', 'alt', 'book-image');
			});
		});

		it('should have accessible book title links with non-empty href and text', () => {
			bookStorePage.getBookTitleLinks().each((link) => {
				cy.wrap(link).should('have.attr', 'href').and('not.be.empty');
				cy.wrap(link).invoke('text').should('not.be.empty');
			});
		});

		it('should have an accessible search input with id and placeholder', () => {
			bookStorePage
				.getSearchInput()
				.should('have.attr', 'id', 'searchBox')
				.and('have.attr', 'placeholder', 'Type to search')
				.and('have.attr', 'type', 'text');
		});

		it('Login button should be an enabled button element', () => {
			bookStorePage.getLoginButton().should('have.attr', 'type', 'button').and('not.be.disabled');
		});

		it('should have accessible sidebar links with non-empty href and text', () => {
			bookStorePage.getSidebarMenuLinks().each((link) => {
				cy.wrap(link).should('have.attr', 'href').and('not.be.empty');
				cy.wrap(link).invoke('text').should('not.be.empty');
			});
		});
	});
});

describe('Book Store Application - API', { tags: ['@api', '@bookStore'] }, () => {
	context('API', () => {
		it('should return all books from the Books API with status 200', () => {
			cy.request('GET', `${apiUrl}s`).then(({ status, body }) => {
				expect(status).to.eq(200);
				cy.fixture('books').then(({ books }) => {
					expect(body.books).to.have.length(books.length);
				});
			});
		});

		it('should return correct fields for each book from the API', () => {
			cy.request('GET', `${apiUrl}s`).then(({ body }) => {
				body.books.forEach((book) => {
					expect(book).to.have.all.keys(...BOOK_EXPECTED_API_FIELDS);
				});
			});
		});

		it('should return a single book by ISBN from the detail API', () => {
			cy.fixture('books').then(({ books }) => {
				const firstBook = books[0];
				cy.request('GET', `${apiUrl}?ISBN=${firstBook.isbn}`).then(({ status, body }) => {
					expect(status).to.eq(200);
					expect(body.title).to.eq(firstBook.title);
					expect(body.author).to.eq(firstBook.author);
					expect(body.isbn).to.eq(firstBook.isbn);
				});
			});
		});

		it('should return 400 for a request with an invalid ISBN', () => {
			cy.request({
				method: 'GET',
				url: `${apiUrl}?ISBN=0000000000000`,
				failOnStatusCode: false,
			}).then(({ status }) => {
				expect(status).to.eq(400);
			});
		});

		it('should return 500 when ISBN query parameter is missing', () => {
			cy.request({
				method: 'GET',
				url: apiUrl,
				failOnStatusCode: false,
			}).then(({ status }) => {
				expect(status).to.eq(500);
			});
		});
	});
});
