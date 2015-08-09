import ko from "knockout";
import $ from "jquery";

import { delay } from "modules/utils";

import "./social.css!";

class socialViewModel {
	constructor() {		
		this.items = ko.observableArray();
		
		this.updateInterval = 10000; // Interval in ms before showing next feeds.
		this.page = ko.observable(0); // Current feed page displayed.
		this.limit = 4; // Maximum feeds per page.
		
		// Compute total number of pages based on number of feeds.
		this.maxPages = ko.computed(() => {
			return Math.floor(this.items().length/this.limit);			
		});
		
		// Return feeds on this page.
		this.visibleItems = ko.computed(() => {	
			/*
			let begin = this.page()*this.limit;
			let end = begin+this.limit;
			*/
			return this.items.slice(0, 5);
		}, this);
		
		// Handle the page switch.
		/*
		this.updatePages = function() {
			$('#social_sidebar').fadeOut(300, () => {
				if (this.page() >= this.maxPages())
					this.page(0);
				else
					this.page(this.page()+1);
				
				$('#social_sidebar').fadeIn(600, () => {
					setTimeout(() => { 
						this.updatePages();
					}, this.updateInterval);
				});
			});
		}
		*/
		
		// Trigger the page switch.
		/*
		setTimeout(() => {
			this.updatePages();
		}, this.updateInterval);
		*/
		
		
		this.load();
	}
	
	async load() {
		var result = await client.call('Social', 'getFeed');
		for(let item of result) {
			this.items.push(item);
		}
		
		var self = this;
		
		client.on('social_updates', (updatedItems) => {
			console.log("Received changes for social feed.");
	
			var results = updatedItems.filter((item) => {
				return self.items().filter((item2) => {
					return item.id === item2.id;
				}).length === 0;	
			});

			if(results.length > 0) {
				console.log("New items in feed: " + results.length);

				for(let item of results) {
					self.items.push(item);
				}
			}

			self.items.sort(function(a, b){
				return new Date(b.date) - new Date(a.date);
			});
			
		});
	}
}

export default new socialViewModel();