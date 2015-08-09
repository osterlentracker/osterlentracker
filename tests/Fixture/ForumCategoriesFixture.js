//Cake Types
import { TestFixture } from 'Cake/TestSuite/Fixture/TestFixture';

export class ForumCategoriesFixture extends TestFixture
{	
	fields = {
		id: 'uuid',
		title: 'string',
		description: 'text',
		permission_create: 'integer',
		_constraints: {
			primary: { type: 'primary', columns: ['id'] }
		}
	};

	records = [
		{
			title: 'Example Category',
			description: 'Example Category Description',
			permission_create: null
		},
		{
			title: 'Example Category Locked',
			description: 'Example Category Description',
			permission_create: 32
		}
	];
}