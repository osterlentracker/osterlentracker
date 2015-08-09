//Uses
import { IntegrationTestCase } from 'Cake/TestSuite/IntegrationTestCase';
import { TableRegistry } from 'Cake/ORM/TableRegistry';

export class AdministrationTest extends IntegrationTestCase
{
	fixtures = [ 'app.users', 'app.sponsors' ];
	
	async setUp()
	{
		await super.setUp();
		await this.session({
			'user': {
				'id': 'ad24b561-5d5b-433a-93d3-5e64b306055a'
			}
		});
		
		this.Users = await TableRegistry.get('Users');
	}
	
	/**
	 * Tests permissions check
	 */
	async testPermission()
	{
		await this.session({
			'user': {
				'id': '6386bc26-c784-8f8c-22ab-2b48af154623'
			}
		});
		await this.get('/administration/load');
		this.assertResponseClientException();
		
		await this.session({
			'user': {
				'id': 'ad24b561-5d5b-433a-93d3-5e64b306055a'
			}
		});
		await this.get('/administration/load');
		await this.assertResponseOk();
	}
	
	async testLoad()
	{
		await this.get('/administration/load');
		await this.assertResponseOk();
	}
}