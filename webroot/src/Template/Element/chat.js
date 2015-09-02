import { Authentication } from 'Service/Authentication';

import cakejs from 'cakejs';

export class Chat
{
	initialized = false;
	text: "";
	messages: [];
	
	submit()
	{
		cakejs.call({controller: 'Chat', action: 'addMessage'}, this.text);
		this.text = "";
	}
	
	get logined()
	{
		return Authentication.user !== null;
	}
	
	onNewChatMessage(message)
	{
		this.messages.unshift(message);
		while(this.messages.length > 25){
			this.messages.pop();
		}
	}
	
	async attached()
	{		
		await Authentication.initialize();
		this.messages = await cakejs.get({controller: 'Chat', action: 'getMessages'});
		cakejs.on('newChatMessage', (message) => {
			this.onNewChatMessage(message);
		});
		this.initialized = true;
	}
}