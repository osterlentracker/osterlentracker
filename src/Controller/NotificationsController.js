import { Controller } from 'Cake/Controller/Controller';
import { TableRegistry } from 'Cake/ORM/TableRegistry';
import { ConnectionManager } from 'Cake/WebSocket/ConnectionManager';
import { Configure } from 'Cake/Core/Configure';

/*
	{
		"id":"",
		"user_id":"d3def717-e869-1d",
		"type":"message",
		"created":"2015-08-30T22:00:00.000Z",
		"read":null,
		"text":"Hej",
		"link":null,
		"image":null
	}
*/

export class NotificationsController extends Controller {
	async pushNotification() {
		let notification = this.request.data;
		console.log(this.request);
		let notifications = await TableRegistry.get("UserNotifications");
		notification = await notifications.newEntity(notification);
		console.log(notification);		
		await notifications.save(notification);
	 	ConnectionManager.forEach((socket) => {
			console.log(socket);		
			socket.emit("notification", notification);
		});
		
		// 	this.request.session().connections.forEach((socket) => {		
	}
	
	async getNotifications() {
		let notifications = await TableRegistry.get("UserNotifications");
		return await notifications.find('all').all();
	}
}