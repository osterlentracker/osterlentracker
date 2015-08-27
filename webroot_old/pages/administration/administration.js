import ko from "knockout";
import administrationTemplate from "./administration.html!text";
import AuthenticationService from "services/authentication"
import './administration.css!'

class User {
	constructor(data){
		this.nickname = data.nickname;
		this.email = data.email;
		this.last_login = data.last_login !== null ? new Date(data.last_login).format('yyyy-MM-dd hh:mm') : null;
		this.created = data.created !== null ? new Date(data.created).format('yyyy-MM-dd hh:mm') : null;
	}
}

class Sponsor {
	constructor(data){
		this.id = data.id;
		this.name = data.name;
		this.url = data.url;
		this.image = data.image;
		this.begin_date = data.begin_date === null ? null : new Date(data.begin_date).format('yyyy-MM-dd');
		this.end_date = data.end_date === null ? null : new Date(data.end_date).format('yyyy-MM-dd');
		this.enabled = data.enabled === 1?true:false;
		this.visible = () => {
			if(!this.enabled)
				return false;
			if(this.begin_date !== null && new Date(this.begin_date) > new Date())
				return false;
			if(this.end_date !== null && new Date(this.end_date).modify(3600*24) < new Date())
				return false;
			return true;
		};
		this.clicks = data.clicks;
	}
}
// Forum ...
class ForumCategory {
	constructor(data){
		this.id = data.id;
		this.title = data.title;
		this.description = data.description;
	}
}

class administrationViewModel {
	constructor(params) {
		this.title = ko.observable('Inställningar');
		this.display = ko.observable(false);
		this.users = ko.observableArray();
		this.sponsors = ko.observableArray();
		// Forum ...
		this.forumCategories = ko.observableArray();
		this.displayForumCreateCategory = ko.observable(false);
		this.setForumCreateCategoryFields(null);
		
		this.displayCreateSponsor = ko.observable(false);
		
		this.setSponsorFields(null);
		
		this.load();
	}
	
	// Forum ...
	setForumCreateCategoryFields(data = null) {
		data = {
			id: { 
				value: data === null ? null : data.id 
			},
			title: {
				error: null,
				value: data === null ? null : data.title
			},
			description: {
				error: null,
				value: data === null ? null : data.description
			}
		};
		if(typeof this.forumCategoryError === 'undefined')
			this.forumCategoryError = ko.observable(null);
		if(typeof this.forumCategoryFields === 'undefined')
			this.forumCategoryFields = ko.observable(null);
		this.forumCategoryFields(data);
	}
	
	setSponsorFields(data = null){
		data = {
			id: {
				value: data === null ? null : data.id
			},
			name: {
				error: null,
				value: data === null ? null : data.name
			},
			url: {
				error: null,
				value: data === null ? null : data.url
			},
			image: {
				error: null,
				value: data === null ? null : data.image
			},
			begin_date: {
				error: null,
				value: data === null ? null : data.begin_date
			},
			end_date: {
				error: null,
				value: data === null ? null : data.end_date
			},
			enabled: {
				error: null,
				value: data === null ? true : data.enabled
			}			
		};
		if(typeof this.sponsorError === 'undefined')
			this.sponsorError = ko.observable(null);
		if(typeof this.sponsorFields === 'undefined')
			this.sponsorFields = ko.observable(null);
		this.sponsorFields(data);
	}
	async load(){
		await AuthenticationService.wait();
		if(AuthenticationService.user() === null || AuthenticationService.user().administrator === false){			
			return;
		}
		try{
			var data = await client.call('Administration', 'load'); 
			this.users.removeAll();
			for(var user of data.users){
				this.users.push(new User(user));
			}
			this.sponsors.removeAll();
			for(var sponsor of data.sponsors){
				this.sponsors.push(new Sponsor(sponsor));
			}
			
			// Lägger till inladdning av forum här sålänge, kanske ska vara egen funktion? /Andreas
			var forumCategories = await client.call('Forum', 'getCategories');
			this.forumCategories.removeAll();
			for (var category of forumCategories)
				this.forumCategories.push(new ForumCategory(category));
			
		}catch(e){
			console.log(e);
		}
		this.display(true);
	}
	// Forum ...
	toggleCreateForumCategory(){
		this.setForumCreateCategoryFields();
		this.displayForumCreateCategory(!this.displayForumCreateCategory());
	}

	toggleDisplayCreateSponsor(){
		this.setSponsorFields();
		this.displayCreateSponsor(!this.displayCreateSponsor());
	}
	
	// Forum ...
	async saveForumCategory(){
		this.forumCategoryError(null);
		try {
			var data = await client.call('Forum', 'saveCategory', this.forumCategoryFields().title.value, this.forumCategoryFields().description.value, this.forumCategoryFields().id.value);
			var formData = { 
				fields: data, 
				error: false 
			}
			this.forumCategoryFields(formData.fields);
			this.forumCategoryError(formData.error);
			if (this.forumCategoryError() === false){
				this.setForumCreateCategoryFields();
				this.displayForumCreateCategory(false);
				this.load();
			}
		} catch (e) {
			console.log(e);
		}
	}
	
	// Forum ...
	async deleteForumCategory(){
		if(confirm('Är du säker på att du vill ta bort "'+this.forumCategoryFields().title.value+'"?')){
			await client.call('Forum', 'deleteCategory', this.forumCategoryFields().id.value);
			this.setForumCreateCategoryFields();
			this.displayForumCreateCategory(false);
			this.load();
		}
	}
	
	async saveSponsor(){
		this.sponsorError(null);
		try{
			var data = await client.call('Administration', 'saveSponsor', this.sponsorFields());
			this.sponsorFields(data.fields);
			this.sponsorError(data.error);
			if(this.sponsorError() === false){
				this.setSponsorFields();
				this.displayCreateSponsor(false);
				this.load();
			}
		}catch(e){
			console.log(e);
		}
	}
	// Forum ...
	async openForumCategory(data){
		this.setForumCreateCategoryFields(data);
		this.displayForumCreateCategory(true);
	}
	async openSponsor(data){
		this.setSponsorFields(data);
		this.displayCreateSponsor(true);
	}
	async deleteSponsor(data){
		if(confirm('Är du säker på att du vill ta bort "'+this.sponsorFields().name.value+'"?')){
			await client.call('Administration', 'deleteSponsor', this.sponsorFields().id.value);
			this.setSponsorFields();
			this.displayCreateSponsor(false);
			this.load();
		}
	}
	async reload(){
		this.load();
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

export default { viewModel: new administrationViewModel(), template: administrationTemplate }; 