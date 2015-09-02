import { Map } from 'App/Module/Map';
import { Tracker } from 'App/Service/Tracker';

export class TrackerMap extends Map
{
	constructor()
	{
		super();
		this.tracker = Tracker.getInstance();
	}
}