//Cake Types
import { ClientException } from 'Cake/Controller/Exception/ClientException';

export class SessionLost extends ClientException
{
	constructor()
	{
		super("Session lost, please update your browser");
	}
}