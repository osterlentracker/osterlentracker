import ko from "knockout";

import es6Loader from 'modules/es6ComponentLoader';
import utils from "modules/utils";

ko.components.loaders.unshift(es6Loader);

ko.components.register('social', {
	template: {require: 'components/social/social.html!text'},
	viewModel: {require: 'components/social/social'}
});
ko.components.register('social2', {
	template: {require: 'components/social/social2.html!text'},
	viewModel: {require: 'components/social/social'}
});
ko.components.register('chat', {
	template: {require: 'components/chat/chat.html!text'},
	viewModel: {require: 'components/chat/chat'}
});
ko.components.register('chat2', {
	template: {require: 'components/chat/chat2.html!text'},
	viewModel: {require: 'components/chat/chat'}
});
ko.components.register('chatPage', {
		template: {require: 'pages/chat/chat.html!text'},
		viewModel: {require: 'components/chat/chat'}
});

ko.components.register('tracker', {require: 'components/tracker/tracker'});
ko.components.register('sponsors', {require: 'components/sponsors/sponsors'});
ko.components.register('interactivemap', {require: 'components/interactivemap/interactivemap'});
ko.components.register('test', {require: 'components/test/test'});
ko.components.register('loginbar', {require: 'components/loginbar/loginbar'});
ko.components.register('home', {require: 'pages/home/home'});
ko.components.register('forums', {require: 'pages/forums/forums'});
ko.components.register('forum', {require: 'pages/forums/forum'});
ko.components.register('forum-thread', {require: 'pages/forums/thread'});
ko.components.register('settings', {require: 'pages/settings/settings'});
ko.components.register('administration', {require: 'pages/administration/administration'});
ko.components.register('about', {
	template: {require: 'pages/about/about.html!text'},
	viewModel: {require: 'pages/about/about'}
});
ko.components.register('about-menu', {
	template: {require: 'pages/about/components/menu.html!text'},
	viewModel: {require: 'pages/about/about'}
});
ko.components.register('press', {
	template: {require: 'pages/about/press.html!text'},
	viewModel: {require: 'pages/about/about'}
});
ko.components.register('contact', {
	template: {require: 'pages/about/contact.html!text'},
	viewModel: {require: 'pages/about/about'}
});
ko.components.register('donate', {
	template: {require: 'pages/about/donate.html!text'},
	viewModel: {require: 'pages/about/donate'}
});
