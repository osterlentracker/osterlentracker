import { Authentication } from 'Service/Authentication';

export class TopPanel
{	
	initialized = false;
	
	get logined()
	{
		return Authentication.user !== null;
	}
	
	get nickname()
	{
		if(Authentication.user === null){
			return "";
		}
		return Authentication.user.nickname;
	}
	
	async attached()
	{
		await Authentication.initialize();
		this.initialized = true;
	}
}