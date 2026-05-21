const BOOK_STORE_PATH = '/books';
const BOOK_STORE_ACCORDION = 'Book Store Application';
const BOOK_STORE_MENU_ITEMS = ['Login', 'Book Store', 'Profile', 'Book Store API'];
const EXPECTED_TABLE_COLUMNS = ['Image', 'Title', 'Author', 'Publisher'];
const BOOK_EXPECTED_API_FIELDS = [
	'isbn',
	'title',
	'subTitle',
	'author',
	'publish_date',
	'publisher',
	'pages',
	'description',
	'website',
];

module.exports = {
	BOOK_STORE_PATH,
	BOOK_STORE_ACCORDION,
	BOOK_STORE_MENU_ITEMS,
	EXPECTED_TABLE_COLUMNS,
	BOOK_EXPECTED_API_FIELDS,
};
