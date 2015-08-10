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
		await new Promise((resolve) => {
			setTimeout(resolve, 2000);
		});
		var user = await this.Users.find().where({id: 'ad24b561-5d5b-433a-93d3-5e64b306055a'}).first();
		this.assertEquals({
			news: false,
			email: false,
			sms: false
		}, user.options);
	}
	
	async testOptionsSetter()
	{
		var user = await this.Users.find().where({id: 'ad24b561-5d5b-433a-93d3-5e64b306055a'}).first();
		user.options = {
			news: false,
			email: true,
			sms: false
		};
		this.assertEquals({
			news: false,
			email: true,
			sms: false
		}, user.options);
		user = await this.Users.save(user);
		user = await this.Users.find().where({id: 'ad24b561-5d5b-433a-93d3-5e64b306055a'}).first();
		this.assertEquals({
			news: false,
			email: true,
			sms: false
		}, user.options);
	}
}