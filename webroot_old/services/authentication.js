import ajax from 'modules/ajax';
import timeoutPromise from 'modules/timeoutPromise';
import { delay } from "modules/utils";
import ko from 'knockout'

class AuthenticationService {  
	constructor(){
		this._check();
		this._init();
		this.user = ko.observable(null);
		this.loading = ko.observable(true);
		this.isAuthenticated = ko.observable(false);
	}
	async _init(){
		client.on('AuthenticationGetDetails', async () => {
			this.user(await client.call('User', 'getUserDetails'));
		});
	}
	async _check(){
		var response = await client.call('User', 'getUserDetails');
		if(response === false){
			try{await ajax.image("/login/facebook?"+new Date().getTime());}catch(e){}
			this.user(await client.call('User', 'getUserDetails'));
		}else{
			this.user(response);
		}
		this.loading(false);
	}
	wait(){
		if(!this.loading())
			return;
		return timeoutPromise(new Promise ((resolve, reject) => {
			var subscription = this.loading.subscribe(() => {
				subscription.dispose();
				resolve();
			});
		}),5000);
	}
	
	authenticated;
}

export default new AuthenticationService();