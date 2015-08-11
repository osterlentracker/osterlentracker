//App Types
import { BitwiseType } from 'App/Database/Type/BitwiseType';

export class FlagsBitwiseType extends BitwiseType
{	
	static ACTIVATED = 1;
	static ENABLED = 2;
	static SOCIAL = 3;
	static NOTIFICATION = 4;
	static MODERATOR = 5;
	static ADMINISTRATOR = 6;
}