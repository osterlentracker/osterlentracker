import { Configure } from 'Cake/Core/Configure';
import { ConnectionManager } from 'Cake/Datasource/ConnectionManager';
import { SessionManager } from 'Cake/Core/Configure';
import path from 'path';

require(path.resolve(__dirname,'..','config','bootstrap'));

Configure.write('Web.port', 31337);