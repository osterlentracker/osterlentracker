//Cake Types
import { ClientException } from 'Cake/Controller/Exception/ClientException';
import { Controller } from 'Cake/Controller/Controller';
import { ConnectionManager } from 'Cake/WebSocket/ConnectionManager';
import { TableRegistry } from 'Cake/ORM/TableRegistry';
import { Collection } from 'Cake/Collection/Collection';

//App Types
import { SessionLost } from 'App/Exception/SessionLost';
import { PermissionDenied } from 'App/Exception/PermissionDenied';

export class AdministrationController extends Controller 
{
	async initialize()
	{
		try{
			this.Users = await TableRegistry.get("Users");
			this.Sponsors = await TableRegistry.get("Sponsors");
		}catch(e){
			console.log(e);
			throw e;
		}
	}
	
	async load()
	{
		if(!await this.request.session().check('user.id')){
			throw new SessionLost();
		}
		var user = await this.Users.find()
			.where({
				'id': await this.request.session().read('user.id')
			}).first();
		if(!user.flags.administrator){
			throw new PermissionDenied();
		}
		var data = {
			users: [],
			sponsors: []
		};
		
		var users = await this.Users.find('all').all();
		users.forEach((user) => {
			data.users.push({
				id: user.id,
				nickname: user.nickname,
				email: user.email,
				cell_phone: user.cell_phone,
				last_login: user.last_login,
				created: user.created,
				options: user.options,
				status: {
					activated: user.flags.activated,
					enabled: user.flags.enabled,
					social: user.flags.social,
					notification: user.flags.notification
				},
				roles: {
					moderator: user.flags.moderator,
					administrator: user.flags.administrator
				}
			});
		});
		//console.log(data.users);
		var sponsors = await this.Sponsors.find('all').all();
		sponsors.forEach((sponsor) => {
			data.sponsors.push(sponsor.toArray());
		});
		return data;
	}
	
	async deleteSponsor(id = null)
	{
		if(!await this.request.session().check('user.id')){
			throw new SessionLost();
		}
		var user = await this.Users.find()
			.where({
				'id': await this.request.session().read('user.id')
			}).first();
		if((user.flags & 32) !== 32){
			throw new PermissionDenied();
		}
		if(id !== null && /^[0-9a-zA-Z\-]{36}$/.test(id)){
			await this.Sponsors.query().delete().where({id: id}).execute();
		}
	}
	
	async saveSponsor()
	{
		if(!await this.request.session().check('user.id')){
			throw new SessionLost();
		}
		var user = await this.Users.find()
			.where({
				'id': await this.request.session().read('user.id')
			}).first();
		if((user.flags & 32) !== 32){
			throw new PermissionDenied();
		}
		var error = false;
		var data = new Collection(this.request.data);
		var sponsor = await this.Sponsors.newEntity({
			name: null,
			url: null,
			image: null,
			begin_date: null,
			end_date: null,
			enabled: 0
		});
		data.forEach((value) => {
			value.error = null;
		});
		if(data.extract('id.value') !== null && /^[0-9a-zA-Z\-]{36}$/.test(data.extract('id.value'))){
			sponsor.id = data.extract('id.value');
		}
		if(data.extract('name.value') !== null && /^[0-9a-zA-ZåäöÅÄÖ \-\&]{1,}$/.test(data.extract('name.value'))){
			sponsor.name = data.extract('name.value');
		}else{
			error = true;
			data = data.insert('name.error', 'Felaktigt ifyllt');
		}
		if(data.extract('url.value') !== null && /^[a-zA-Z\:\/\.\?\#\_]{1,}$/.test(data.extract('url.value'))){
			sponsor.url = data.extract('url.value');
		}else{
			error = true;
			data = data.insert('url.error', 'Felaktigt ifyllt');
		}
		if(data.extract('image.value') !== null && /^[a-zA-Z\:\/\.\?\#\_]{1,}$/.test(data.extract('image.value'))){
			sponsor.image = data.extract('image.value');
		}else{
			error = true;
			data = data.insert('image.error', 'Felaktigt ifyllt');
		}
		if(data.extract('enabled.value') !== null && data.extract('enabled.value') !== ''){
			if(/^[0-1]$/.test(data.extract('enabled.value'))){
				sponsor.enabled = data.extract('enabled.value');
			}else{
				error = true;
				data = data.insert('enabled.error', 'Felaktigt ifyllt');
			}
		}
		if(data.extract('begin_date.value') !== null && data.extract('begin_date.value') !== ''){
			if(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/.test(data.extract('begin_date.value'))){
				sponsor.begin_date = data.extract('begin_date.value');
			}else{
				error = true;
				data = data.insert('begin_date.error', 'Felaktigt ifyllt');
			}
		}
		if(data.extract('end_date.value') !== null && data.extract('end_date.value') !== ''){
			if(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/.test(data.extract('end_date.value'))){
				sponsor.end_date = data.extract('end_date.value');
			}else{
				error = true;
				data = data.insert('end_date.error', 'Felaktigt ifyllt');
			}
		}
		
		if(error === false){
			await this.Sponsors.save(sponsor);
		}
		return {
			fields: data.toObject(),
			error: error
		};
	}
	
}