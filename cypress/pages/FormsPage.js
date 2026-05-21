const { FORMS_PRACTICE_FORM_PATH } = require('../support/constants/formsPage');

class FormsPage {
	constructor() {
		this.formsAccordionSection = 'Forms';
		this.practiceFormItem = 'Practice Form';
		this.accordionHeaders = () => cy.get('.left-pannel .header-wrapper');
		this.menuItems = () => cy.get('.left-pannel .menu-list li');
		this.firstNameInput = () => cy.get('#firstName');
		this.lastNameInput = () => cy.get('#lastName');
		this.emailInput = () => cy.get('#userEmail');
		this.mobileInput = () => cy.get('#userNumber');
		this.genderWrapper = () => cy.get('#genterWrapper');
		this.dateOfBirthInput = () => cy.get('#dateOfBirth .react-datepicker__input-container input');
		this.datePickerMonthSelect = () => cy.get('.react-datepicker__month-select');
		this.datePickerYearSelect = () => cy.get('.react-datepicker__year-select');
		this.subjectsInput = () => cy.get('#subjectsContainer input');
		this.subjectsOption = (subject) => cy.get('.subjects-auto-complete__option').contains(subject);
		this.hobbiesWrapper = () => cy.get('#hobbiesWrapper');
		this.pictureUpload = () => cy.get('#uploadPicture');
		this.submitButton = () => cy.get('#submit');
		this.submissionModal = () => cy.get('.modal-content');
		this.submissionModalTitle = () => cy.get('#example-modal-sizes-title-lg');
	}

	getAccordionHeader(sectionName) {
		return this.accordionHeaders().contains(sectionName);
	}

	getAccordionList(sectionName) {
		return this.getAccordionHeader(sectionName).parents('.element-group').find('.element-list');
	}

	expandAccordion(sectionName) {
		this.getAccordionHeader(sectionName).scrollIntoView().click();
	}

	getMenuItem(itemName) {
		return this.menuItems().contains(itemName);
	}

	clickMenuItem(itemName) {
		this.getMenuItem(itemName).scrollIntoView().should('be.visible').click();
	}

	selectGender(gender) {
		this.genderWrapper().contains('label', gender).click();
	}

	fillPracticeForm({ firstName, lastName, email, gender, mobile }) {
		if (firstName) {
			this.firstNameInput().clear();
			this.firstNameInput().type(firstName);
		}

		if (lastName) {
			this.lastNameInput().clear();
			this.lastNameInput().type(lastName);
		}

		if (email) {
			this.emailInput().clear();
			this.emailInput().type(email);
		}

		if (gender) {
			this.selectGender(gender);
		}

		if (mobile) {
			this.mobileInput().clear();
			this.mobileInput().type(mobile);
		}
	}

	submitPracticeForm() {
		this.submitButton().scrollIntoView().click();
	}

	getSubmissionModal() {
		return this.submissionModal();
	}

	getSubmissionModalTitle() {
		return this.submissionModalTitle();
	}

	getSubmittedValueByLabel(label) {
		return cy.contains('.table-responsive td', label).next('td');
	}

	openPracticeFormFromLeftMenu() {
		this.clickMenuItem(this.practiceFormItem);
		cy.url().should('include', `/${FORMS_PRACTICE_FORM_PATH}`);
	}

	assertFormsAccordionExpanded() {
		this.getAccordionList(this.formsAccordionSection).should('have.class', 'show').and('be.visible');
	}

	assertPracticeFormOptionVisible() {
		this.getMenuItem(this.practiceFormItem).should('be.visible');
	}

	getFirstNameInput() {
		return this.firstNameInput();
	}

	getLastNameInput() {
		return this.lastNameInput();
	}

	getEmailInput() {
		return this.emailInput();
	}

	getMobileInput() {
		return this.mobileInput();
	}

	shouldNotShowSubmissionModal() {
		cy.get('body').find('.modal-content').should('not.exist');
	}

	goToPracticeFormFilledAndSubmit(data) {
		this.openPracticeFormFromLeftMenu();
		this.fillPracticeForm(data);
		this.submitPracticeForm();
	}

	selectDateOfBirth({ day, month, year }) {
		this.dateOfBirthInput().click();
		this.datePickerMonthSelect().select(month);
		this.datePickerYearSelect().select(year);
		cy.get('.react-datepicker__day')
			.not('.react-datepicker__day--outside-month')
			.contains(new RegExp(`^${day}$`))
			.click();
	}

	addSubject(subject) {
		this.subjectsInput().type(subject);
		this.subjectsOption(subject).click();
	}

	selectHobby(hobby) {
		this.hobbiesWrapper().contains('label', hobby).click();
	}

	uploadPicture(fixturePath) {
		this.pictureUpload().selectFile(`cypress/fixtures/${fixturePath}`, { force: true });
	}

	fillPracticeFormFull({ firstName, lastName, email, gender, mobile, dateOfBirth, subjects, hobbies, picture }) {
		this.fillPracticeForm({ firstName, lastName, email, gender, mobile });

		if (dateOfBirth) {
			this.selectDateOfBirth(dateOfBirth);
		}

		if (subjects) {
			subjects.forEach((subject) => this.addSubject(subject));
		}

		if (hobbies) {
			hobbies.forEach((hobby) => this.selectHobby(hobby));
		}

		if (picture) {
			this.uploadPicture(picture);
		}
	}

	validateSubmissionModal({ firstName, lastName, email, gender, mobile, dateOfBirth, subjects, hobbies, picture }) {
		this.getSubmissionModal().should('be.visible');
		this.getSubmissionModalTitle().should('have.text', 'Thanks for submitting the form');
		this.getSubmittedValueByLabel('Student Name').should('have.text', `${firstName} ${lastName}`);
		this.getSubmittedValueByLabel('Student Email').should('have.text', email);
		this.getSubmittedValueByLabel('Gender').should('have.text', gender);
		this.getSubmittedValueByLabel('Mobile').should('have.text', mobile);
		if (dateOfBirth) {
			this.getSubmittedValueByLabel('Date of Birth').should(
				'have.text',
				`${dateOfBirth.day.padStart(2, '0')} ${dateOfBirth.month},${dateOfBirth.year}`,
			);
		}
		if (subjects) {
			this.getSubmittedValueByLabel('Subjects').should('have.text', subjects.join(', '));
		}
		if (hobbies) {
			this.getSubmittedValueByLabel('Hobbies').should('have.text', hobbies.join(', '));
		}
		if (picture) {
			this.getSubmittedValueByLabel('Picture').should('have.text', picture);
		}
	}
}

module.exports = FormsPage;
