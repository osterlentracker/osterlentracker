import ko from "knockout";
import $ from "jquery";
import sponsorsTemplate from "./sponsors.html!text";
import './sponsors.css!'

import { delay } from "modules/utils";

class Sponsor{
	constructor(data = null){
		this.id = ko.observable();
		this.image = ko.observable();
		this.url = ko.observable();
		this.name = ko.observable();
		if(data !== null){
			this.id(data.id);
			this.image(data.image);
			this.url(data.url);
			this.name(data.name);
		}
	}
	click(){
		window.open(this.url());
		client.call('Sponsor', 'click', this.id());
	}
}

class sponsorsViewModel {
	constructor(){
		this.display = ko.observable(false);
		this.sponsors = ko.observableArray();
	}
	async show(){
		await delay(1000);
		this.display(true);
		await delay(8000);
		this.display(false);
	}
	async initialize(element,$this){
		try{
			var data = await client.call('Sponsor', 'all');
			$this.sponsors.removeAll();
			for(var sponsor of data.sponsors){
				$this.sponsors.push(new Sponsor(sponsor));
			}
			if(data.seen)
				return;
			await $this.show();
			await client.call('Sponsor', 'seen');
		}catch(e){}
		
	}
}


ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

export default { viewModel: new sponsorsViewModel(), template: sponsorsTemplate };