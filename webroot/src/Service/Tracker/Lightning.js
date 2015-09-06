import $ from 'jquery';
import leaflet from 'leaflet';

export class Lightning
{
	time = null;
	latitude = null;
	longitude = null;
	marker = null;
	
	constructor(json = null)
	{
		if(json !== null && typeof json === 'object'){
			if('time' in json){
				this.time = json.time;
			}
			if('latitude' in json){
				this.latitude = json.latitude;
			}
			if('longitude' in json){
				this.longitude = json.longitude;
			}
		}
		
		this.marker = L.marker([55.634120, 13.700738], {icon: 
			L.divIcon({className: 'fa fa-bolt strike'})
		});
	}
}