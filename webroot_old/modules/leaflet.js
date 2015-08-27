import z from "css/leaflet.css!";
import L from "leaflet";

import { delay } from "modules/utils";

L.Icon.Default.imagePath='img/leaflet'

export class LatLng {
	constructor(latitude, longitude) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
}

export class Icon {
	constructor(iconUrl) {
		this._icon = L.icon({ iconUrl: iconUrl });
	}
}

export class Layer {
	constructor() {
		this._layer = null;
	}
}

export class Marker extends Layer {
	constructor(coordinate, options) {
		super();
		
		var _options = {};
		
		if("icon" in options) {
			_options.icon = options["icon"]._icon;
		}
		
		this._layer = new L.marker([coordinate.latitude, coordinate.longitude], _options); //.bindPopup('This is Littleton, CO.')
	}
}

export class Circle extends Layer {
	constructor(coordinate, radius = 10) {
		super();
		
		this._layer = new L.circle([coordinate.latitude, coordinate.longitude], radius); //.bindPopup('This is Littleton, CO.')
	}
	
	get coordinate() {
		return new LatLng(this._layer._latlng.lat, this._layer._latlng.lng);
	}
	
	set coordinate(value) {
		this._layer.setLatLng(value.latitude, value.longitude);
	}
	
	get radius() {
		return this._layer._radius;
	}
	
	set radius(value) {
		this._layer.setRadius(value);
	}
	
	get fill() {
		return this._layer.options.fill;
	}
	
	set fill(value) {
		this._layer.options.fill = value;
	}
	
	get fillColor() {
		return this._layer.options.fillColor;
	}
	
	set fillColor(value) {
		this._layer.setStyle({fillColor: value});
	}
	
	get stroke() {
		return this._layer.options.stroke;
	}
	
	set stroke(value) {
		this._layer.setStyle({stroke: value});
	}
	
	get color() {
		return this._layer.options.color;
	}
	
	set color(value) {
		this._layer.setStyle({color: value});
	}
	
	get opacity() {
		return this._layer.options.opacity;
	}
	
	set opacity(value) {
		this._layer.setStyle({opacity: value});
	}
	
	get weight() {
		return this._layer.options.weight;
	}
	
	set weight(value) {
		this._layer.setStyle({weight: value});
	}
	
	setStyle(options) {
		this._layer.setStyle(options);
	}
	
	redraw() {
		this._layer.redraw();
	}
}

export class CircleMarker extends Layer {
	constructor(coordinate, radius = 10) {
		super();
		
		this._layer = new L.circleMarker([coordinate.latitude, coordinate.longitude], { radius: radius }); //.bindPopup('This is Littleton, CO.')
	}
	
	get coordinate() {
		return new LatLng(this._layer._latlng.lat, this._layer._latlng.lng);
	}
	
	set coordinate(value) {
		this._layer.setLatLng(value.latitude, value.longitude);
	}
	
	get radius() {
		return this._layer._radius;
	}
	
	set radius(value) {
		this._layer.setRadius(value);
	}
	
	get fill() {
		return this._layer.options.fill;
	}
	
	set fill(value) {
		this._layer.options.fill = value;
	}
	
	get fillColor() {
		return this._layer.options.fillColor;
	}
	
	set fillColor(value) {
		this._layer.setStyle({fillColor: value});
	}
	
	get stroke() {
		return this._layer.options.stroke;
	}
	
	set stroke(value) {
		this._layer.setStyle({stroke: value});
	}
	
	get color() {
		return this._layer.options.color;
	}
	
	set color(value) {
		this._layer.setStyle({color: value});
	}
	
	get opacity() {
		return this._layer.options.opacity;
	}
	
	set opacity(value) {
		this._layer.setStyle({opacity: value});
	}
	
	get weight() {
		return this._layer.options.weight;
	}
	
	set weight(value) {
		this._layer.setStyle({weight: value});
	}
	
	setStyle(options) {
		this._layer.setStyle(options);
	}
	
	redraw() {
		this._layer.redraw();
	}
}

export class LayerGroup extends Layer {
	constructor(layers) {
		super();
		this._layer = new L.LayerGroup();
		this.items = [];
		
		if(layers !== undefined) {
			for(let layer of layers)
			{
				this.add(layer);
			}
		}
	}
	
	add(layer) {
		this.items.push(layer);
		layer._layer.addTo(this._layer)
	}
	
	remove(layer) {
		this.items.remove(layer);
		this._layer.removeLayer(layer._layer);
	}
	clear(){
		while(this.items.length > 0){
			var layer = this.items.shift();
			this._layer.removeLayer(layer._layer);
		}
	}
}

export class TileLayer extends Layer {
	constructor(url) {
		super();
		this.url = url;
	}
}

export class Map {
	constructor(id) {
		this.id = id;
		this.map = null;
		this.layers = [];
	}
	
	async init(){
		this.map = 
			L.map(this.id, { zoomControl: false })
			.addLayer(new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Kartdata © <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a> | Åskdata © <a target="_blank" href="http://www.blitzortung.org/">Blitzortung</a>'}));
	}
	
	setView(lat, long, zoom) {
		this.map.setView(new L.LatLng(lat, long), zoom);
	}
	
	setZoom(value) {
		this.map.setZoom(value);
	}
	
	setMinZoom(value) {
		this.map.options.minZoom = value;
//		this.map.setMinZoom(value);
	}
	
	setMaxZoom(value) {
		this.map.options.maxZoom = value;
//		this.map.setMaxZoom(value);
	}
	
	add(layer) {
		this.layers.push(layer);	
		layer._layer.addTo(this.map);
	}
	
	remove(layer) {
		this.layers.remove(layer);
		this.map.removeLayer(layer._layer);
	}
	
	addLayers(layers, overlays) {
		var layers2 = {};e
		var overlays2 = {};
		for(let id in layers) {
			layers2[id] = layers[id]._layer;
		}
		for(let id in overlays) {
			overlays2[id] = overlays[id]._layer;
		}
		L.control.layers(layers2, overlays2).addTo(this.map);
	}
	
	clear() {
		var layers2 = this.layers.slice();
		this.layers2.forEach((layer) => {
			this.layers.remove(layer);
			this.map.removeLayer(layer._layer);
		});
	}

	locate() {
		this.map.locate();
	} 
	on(event, callback){
		this.map.on(event, callback);
	}
}


