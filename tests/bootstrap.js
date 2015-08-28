import { Configure } from 'Cake/Core/Configure';
import { ConnectionManager } from 'Cake/Datasource/ConnectionManager';
import { SessionManager } from 'Cake/Core/Configure';
import path from 'path';

require(path.resolve(__dirname,'..','config','bootstrap'));
Configure.write('Datasources', {
	"default": {
		"driver": "Mysql",
		"host": "localhost",
		"username": "test",
		"password": "test",
		"database": "test"
	},
	"test": {
		"driver": "Mysql",
		"host": "localhost",
		"username": "test",
		"password": "test",
		"database": "test"
	}
});
Configure.write('Web.port', 31337);