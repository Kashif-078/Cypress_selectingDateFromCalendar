const { defineConfig } = require("cypress")
const fs = require('fs')

module.exports = defineConfig(
{
	defaultCommandTimeout: 20000,
    pageLoadTimeout: 30000,
    // viewportWidth: 1280,
    // viewportHeight: 720,

    // To generate Reports
    reporter: "mochawesome",
		reporterOptions: {
		reportDir: "cypress/reports",
		charts: true, //  It will Generates Chart in HTML report.
		reportPageTitle: 'Cypress Inline Reporter', // It will setReport title.
		embeddedScreenshots: true, // Screenshot will be embedded      within the report.
		inlineAssets: true, // No separate assets folder will be created
		toConsole: true,
		overwrite: false,
		html: true,
		json: false
    },
  	e2e:
    {
      	// baseUrl: 'https://www.google.com/', 
        setupNodeEvents(on, config) 	
      	{
			on('after:spec', (spec, results) => {
				if (results && results.video) {
					// Do we have failures for any retry attempts?
					const failures = results.tests.some((test) =>
						test.attempts.some((attempt) => attempt.state === 'failed')
					)
					if (!failures) {
						// delete the video if the spec passed and no tests retried
						fs.unlinkSync(results.video)
					}
				}
			})
            // Implement node event listeners here
        },
        // To retry if test fails on 1st attempt as by default cypreess doesn't retry in cypress open
        // Cypress run: By default, Cypress retries failed tests up to 3 times.
        // Cypress open: When using cypress open, Cypress does not perform retries automatically. 
		retries: {
			runMode: 3,  // Number of retries for cypress run
			openMode: 3,  // Number of retries for cypress open
		},
        onBeforeUnload: false,
        testIsolation: false,
        numTestsKeptInMemory: 1,
        experimentalMemoryManagement: true,
		experimentalMemoryKey: true,
        video: true,
		videoCompression: true,
        chromeWebSecurity: false, // This is needed to access about:blank in some scenarios
        chromeWebSecurityHeaders: 
        {
          	"about:blank": [
            	{
              		name: "Content-Security-Policy",
              		value: "default-src 'none'; frame-src 'none';"
            	}
          	]
        }
    }
})