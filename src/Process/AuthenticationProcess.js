//Cake Types
import { Process } from 'Cake/Process/Process';
import { Server } from 'Cake/Server';

//App Types
import { AuthenticationMiddleware } from 'App/Middleware/AuthenticationMiddleware';

/**
 * This is a temporary class since there is no support
 * for Middleware overloading yet, But soon there is!
 */
export class AuthenticationProcess extends Process
{
	_authenticationMiddleware = new AuthenticationMiddleware();
	async initialize()
	{
		(await Server.createServerSingelton()).on('use', (app) => {
			this._authenticationMiddleware.use(app);
		});
	}
}