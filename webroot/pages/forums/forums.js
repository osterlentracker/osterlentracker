import ko from "knockout";
import forumsTemplate from "./forums.html!text";
import navigation from "services/navigation";

import "./forum.css!";

class forumsViewModel {	
	constructor() {
		this.pageTitle = ko.observable('Forums');
		this.categories = ko.observableArray();
		this._getCategoriesFromDb();
	}
	
	onChangeCategory() {
		navigation.navigate('/#forums/' + this.id);
		$("html, body").animate({ scrollTop: 0 }, "slow");
	}
	
	async _getCategoriesFromDb() {
		this.categories(await client.call('Forum', 'getCategories'));
	}
}

export default { viewModel: new forumsViewModel(), template: forumsTemplate };