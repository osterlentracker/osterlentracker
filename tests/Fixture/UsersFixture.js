//Cake Types
import { TestFixture } from 'Cake/TestSuite/Fixture/TestFixture';
import { FlagsBitwiseType } from 'App/Database/Type/FlagsBitwiseType';
import { OptionsBitwiseType } from 'App/Database/Type/OptionsBitwiseType';

export class UsersFixture extends TestFixture
{		
	fields = {
		id: 'uuid',
		nickname: 'string',
		email: 'string',
		cell_phone: 'string',
		password: {type: 'string', length: 36},
		facebook_id: 'string',
		flags: 'integer',
		options: 'integer',
		last_login: 'datetime',
		activated: 'datetime',
		created: 'datetime',
		_constraints: {
			primary: { type: 'primary', columns: ['id'] }
		}
	};

	records = [
		{
			id: 'ad24b561-5d5b-433a-93d3-5e64b306055a',
			nickname: 'John Doe',
			email: 'john.doe@example.com',
			cell_phone: '123-1234123',
			last_login: null,
			flags: 63,
			activated: new Date().format("yyyy-mm-dd HH:MM:ss"),
			created: new Date().format("yyyy-mm-dd HH:MM:ss")
		},
		{
			id: '6386bc26-c784-8f8c-22ab-2b48af154623',
			nickname: 'Jane Doe',
			email: 'jane.doe@example.com',
			cell_phone: '123-1234123',
			last_login: null,
			flags: 15,
			options: OptionsBitwiseType.add(OptionsBitwiseType.EMAIL, OptionsBitwiseType.NEWS),
			activated: new Date().format("yyyy-mm-dd HH:MM:ss"),
			created: new Date().format("yyyy-mm-dd HH:MM:ss")
		},
	];
}