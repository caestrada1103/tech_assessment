const { defineConfig } = require('cypress');

module.exports = defineConfig({
	allowCypressEnv: false,
	numTestsKeptInMemory: 0,
	defaultCommandTimeout: 30000,
	pageLoadTimeout: 100000,
	responseTimeout: 20000,
	requestTimeout: 1000,
	chromeWebSecurity: false,
	reporter: 'cypress-mochawesome-reporter',
	reporterOptions: {
		reportDir: 'cypress/reports',
		reportFilename: '[status]_report',
		overwrite: false,
		html: true,
		json: true,
		inlineAssets: true,
		saveAllAttempts: false,
	},
	env: {
		BOOK_API_URL: 'https://demoqa.com/BookStore/v1/Book',
	},
	e2e: {
		setupNodeEvents(on, config) {
			require('cypress-mochawesome-reporter/plugin')(on);
			const { plugin: cypressGrepPlugin } = require('@cypress/grep/plugin');
			cypressGrepPlugin(config);
			return config;
		},
		baseUrl: 'https://demoqa.com/',
	},
});
