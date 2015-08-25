import ko from "knockout";
import router from "modules/router";
import authenticationService from 'services/authentication';
import navigationService from 'services/navigation';

class Main {
	constructor() {
		this.title = ko.observable("Österlentracker");
		this.route = router.currentRoute;
		
		this.user = authenticationService.user;
	}
	
	login(){
		navigationService.navigate('/login/facebook');
	}
	logout(){
		navigationService.navigate('/logout');
	}
}

export default new Main();