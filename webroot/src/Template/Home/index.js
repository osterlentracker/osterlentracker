import $ from 'jquery';

import { AppViewModel } from 'App/Template/AppViewModel';
import { TrackerMap } from 'App/Module/TrackerMap';

export class Index extends AppViewModel
{	
	constructor()
	{
		super();
		this.map = new TrackerMap();
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