const { defineConfig } = require('cypress');

module.exports = defineConfig({
	allowCypressEnv: false,
	numTestsKeptInMemory: 0,
	defaultCommandTimeout: 30000,
	pageLoadTimeout: 100000,
	responseTimeout: 20000,
	requestTimeout: 1000,
	chromeWebSecurity: false,
	env: {},
	e2e: {
		setupNodeEvents(on, config) {
			const { plugin: cypressGrepPlugin } = require('@cypress/grep/plugin');
			cypressGrepPlugin(config);
			return config;
		},
		baseUrl: 'https://demoqa.com/',
	},
});
