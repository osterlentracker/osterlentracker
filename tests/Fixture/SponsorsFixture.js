//Cake Types
import { TestFixture } from 'Cake/TestSuite/Fixture/TestFixture';

export class SponsorsFixture extends TestFixture
{	
	fields = {
		id: 'uuid',
		name: 'string',
		url: 'string',
		image: 'string',
		begin_date: 'datetime',
		end_date: 'datetime',
		enabled: 'boolean',
		clicks: 'integer',
		_constraints: {
			primary: { type: 'primary', columns: ['id'] }
		}
	};

	records = [
		{
			id: 'c8c543ca-4deb-2c6d-997b-87e717c64148',
			name: 'Stark Industry',
			url: 'http://example.com/',
			image: 'http://example.com/image.png',
		}
	];
}