import $ from 'jquery';

import { AppViewModel } from 'App/Template/AppViewModel';
import { Map } from 'Module/map';

export class Index extends AppViewModel
{	
	constructor()
	{
		super();
		this.map = new Map();
	}
	
	bind()
	{
		var interval = setInterval(() => {
			if($('.map').length > 0){
				clearInterval(interval);
				this.loaded();
			}
		}, 10);
	}
	
	async loaded()
	{
		this.map.bind('.map');
	}
	 
	unbind()
	{
		this.map.unbind();
	}
}