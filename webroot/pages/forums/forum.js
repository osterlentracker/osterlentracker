import ko from "knockout";
import forumTemplate from "./forum.html!text";
import authenticationService from 'services/authentication';
import utils from 'modules/utils';
import navigation from "services/navigation";

import "./forum.css!";

class forumViewModel {	
	constructor(params) {
		this.user = authenticationService.user;
		
		this.categoryId = params.forumId;
		this.category = ko.observable(null);
		
		this.topics = ko.observableArray(null);
		this.validation_error = ko.observable(null);
		
		this.currentPage = ko.observable(0);
		this.rowsPerPage = ko.observable(5);
		
		this.titleValidationMessage = ko.observable(null);
		this.bodyValidationMessage = ko.observable(null);
		this.genericValidationMessage = ko.observable(null);		
		
		this.maxPages = ko.computed(() => {
			if (this.topics().length > 0)
				return Math.floor((this.topics().length-1)/this.rowsPerPage());
			else
				return 0;
		}, this);
		
		this.pagedTopics = ko.computed(() => {
			var max = this.maxPages();
			
			var at = this.currentPage() * this.rowsPerPage();		
			return this.topics.slice(at, at + this.rowsPerPage());
		}, this);

		this._getCategory(this.categoryId)
		this._getTopicsFromDb(this.categoryId);		
	}
	
	goBack() {
		navigation.navigate('/#forums');
		$("html, body").animate({ scrollTop: 0 }, "slow");
	}

	gotoPrevPage() {
		if (this.currentPage() > 0)
			this.currentPage(this.currentPage() - 1);
		$("html, body").animate({ scrollTop: 0 }, "slow");
	}
	
	gotoNextPage() {
		if (this.currentPage() < this.maxPages())
			this.currentPage(this.currentPage() + 1);
		$("html, body").animate({ scrollTop: 0 }, "slow");
	}
	
	onChangeTopic() {
		navigation.navigate('/#forums/' + this.forum_category_id + '/thread/' + this.id);
		$("html, body").animate({ scrollTop: 0 }, "slow");
	}
	
	async onSaveTopic() {
		var title = $('#topicTitle').val();
		var body = $('#topicBody').val();
		
		if (this.user === null) {
			this.genericValidationMessage('Du måste vara inloggad för att kunna skapa nya ämnen.');
			return;
		}

		if (title.length === 0) {
			this.titleValidationMessage('Titel måste anges.');
			return;
		}
		
		if (body.length === 0) {
			this.bodyValidationMessage('Ett innehåll måste anges.');
			return;			
		}
		
		try {
			var topic = await client.call(
				'Forum',
				'saveTopic',
				title,
				body,
				this.categoryId
			);
			if (topic !== null) {
				this.topics.push(topic);
				navigation.navigate('/#forums/' + this.categoryId + '/thread/' + topic.id);
				$("html, body").animate({ scrollTop: 0 }, "slow");
			}
		} catch (e) {
			this.genericValidationMessage(e);
		}
	}
	async _getCategory(categoryId) {
		this.category(await client.call('Forum', 'getCategoryById', categoryId))
	}
	
	async _getTopicsFromDb(categoryId) {
		this.topics(await client.call('Forum', 'getTopics', categoryId));
	}
}

export default { viewModel: forumViewModel, template: forumTemplate };