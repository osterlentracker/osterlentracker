import ko from "knockout";
import $ from "jquery";
import interactivemapTemplate from "./interactivemap.html!text";
import './interactivemap.css!'

import { Map, LatLng, Marker, Circle, CircleMarker, LayerGroup } from "modules/leaflet";
import { delay } from "modules/utils";

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	r = Math.round(r);
	g = Math.round(g);
	b = Math.round(b);
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

class interactivemapViewModel {
	constructor(){
		this._resolve = null;
		this._reject = null;
		this.markerGroup = null;
	}
	click(){
		return new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
	}
	clear(){
		
	}
	abort(){
		if(this._reject !== null){
			this._reject("Click aborted");
			this._resolve = null;
			this._reject = null; 
		}
	}
	async initialize() {
		await delay(500);		
		this.mapContainerId = "map_"+Math.floor((Math.random() * 10) + 1)+Math.floor((Math.random() * 10) + 1)+Math.floor((Math.random() * 10) + 1)+Math.floor((Math.random() * 10) + 1)+Math.floor((Math.random() * 10) + 1)+Math.floor((Math.random() * 10) + 1);
		
		$(".map").attr("id", this.mapContainerId);
		
		this.map = new Map(this.mapContainerId);
		this.map.init();
		
		this.map.setMinZoom(6);
		this.map.setMaxZoom(8);
		$(".interactivemap").contents().filter(function(){ return this.nodeType != 1; }).remove();
		await delay(500);
		
		this.markerGroup = new LayerGroup();
		//this.markerGroup.add(this.selectedLightningCollection.layer);		
		this.map.add(this.markerGroup);	
		this.map.setView(55.633265, 13.701174, 7);
		this.map.on("click", (event) => {
			if(this._resolve !== null){
				this._resolve(event.latlng);
				this._resolve = null;
				this._reject = null;
			}
		});
	}
}

export default { viewModel: new interactivemapViewModel(), template: interactivemapTemplate };