import cakejs from 'cakejs';

export class Authentication
{
	static _callbacks = [];
	static _initialized = null;
	static _timeout = null;
	static user = null;
	
	static async _load()
	{
		try{
			var user = await cakejs.call({controller: 'User', action: 'getUserDetails'});
			Authentication.user = user;
			Authentication._initialized = true;
			if(Authentication._timeout !== null){
				clearTimeout(Authentication._timeout);
				Authentication._timeout = null;
			}
			Authentication._callbacks.forEach((callback) => {
				callback.resolve();
			});
			Authentication._callbacks = [];
		}catch(e){
			Authentication._initialized = false;
			if(Authentication._timeout !== null){
				clearTimeout(Authentication._timeout);
				Authentication._timeout = null;
			}
			Authentication._callbacks.forEach((callback) => {
				callback.reject("Authentication initialization failed due to error\n"+e);
			});
			Authentication._callbacks = [];
		}
	}
	
	static initialize()
	{
		return new Promise((resolve, reject) => {
			if(Authentication._initialized === true){
				return resolve();
			}
			if(Authentication._initialized === false){
				return reject("Authentication initialization failed");
			}
			Authentication._callbacks.push({resolve: resolve, reject: reject});
			if(Authentication._timeout !== null){
				return;
			}
			cakejs.on('AuthenticationGetDetails', () => {
				Authentication._load();
			});
			Authentication._timeout = setTimeout(() => {
				Authentication._initialized = false;
				Authentication._callbacks.forEach((callback) => {
					callback.reject("Authentication initialization failed");
				});
				Authentication._callbacks = [];
			}, 2000)
			Authentication._load();
		});
	}
}