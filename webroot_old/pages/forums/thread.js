import ko from "knockout";
import threadTemplate from "./thread.html!text";
import navigation from "services/navigation";
import authenticationService from 'services/authentication';
import utils from 'modules/utils';

import "./forum.css!";

class Comment {
	constructor(data){
		this.id = data.id;
		this.body = data.body;
	}
}


class threadViewModel {	
	constructor(params) {
		self = this;
		
		this.user = authenticationService.user;
		
		this.categoryId = params.forumId;
		this.topicId = params.threadId;
		
		this.topic = ko.observable(null);
		this.posts = ko.observableArray(null);
		
		this.bbPost = function (body) {
			return String(body)
				.replace(/\[code\]((.|\n)*)\[\/code\]/g, '<pre>$1</pre>')
				.replace(/\[img\](.*)\[\/img\]/g, '<img src="$1" alt="$1" />')
				.replace(/\[b\](.*)\[\/b\]/g, '<strong>$1</strong>')
				.replace(/\[i\](.*)\[\/i\]/g, '<em>$1</em>')
				.replace(/\[url\](.*)\[\/url\]/g, '<a href="$1">$1</a>')
				.replace(/\[quote\]((.|\n)*)\[\/quote\]/g, '<blockquote>$1</blockquote>')
				.replace(/\[color\=([A-Za-z0-9]+)\](.*)\[\/color\]/g, '<span style="color: $1">$2</span>')
				.replace(/\[size\=([0-9]+)\](.*)\[\/size\]/g, '<span style="font-size: $1px">$2</span>')
				.replace(/\:\)/g, '<a href="http://www.freesmileys.org/smileys.php" title="Smiley"><img src="http://www.freesmileys.org/smileys/smiley-basic/biggrin.gif" alt="Smiley" border="0" /></a>')
				.replace(/\:\-\)/g, '<a href="http://www.freesmileys.org/smileys.php" title="Smiley"><img src="http://www.freesmileys.org/smileys/smiley-basic/biggrin.gif" alt="Smiley" border="0" /></a>')
				.replace(/\:\(/g, '<a href="http://www.freesmileys.org/smileys.php" title="Smiley"><img src="http://www.freesmileys.org/smileys/smiley-basic/mad.gif" alt="Smiley" border="0" /></a>')
				.replace(/\:\-\(/g, '<a href="http://www.freesmileys.org/smileys.php" title="Smiley"><img src="http://www.freesmileys.org/smileys/smiley-basic/mad.gif" alt="Smiley" border="0" /></a>')
				.replace(/\n/, '<br />')
		}

		
		var commentTemplate = {
			id: null,
			value: null
		};
		this.commentField = ko.observable(commentTemplate);
		this.genericValidationError = ko.observable(null);
		this.bodyValidationError = ko.observable(null);
		
		this.currentPage = ko.observable(0);
		this.rowsPerPage = ko.observable(5);
				
		this.maxPages = ko.computed(() => {
			if (this.posts().length > 0)
				return Math.floor((this.posts().length-1)/this.rowsPerPage());
			else
				return 0;
		}, this);
		
		this.pagedPosts = ko.computed(() => {
			var max = this.maxPages();
			
			var at = this.currentPage() * this.rowsPerPage();		
			return this.posts.slice(at, at + this.rowsPerPage());
		}, this);

		this._getTopicFromDb(this.topicId);
		this._getPostsFromDb(this.topicId);		
	}
		
	goBack() {
		navigation.navigate('/#forums/' + this.categoryId);
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
	async onSavePost() {
		var body = this.commentField().value;
		
		var id = this.commentField().id === undefined ? null : this.commentField().id;
		
		if (this.user === null) {
			this.genericValidationError('Du måste vara inloggad för att skriva kommentarer.');
			return;
		}
		
		if (body.length === 0) {
			this.bodyValidationError('Innehål får inte vara tomt.');
			return;
		}
		
		var post = null;
		try {
			post = await client.call(
				'Forum',
				'savePost',
				body,
				self.topicId,
				id
			);
		} catch (e) {
			console.log(e);
		}
		
		if (post !== null && post.id !== this.commentField().id) {
			self.posts.push(post);

			if (this.currentPage() !== this.maxPages()) {
				this.currentPage(this.maxPages());	
				$("html, body").animate({ scrollTop: 0 }, "slow");
			}
		} else {
			for (var i = 0; i < this.posts().length; i++) {
				if (this.posts()[i].id === post.id) {
					this.posts.splice(i, 1, post);
					break;
				}
			}
		}

		this.commentField({
			value: null,
			id: null
		});
		$("html, body").animate({ scrollTop: 0 }, "slow");
	}
	
	editPost(data) {
		console.log('done1');
		$('html, body').animate({
			scrollTop: $("#commenting").offset().top
		}, 500);
		this.commentField({
			value: data.body,
			id: data.id
		});
	}
	
	deleteTopic() {
		if (confirm('Vill du verkligen ta bort ämnet?'))
			self.deleteTopicAsync(this.topicId);
	}
	
	async deleteTopicAsync(topicId) {
		var result = await client.call('Forum', 'deleteTopic', topicId);
		if (result) {
			this.goBack();
		}
	}

	deletePost(data) {
		if (confirm('Vill du verkligen ta bort kommentaren?'))
			self.deletePostAsync(data);
	}
	
	async deletePostAsync(data) {
		var result = await client.call('Forum', 'deletePost', data.id);
		if (result) {
			self.posts.remove(data);
		}
	}
	
	async _getTopicFromDb(topicId) {
		this.topic(await client.call('Forum', 'getTopicById', topicId));
	}
	
	async _getPostsFromDb(topicId) {
		this.posts(await client.call('Forum', 'getPosts', topicId));		
	}
}

export default { viewModel: threadViewModel, template: threadTemplate };