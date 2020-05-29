import { Component } from "./component";

export abstract class ComponentPage extends Component {

	public isOnThisPage(): Promise<boolean> {
		return this.isPresent();
	}

	public async waitUntilNotOnPage() {
		await this.waitForDOMElementToBeHidden(this.UNIQUE_SELECTOR_TO_IDENTIFY_THIS);
	}

}