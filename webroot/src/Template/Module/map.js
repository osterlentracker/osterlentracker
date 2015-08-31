import $ from 'jquery';
import leaflet from 'leaflet';

export class Map
{
	element = null;
	map = null;
	resolve = null;
	reject = null;
	constructor()
	{
		this.id = 'map_'+(new Date().getTime());
	}
	
	bind(selector)
	{
		this.element = $(selector);
		this.element.attr({id: this.id});
		this.map = new leaflet.Map(this.id, {
			zoomControl: false
		});
		this.initialize();
	}
	
	initialize()
	{
		this.map.addLayer(new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© Österlentracker | Kartdata © <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a> | Åskdata © <a target="_blank" href="http://www.blitzortung.org/">Blitzortung</a>'
		}));
		this.setView(55.634120, 13.700738, 6);
		this.map.on('click', (event) => {
			if(this.resolve !== null){
				this.resolve(event.latlng);
				this.resolve = null;
				this.reject = null;
			}
		});
	}
	
	setView(lat, lng, zoom)
	{
		this.map.setView(new L.LatLng(lat, lng), zoom);
	}
	
	click()
	{
		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
	
	dispose()
	{
		if(this.reject !== null){
			this.reject(null);
			this.resolve = null;
			this.reject = null;
		}
	}
}