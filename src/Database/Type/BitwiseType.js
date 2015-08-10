//Cake Types
import {Type} from 'Cake/Database/Type';

export class BitwiseType extends Type
{	
	_bitwiseList = {};
	
	constructor(name)
	{
		super(name);
		for(var key in this.constructor){
			var value = this.constructor[key];
			if(typeof value === 'number'){
				if(value > 1){
					value -= 1;
					value = Math.pow(2, value);
				}
				this._bitwiseList[key.toLowerCase()] = value;
			}
		}
	}
	
	toNode(value, driver)
	{
		var object = {};
		Object.forEachSync(this._bitwiseList, (integer, key) => {
			object[key] = (value & integer) === integer;
		});
		return object;
	}
	
	toDatabase(value, driver)
	{
		switch(typeof value){
			case "number":
				return value;
				break;
			case "object":
				var options = 0;
				Object.forEachSync(this._bitwiseList, (integer, key) => {
					if(value[key] === true){
						options += integer;
					}
				});
				return options;
				break;
		}
		return 0;
	}
}