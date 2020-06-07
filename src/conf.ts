import { Config, browser } from 'protractor';
import { SpecReporter, StacktraceOption } from 'jasmine-spec-reporter';

declare const allure: any;

export let config: Config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	framework: 'jasmine2',
	capabilities: {
		browserName: 'chrome',
		chromeOptions: {
			args: [
				"--no-sandbox",
				"--disable-infobars",
				"--disable-notifications",
				"--disable-extensions",
				"--allow-insecure-localhost",
				"--ignore-certificate-errors",
				"--enable-strict-powerful-feature-restrictions"
			]
		},
		acceptInsecureCerts: true,
	},

	jasmineNodeOpts: {
		showColors: true,
		silent: true,
		defaultTimeoutInterval: 25000
	},

	suites: {
		superCalculatorSuite: ['./specs/supercalculatorspec.js'],
		amazonSuite: ['./specs/amazonspec.js'],
		allSuite: ['./specs/*.js']
	},

	onPrepare: () => {
		// Usage = (global as any).isAngularSite(false); // For Non Angular Sites
		(global as any).isAngularSite = (flag: boolean) => {
			browser.ignoreSynchronization = !flag;
		}

		browser.manage().window().maximize();
		browser.manage().timeouts().implicitlyWait(browser.params.driver_timeout_implicit);
		browser.manage().timeouts().setScriptTimeout(browser.params.driver_timeout_implicit);

		// Usage to set another global file outside here. Add module.exports : {} to a separate file
		// Usage in ts file => browser.appGlobal.super_calculator_base_url;
		// browser.appGlobal = require('');

		jasmine.getEnv().clearReporters();
		jasmine.getEnv().addReporter(new SpecReporter({
			suite: {
				displayNumber: true
			},
			spec: {
				displayStacktrace: StacktraceOption.PRETTY,
				displayErrorMessages: true,
				displaySuccessful: true,
				displayFailed: true,
				displayPending: true,
				displayDuration: true
			},
			summary: {
				displayErrorMessages: true,
				displayStacktrace: StacktraceOption.PRETTY,
				displaySuccessful: true,
				displayFailed: true,
				displayPending: true,
				displayDuration: true,
			},
			colors: {
				enabled: true,
				successful: 'green',
				failed: 'red',
				pending: 'yellow'
			},
			prefixes: {
				successful: '✓ ',
				failed: '✗ ',
				pending: '* '
			},
			customProcessors: []
		}));

		var AllureReporter = require('jasmine-allure-reporter');
		jasmine.getEnv().addReporter(new AllureReporter({
			resultsDir: 'results'
		}));
		jasmine.getEnv().afterEach(function (done) {
			browser.takeScreenshot().then(function (png) {
				allure.createAttachment('Screenshot', function () {
					return new Buffer(png, 'base64')
				}, 'image/png')();
				done();
			})
		});
	},

	params: {
		super_calculator_base_url: "https://juliemr.github.io/protractor-demo/",
		amazon_base_url: "https://www.amazon.in/",
		driver_timeout_explicit: 10000,
		driver_timeout_implicit: 5000
	}
}