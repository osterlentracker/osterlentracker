//Cake Types
import { ClientException } from 'Cake/Controller/Exception/ClientException';

export class PermissionDenied extends ClientException
{
	constructor()
	{
		super("You do not have permission to view this page");
	}
}