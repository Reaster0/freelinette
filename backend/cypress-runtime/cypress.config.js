const { defineConfig } = require("cypress");

module.exports = defineConfig({
	chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
		require("@deploysentinel/cypress-recorder")(on, config);
      // implement node event listeners here
    },
  },
});
