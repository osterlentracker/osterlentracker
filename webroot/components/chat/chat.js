import ko from "knockout";
import $ from "jquery";
import authenticationService from 'services/authentication';

import "modules/utils";

import "./chat.css!";

class chatViewModel {
	constructor(params) {		
		this.load(); 
	}
	
	message = ko.observable();
	
	messages = ko.observableArray();
	
	isAuthenticated = ko.observable(true);
	
	async load() {
		var items = await client.call('Chat', 'getLatestMessages', "20");
		
		for(var item of items) {
		//console.log(item);
			this.messages.push(item);			
		}
		
		client.on('new_message', (message) => {
			this.messages.push(message);
		});
		//console.log("Auth", authenticationService.user());
		
		this.isAuthenticated(authenticationService.user() !== null);
	}
	
	async send(data, event) {
		if((event.type === "keyup" && event.keyCode === 13) || (event.type === "click")) {  
			if(!this.message()) {
				return;
			}
			var result = await client.call('Chat', 'pushMessage', this.message());
			if(result) {
				this.message("");
				setTimeout(function() {
					$("#chatTextArea").focus();
				}, 100);
			} else {
				alert("Ett fel uppstod när meddelandet skulle skickas.");
			}
		} 
	}
}

export default new chatViewModel();