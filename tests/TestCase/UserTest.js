//Uses
import { IntegrationTestCase } from 'Cake/TestSuite/IntegrationTestCase';
import { TableRegistry } from 'Cake/ORM/TableRegistry';

import { Type } from 'Cake/Database/Type';

export class UserTest extends IntegrationTestCase
{
	fixtures = [ 'app.users' ];
	
	async setUp()
	{
		await super.setUp();
		
		this.Users = await TableRegistry.get('Users');
	}
	
	async testOptionsGetter()
	{
		var user = await this.Users.find().where({id: 'ad24b561-5d5b-433a-93d3-5e64b306055a'}).first();
		this.assertEquals({
			news: false,
			email: false,
			sms: false
		}, user.options);
		var user = await this.Users.find().where({id: '6386bc26-c784-8f8c-22ab-2b48af154623'}).first();
		this.assertEquals({
			news: true,
			email: true,
			sms: false
		}, user.options);
	}
	
	async testOptionsSetter()
	{
		var user = await this.Users.find().where({id: '6386bc26-c784-8f8c-22ab-2b48af154623'}).first();
		user.options = {
			news: false,
			email: true,
			sms: true
		};
		this.assertEquals({
			news: false,
			email: true,
			sms: true
		}, user.options);
		user = await this.Users.save(user);
		user = await this.Users.find().where({id: '6386bc26-c784-8f8c-22ab-2b48af154623'}).first();
		this.assertEquals({
			news: false,
			email: true,
			sms: true
		}, user.options);
	}
}