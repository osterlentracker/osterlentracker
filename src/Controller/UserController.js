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
		var user = await this.request.session().read('user');
		if(typeof user === 'undefined' || user === null){
			return null;
		}
		return { 
			nickname: user.nickname,
			moderator: user.flags.moderator,
			administrator: user.flags.administrator
		};
	}
}