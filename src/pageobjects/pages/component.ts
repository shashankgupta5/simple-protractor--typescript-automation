import { DriverHelper } from "../../helper/driverhelper";

export abstract class Component extends DriverHelper {

	UNIQUE_SELECTOR_TO_IDENTIFY_THIS: string = '';
	COMPONENT_NAME: string = '';

	public waitUntilComponentIsPresent = async () => {
		await this.waitUntilPageLoaded();
		try {
			await this.waitForDOMElementToBePresent(this.UNIQUE_SELECTOR_TO_IDENTIFY_THIS);
		} catch (err) {
			let message: string = `Waited for ${this.COMPONENT_NAME} to be present via ${this.UNIQUE_SELECTOR_TO_IDENTIFY_THIS}, 
			 but never found it, error was ${err}`;
			this.failWithErrorAndIncludePageText(message);
		}
	}

	public isPresent = async (): Promise<boolean> => {
		// Unique selector is mandatory for our strategy :)
		if (this.UNIQUE_SELECTOR_TO_IDENTIFY_THIS === null || this.UNIQUE_SELECTOR_TO_IDENTIFY_THIS === '')
			throw new Error(`${this.COMPONENT_NAME} does not have a unique selector to identify it on the page--please add it`)

		await this.waitUntilPageLoaded();
		return await this.isElementInDOM(this.UNIQUE_SELECTOR_TO_IDENTIFY_THIS);
	}

	public isNotPresent(): boolean {
		return !this.isPresent();
	}

	public getPathToThis(): string {
		return this.UNIQUE_SELECTOR_TO_IDENTIFY_THIS;
	}

}