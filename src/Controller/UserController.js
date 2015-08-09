import { ClientException } from 'Cake/Controller/Exception/ClientException';
import { Controller } from 'Cake/Controller/Controller';
import { ConnectionManager } from 'Cake/WebSocket/ConnectionManager';

/**
 * @class UserController
 */
export class UserController extends Controller 
{
	/**
	 * Provides some data to frontend to later be used
	 * to show and hide some visuals.
	 * 
	 * @return {Array} info
	 */
	async getUserDetails()
	{
		if(!await this.request.session().check('info.hasTriedToAuthenticate')){
			await this.request.session().write('info.hasTriedToAuthenticate',true);
			return false;
		}
		var user = await this.request.session().read('user');
		if(typeof user === 'undefined' || user === null){
			return null;
		}
		return { 
			id: user.id, 
			nickname: user.nickname,
			moderator: (user.flags & 16) === 16,
			administrator: (user.flags & 32) === 32
		};
	}
}