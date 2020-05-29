import { Config, browser } from "protractor"

export let config: Config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	framework: 'jasmine',
	capabilities: {
		browserName: 'chrome',
		chromeOptions: {
			args: [
				'no-sandbox',
				'--start-maximized',
				'disable-infobars',
				"--allow-insecure-localhost",
				"--ignore-certificate-errors",
				"--ignore-certificate-errors-spki-list"
			]
		}
		// browserName: 'firefox',
		// marionette: true,
		// acceptSslCerts : true
	},
	jasmineNodeOpts: {
		showColors: true,
		silent: true
	},
	suites: {
		superCalculatorSuite: ['./specs/supercalculatorspec.js'],
		amazonSuite: ['./specs/amazonspec.js'],
		// allSuite: ['./specs/*.js', './specs/*.js']
	},

	onPrepare: () => {
		// Usage = (global as any).isAngularSite(false); // For Non Angular Sites
		(global as any).isAngularSite = (flag: boolean) => {
			browser.ignoreSynchronization = !flag;
		}

		browser.manage().window().maximize();
		browser.manage().timeouts().implicitlyWait(browser.params.driver_timeout_implicit);

		// Usage to set another global file outside here. Also, add module.exports : {}
		// Usage in ts file => browser.appGlobal.super_calculator_base_url;
		// browser.appGlobal = require('');
	},

	params: {
		super_calculator_base_url: "https://juliemr.github.io/protractor-demo/",
		amazon_base_url: "https://www.amazon.in/",
		driver_timeout_explicit: 10000,
		driver_timeout_implicit: 5000
	}
}


