const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  numTestsKeptInMemory: 0,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 100000,
  responseTimeout: 20000,
  requestTimeout: 1000,
  chromeWebSecurity: false,
  env:{
  },
  e2e: {
    baseUrl: 'https://demoqa.com/',
  },
});
