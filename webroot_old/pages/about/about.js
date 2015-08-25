import ko from "knockout";
//import aboutTemplate from "./about.html!text";

import router from "modules/router";
import dialogs from "services/dialogs";

import ajax from "modules/ajax";

import "./about.css!";

class Article {
	constructor(data){
		this.title = data.title;
		this.date = data.date;
		this.summary = data.summary;
		this.thumbnail = data.image+"_small.jpg";
		this.image = data.image+".jpg";
		this.click = this.click;
	}
	click(){
		
	}
}

class Soundtrack {
	constructor(data){
		this.title = data.title;
		this.date = data.date;
		this.summary = data.summary;
		this.thumbnail = data.thumbnail;
		this.text = data.text;
		this.tracks = data.tracks;
		this.click = this.click;
	}
	click(){
		
	}
}

class aboutViewModel {
	constructor(params) {			
		this.articles = ko.observableArray();
		this.soundtracks = ko.observableArray();
		this.loading = ko.observable(false);
		this.loaded = ko.observable(false);
		
		this.route = router.currentRoute;
		
		this.load();
	}
	
	async load() {
		if(!this.loaded() && !this.loading()){
			this.loading(true);
			var json = await ajax.get('/pages/about/press.json');
			
			for(var item of json.articles) {
				this.articles.push(new Article(item));
			}
			
			for(var item of json.soundtracks) {
				this.soundtracks.push(new Soundtrack(item));
			}
			
			this.loading(false);
			this.loaded(true);
		}
	}
	
	click() {
		dialogs.showModal("title", "lead", "content", "Close");
	}
}

export default new aboutViewModel();