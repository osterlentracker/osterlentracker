//Cake Types
import { Entity } from 'Cake/ORM/Entity';

export class User extends Entity
{
	static OPTION_NEWS = 1;
	static OPTION_EMAIL = 2;
	static OPTION_SMS = 4;
	
	_getOptions()
	{
		return {
			news: (this._properties['options'] & User.OPTION_NEWS) === User.OPTION_NEWS,
			email: (this._properties['options'] & User.OPTION_EMAIL) === User.OPTION_EMAIL,
			sms: (this._properties['options'] & User.OPTION_SMS) === User.OPTION_SMS
		};
	}
	
	_setOptions(options)
	{
		if(options === null){
			return 0;
		}
		var newOptions = 0;
		switch(typeof options){
			case "object":
				if(typeof options.news !== 'undefined' && options.news === true){
					newOptions += User.OPTION_NEWS;
				}
				if(typeof options.email !== 'undefined' && options.email === true){
					newOptions += User.OPTION_EMAIL;
				}
				if(typeof options.sms !== 'undefined' && options.sms === true){
					newOptions += User.OPTION_SMS;
				}
				break;
			case "number":
				newOptions = options;
				break;
			default:
				return this._properties['options'];
				break;
		}
		return newOptions;
	}
}