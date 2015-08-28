import { Configure } from 'Cake/Core/Configure';
import { ConnectionManager } from 'Cake/Datasource/ConnectionManager';
import { SessionManager } from 'Cake/Core/Configure';

import path from 'path';
import paths from '../config/paths';
import cakejs from 'cakejs';
import { Type } from 'Cake/Database/Type';

Type.map('options_bitwise', 'App/Database/Type/OptionsBitwiseType');
Type.map('flags_bitwise', 'App/Database/Type/FlagsBitwiseType');
require(path.resolve(__dirname,'..','config','bootstrap'));
Configure.write('Datasources', {
	"default": {
		"driver": "Mysql",
		"host": "127.0.0.1",
		"username": "test",
		"password": "test",
		"database": "test"
	},
	"test": {
		"driver": "Mysql",
		"host": "127.0.0.1",
		"username": "test",
		"password": "test",
		"database": "test"
	}
});
Configure.write('Web', {
	"port": 31337,
	"host": "http://localhost:31337"
});
Configure.write('Facebook', {
	"login": {
		"id": "test",
		"secret": "test"
	},
	"feed": {
		"id": "test",
		"secret": "test"
	}
});
Configure.write('SMTP', {
	"service": "SMTP",
	"host": "",
	"port": 25,
	"ignoreTLS": true
});
if(ConnectionManager.configured().length === 0){
	ConnectionManager.config(Configure.consume('Datasources'));
}