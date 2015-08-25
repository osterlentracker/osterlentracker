import ko from "knockout";
import homeTemplate from "./home.html!text";

import tracker from "components/tracker/tracker"

class homeViewModel {
	constructor(params) {			
		this.title = ko.observable('Tracker');
	}
	
	init() {
		tracker.viewModel.initialize();
	}
}

export default { viewModel: new homeViewModel(), template: homeTemplate }; 