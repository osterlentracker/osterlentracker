import { Controller } from 'Cake/Controller/Controller';
import { TableRegistry } from 'Cake/ORM/TableRegistry';
import { Configure } from 'Cake/Core/Configure';

import FB from 'fb';

function getOTFeed()
{
	return new Promise((resolve, reject) => {
		FB.api('oauth/access_token', {
			client_id: Configure.read('Facebook.feed.id'),
			client_secret: Configure.read('Facebook.feed.secret'),
			grant_type: 'client_credentials'
		}, function (res) {
			if(!res || res.error) {
				console.log(!res ? 'error occurred' : res.error);
				reject(res.error);
				return;
			}
			var accessToken = res.access_token;
			FB.setAccessToken(accessToken);
			FB.api('/osterlentracker/feed', function (res) {
				if(!res || res.error) {
				 console.log(!res ? 'error occurred' : res.error);
				 reject(res.error);
				 return;
				}
				resolve(res);
			});
		});
	});
}

export class SocialController extends Controller
{
	async initialize()
	{
		this.ForumPosts = TableRegistry.get('ForumPosts');
	}
	
	async getFeed()
	{
		let updatedItems = [];
		let result = await getOTFeed();
		
		let categoryId = 'cb0d55e2-dbca-7335-ec2f-3a167f552785';
		// Not yet ported forum posts
		for(let item of result.data) {
			updatedItems.push({
				id: item.id, // object_id
				date: item.created_time,
				from: item.from.name,
				type: item.type,
				message: item.message,
				link: item.link,
				picture: item.picture,
				source: "facebook"
			});
		}
		return updatedItems;
	}
	
}