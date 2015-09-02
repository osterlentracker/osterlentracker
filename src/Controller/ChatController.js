import { ClientException } from 'Cake/Controller/Exception/ClientException';
import { Controller } from 'Cake/Controller/Controller';
import { ConnectionManager } from 'Cake/WebSocket/ConnectionManager';
import { Collection } from 'Cake/Collection/Collection';
import { TableRegistry } from 'Cake/ORM/TableRegistry';

export class ChatController extends Controller 
{
	static messages = null;
	
	/**
	 * Initializes the controller and loads the last 25
	 * chat messages from database
	 * 
	 * @returns {void}
	 */
	async initialize()
	{
		this.ChatMessages = await TableRegistry.get('ChatMessages');
		this.Users = await TableRegistry.get('Users');
		
		if(ChatController.messages === null){
			ChatController.messages = [];
			let chatMessages = await this.ChatMessages.find()
				.order({'created': 'DESC'})
				.limit(25)
				.all();
		
			chatMessages.forEach((chatMessage) => {
				let message = {
					text: chatMessage.text,
					user: chatMessage.user_id,
					datetime: chatMessage.created.format("mysqlDateTime")
				};

				ChatController.messages.push(message);
			});
			
			for(var key in ChatController.messages){
				let message = ChatController.messages[key];
				let user = await this.Users.find()
						.where({id: message.user})
						.first();
				message.user = {
					id: message.user,
					name: user !== null ? user.nickname : "Borttagen",
					color: "white"
				};
				ChatController.messages[key] = message;
			}
		}
	}
	
	/**
	 * Adds message to chat history and
	 * pushes the new message to all browsers
	 * 
	 * @returns {void}
	 */
	async addMessage(text) 
	{
		text = text.trim();
		if(text.length === 0){
			return false;
		}
		
		let user = await this.request.session().read('user');
		if(typeof user === 'undefined' || user === null){
			throw new ClientException("Du behöver vara inloggad för att kunna chatta");
		}
		
		let message = {
			text: text,
			user: {
				id: user.id,
				name: user.nickname,
				color: "white"
			},
			datetime: new Date().format('mysqlDateTime')
		};
		
		// Removes overflowing messages from cache
		ChatController.messages.unshift(message);
		while(ChatController.messages.length > 25){
			ChatController.messages.pop();
		}
		
		// Emits new message to all browsers
		ConnectionManager.forEach((socket) => {		
			socket.emit("newChatMessage", message);
		});
		
		// Adds message to database
		let chatMessage = this.ChatMessages.newEntity({
			"user_id": message.user.id,
			"text": message.text,
			"created": new Date()
		});
		
		await this.ChatMessages.save(chatMessage);
	}
	
	/**
	 * Retrieves all stored messages from history
	 * 
	 * @returns {Object} chat messages
	 */
	getMessages()
	{
		return ChatController.messages;
	}
}