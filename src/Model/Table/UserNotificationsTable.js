// Cake types
import { Table } from 'Cake/ORM/Table';

export class UserNotificationsTable extends Table
{
	_initializeSchema(schema)
	{
		schema.columnType('options', 'options_bitwise');
		schema.columnType('flags', 'flags_bitwise');
		return schema; 
	}
}