import { ClientException } from 'Cake/Controller/Exception/ClientException';
import { Controller } from 'Cake/Controller/Controller';
import { ConnectionManager } from 'Cake/WebSocket/ConnectionManager';
import { Collection } from 'Cake/Collection/Collection';
import { TableRegistry } from 'Cake/ORM/TableRegistry';

export class ChatController extends Controller 
{
	static items = [];
	
	async pushMessage(message) 
	{
		if(typeof await this.request.session().read('user.id') === 'undefined'){
			throw new ClientException("Var god och uppdatera sidan");
		}
		try {
			var message2 = {
				message: message
			};
			var items = ChatController.items;
			message2.author = await this.request.session().read('user');
			message2.date = new Date();
			items.push(message2);
			ConnectionManager.forEach((socket) => {		
				socket.emit("new_message", message2);
			});
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
	
	getLatestMessages()
	{
		return ChatController.items;
	}
}