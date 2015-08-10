//Cake Types
import { Entity } from 'Cake/ORM/Entity';

export class User extends Entity
{
	static OPTION_NEWS = 1;
	static OPTION_EMAIL = 2;
	static OPTION_SMS = 4;
}