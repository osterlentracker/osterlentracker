import ko from "knockout";
import $ from "jquery";
import socialTemplate from "./loginbar.html!text";
import authenticationService from 'services/authentication';
import navigationService from 'services/navigation';

import { delay } from "modules/utils";

import "./loginbar.css!";

class loginbarViewModel {
	constructor() {
		this.user = authenticationService.user;
	}
	login(){
		navigationService.navigate('/login/facebook');
	}
	logout(){
		navigationService.navigate('/logout');
	}
}

export default { viewModel: new loginbarViewModel(), template: socialTemplate };