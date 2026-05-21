const HomePage = require('../pages/HomePage');
const FormsPage = require('../pages/FormsPage');
const { FORMS_ACCORDION_SECTION } = require('../support/constants/formsPage');
const practiceFormDataRequired = require('../fixtures/practiceFormDataRequired.json');
const practiceFormDataRecords = require('../fixtures/practiceFormData.json');
const { invalidEmailData, shortMobileData } = require('../fixtures/practiceFormEdgeCases.json');

describe('Forms accordion', { tags: ['@smoke', '@forms'] }, () => {
	let homePage;
	let formsPage;

	beforeEach(() => {
		cy.visit(Cypress.config('baseUrl'));
		homePage = new HomePage();
		homePage.getCategoryCardLink(FORMS_ACCORDION_SECTION).scrollIntoView().should('be.visible').click();
		formsPage = new FormsPage();
	});

	it('should keep Forms accordion expanded and show Practice Form option', () => {
		formsPage.assertFormsAccordionExpanded();
		formsPage.assertPracticeFormOptionVisible();
	});

	it('should open Practice Form page from Forms accordion', () => {
		formsPage.openPracticeFormFromLeftMenu();
		cy.get('h1.text-center').should('have.text', 'Practice Form');
	});

	it('should keep Forms accordion expanded after navigating to Practice Form page', () => {
		formsPage.openPracticeFormFromLeftMenu();
		formsPage.assertFormsAccordionExpanded();
	});

	it('should keep Forms accordion expanded after navigating back from Practice Form page', () => {
		formsPage.openPracticeFormFromLeftMenu();
		cy.go('back');
		formsPage.assertFormsAccordionExpanded();
	});

	it('should keep Forms accordion expanded after refreshing Practice Form page', () => {
		formsPage.openPracticeFormFromLeftMenu();
		cy.reload();
		formsPage.assertFormsAccordionExpanded();
	});

	it('should not submit when required fields are empty', () => {
		formsPage.goToPracticeFormFilledAndSubmit({});
		formsPage.shouldNotShowSubmissionModal();
		formsPage.getFirstNameInput().should('match', ':invalid');
		formsPage.getLastNameInput().should('match', ':invalid');
		formsPage.getMobileInput().should('match', ':invalid');
	});

	it('should not submit when email format is invalid', () => {
		formsPage.goToPracticeFormFilledAndSubmit(invalidEmailData);
		formsPage.shouldNotShowSubmissionModal();
		formsPage.getEmailInput().should('match', ':invalid');
	});

	it('should submit when mobile number has less than 10 digits', () => {
		formsPage.goToPracticeFormFilledAndSubmit(shortMobileData);
		formsPage.getSubmissionModal().should('be.visible');
		formsPage.getSubmissionModalTitle().should('have.text', 'Thanks for submitting the form');
		formsPage
			.getSubmittedValueByLabel('Student Name')
			.should('have.text', `${shortMobileData.firstName} ${shortMobileData.lastName}`);
		formsPage.getSubmittedValueByLabel('Mobile').should('have.text', shortMobileData.mobile);
	});

	practiceFormDataRequired.forEach((practiceFormData) => {
		it(`should submit Practice Form with required fields for ${practiceFormData.firstName} ${practiceFormData.lastName}`, () => {
			formsPage.goToPracticeFormFilledAndSubmit(practiceFormData);
			formsPage.validateSubmissionModal(practiceFormData);
		});
	});

	practiceFormDataRecords.forEach((practiceFormData) => {
		it(`should submit Practice Form with all fields for ${practiceFormData.firstName} ${practiceFormData.lastName}`, () => {
			formsPage.openPracticeFormFromLeftMenu();
			formsPage.fillPracticeFormFull(practiceFormData);
			formsPage.submitPracticeForm();
			formsPage.validateSubmissionModal(practiceFormData);
		});
	});
});
