import ko from "knockout";
import $ from "jquery";
import trackerTemplate from "./tracker.html!text";
import './tracker.css!'

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

class Lightning {
	constructor(data = null){
		this.latitude = data.la;
		this.longitude = data.ln;
		this.time = new Date(data.t);
		this.create();
	}
	create(){
		this.marker = new Circle(new LatLng(this.latitude, this.longitude), 500);
		this.marker.setStyle({ 
			fillColor: rgbToHex(0, 153, 204),
			fillOpacity: 0.8,
			color: rgbToHex(0, 153, 204),
			opacity: 0.8
		});
		this.visible = false;
	}
}

class LightningCollection {
	constructor(data = null){
		this.lightnings = [];
		this.updateDateTime = true;
		this.beginDateTime = new Date();
		this.hours = 0.5;
		this.endDateTime = new Date().modify(-3600 * this.hours);
		this.visibleBeginDateTime = this.beginDateTime;
		this.visibleEndDateTime = this.endDateTime;
		this.layer = new LayerGroup();
		
		this.beginIndex = 0;
		this.endIndex = 0;
		this.visibleLightnings = 0;
		this.lastDecimal = -1;
	}
	add(data = null){
		try{
			var lightning = new Lightning(data);
			if(this.lightnings.length === 0){
				this.lightnings.unshift(lightning);
			}else{
				if(lightning.time >= this.lightnings[0].time){
					this.lightnings.unshift(lightning);
				}else{
					this.lightnings.push(lightning);
				}
			}
			if(this.lastDecimal === 0){
				lightning.visible = true;
				this.layer.add(lightning.marker);
			}
		}catch(e){
			console.log(e);
		}
	}
	recreate(){
		this.layer = new LayerGroup();
		for(var i = 0; i < this.lightnings.length; i++){
			this.lightnings[i].create();
		}
	}
	update(decimal = 0, spanInSeconds = 300){
		this.lastDecimal = decimal;
		if(this.updateDateTime){
			this.beginDateTime = new Date();
			this.endDateTime = new Date().modify(-3600 * this.hours);
			while(this.lightnings.length > 0 && this.lightnings[this.lightnings.length - 1].time < this.endDateTime){
				this.layer.remove(this.lightnings.pop().marker);
			}
		}
		
		//Calculation of interval
		var beginDateTime = this.beginDateTime;
		var endDateTime = this.endDateTime.modify(spanInSeconds);
		var rangeInSeconds = (beginDateTime - endDateTime) / 1000;
		var point = rangeInSeconds * decimal;
		beginDateTime = beginDateTime.modify(-point);
		endDateTime = beginDateTime.modify(-spanInSeconds);
		this.visibleBeginDateTime = beginDateTime;
		this.visibleEndDateTime = endDateTime;
		
		//Fixing indexes
		if(this.endIndex > this.lightnings.length){
			this.endIndex = this.lightnings.length;
		}
		if(this.beginIndex > this.endIndex){
			this.beginIndex = this.endIndex;
		}
		//console.log(beginDateTime);
		//console.log(endDateTime);
		
		//Moves indexes
		if(this.lightnings.length > 0){
			//Expanding indexes
			var beginIndex = this.beginIndex;
			var endIndex = this.endIndex;
			while(beginIndex > 0 && this.lightnings[beginIndex-1].time <= beginDateTime){
				beginIndex--;
			}
			while(endIndex < this.lightnings.length && this.lightnings[endIndex].time >= endDateTime){
				endIndex++;
			}
			
			//Shrinking indexes
			while(beginIndex < endIndex && this.lightnings[beginIndex].time >= beginDateTime){
				beginIndex++;
			}
			while(endIndex >= beginIndex && endIndex > 0 && this.lightnings[endIndex-1].time <= endDateTime){
				endIndex--;
			}
			
			while(this.beginIndex != beginIndex){
				if(this.beginIndex < this.lightnings.length){
					var lightning = this.lightnings[this.beginIndex];
					if(lightning.visible){
						lightning.visible = false;
						this.layer.remove(lightning.marker);
					}
				}
				if(this.beginIndex > beginIndex){
					this.beginIndex--;
				}else{
					this.beginIndex++;
				}
			}
			
			while(this.endIndex != endIndex){
				if(this.endIndex > endIndex){
					this.endIndex--;
				}else{
					this.endIndex++;
				}
				if(this.endIndex < this.lightnings.length){
					var lightning = this.lightnings[this.endIndex];
					if(lightning.visible){
						lightning.visible = false;
						this.layer.remove(lightning.marker);
					}
				}
			}
			//console.log(this.beginIndex+", "+this.endIndex);
			this.visibleLightnings = 0;
			for(var index = this.beginIndex; index < this.endIndex; index++){				
				this.visibleLightnings++;
				var lightning = this.lightnings[index];
				if(!lightning.visible){
					lightning.visible = true;
					this.layer.add(lightning.marker);
				}
				var lightningRangeInSeconds = (lightning.time - endDateTime) / 1000;
				var lightningDecimal = Math.round((lightningRangeInSeconds / spanInSeconds)*100)/100;
				var lightningSecondsSinceSpanStart = Math.round(spanInSeconds - lightningRangeInSeconds);
				if(lightningSecondsSinceSpanStart < 60){
					lightning.marker.setStyle({ 
						fillColor: rgbToHex(0, 153, 204),
						fillOpacity: 0.8,
						color: rgbToHex(0, 153, 204),
						opacity: 0.8
					});
				}else{
					lightning.marker.setStyle({ 
						fillColor: rgbToHex(255,(200*lightningDecimal)+55,0),
						fillOpacity: 0.8,
						color: rgbToHex(255,(200*lightningDecimal)+55,0),
						opacity: 0.8
					});
				}
			}
		}
	}
}



class trackerViewModel {
	constructor(){
		this.cycleTimeout = null;
		this.slider = ko.observable(0);
		this.length = ko.observable(1800);
		this.lightnings = ko.observable(0);
		this.refreshInterval = ko.observable(200);
		this.beginDateTime = ko.observable(new Date().format('yyyy-MM-dd hh:mm:ss'));
		this.endDateTime = ko.observable(new Date().format('yyyy-MM-dd hh:mm:ss'));
		this.visibleBeginDateTime = ko.observable(new Date().format('yyyy-MM-dd hh:mm:ss'));
		this.visibleEndDateTime = ko.observable(new Date().format('yyyy-MM-dd hh:mm:ss'));
		this.lightningsTotal = ko.observable(0);
		this.show_history = ko.observable(false);
		this.sub1 = this.slider.subscribe(() => {
			this.onUpdate();
		});
		this.sub2 = this.length.subscribe(() => {
			this.onUpdate();
		});
		this.create();
	}
	async fetchSixHours(me, item){
		$(item.currentTarget).hide();
		var lightnings = await client.get('Tracker', 'fetchSixHours');
		if(this.cycleTimeout !== null){
			clearTimeout(this.cycleTimeout);
			this.cycleTimeout = null;
		}
		this.lightningGroup.remove(this.selectedLightningCollection.layer);
		this.lightningCollections = {
			realtime: new LightningCollection()
		};
		this.selectedLightningCollection = this.lightningCollections.realtime;
		this.lightningGroup.add(this.selectedLightningCollection.layer);
		this.selectedLightningCollection.hours = 6;
		for(var i = lightnings.length-1; i >= 0; i--){
			this.lightningCollections.realtime.add(lightnings[i]);
		}
		this.show_history(true);
		this.process();
		this.length(1800);
	}
	async onUpdate(){
		this.sub1.dispose();
		this.sub2.dispose();
		this.process();
		this.sub1 = this.slider.subscribe(() => {
			this.onUpdate();
		});
		this.sub2 = this.length.subscribe(() => {
			this.onUpdate();
		});
	}
	async create(){
		if(this.cycleTimeout !== null){
			clearTimeout(this.cycleTimeout);
			this.cycleTimeout = null;
		}
		this.lightningCollections = {
			realtime: new LightningCollection()
		};
		this.selectedLightningCollection = this.lightningCollections.realtime;
		var lightnings = await client.get('Tracker', 'fetch');
		for(var i = lightnings.length-1; i >= 0; i--){
			this.lightningCollections.realtime.add(lightnings[i]);
		}
		
		client.on("new_lightning", (d) => this.onReceive(d));
	}
	async initialize() {
		
		await delay(500);
		
		this.mapContainerId = "map_"+Math.floor((Math.random() * 10) + 1)+Math.floor((Math.random() * 10) + 1)+Math.floor((Math.random() * 10) + 1)+Math.floor((Math.random() * 10) + 1)+Math.floor((Math.random() * 10) + 1)+Math.floor((Math.random() * 10) + 1);
		
		$(".map").attr("id", this.mapContainerId);
		
		this.map = new Map(this.mapContainerId);
		this.map.init();
		
		this.map.setMinZoom(6);
		this.map.setMaxZoom(8);
		$(".tracker").contents().filter(function(){ return this.nodeType != 1; }).remove();
		await delay(500);
		
		this.selectedLightningCollection.recreate();
		
		this.lightningGroup = new LayerGroup();
		this.lightningGroup.add(this.selectedLightningCollection.layer);		
		this.equipmentGroup = new LayerGroup();
		this.map.add(this.lightningGroup);		
		this.map.setView(55.633265, 13.701174, 7);
		setTimeout(() => {
			$("input[class='leaflet-control-layers-selector']").first().trigger('click');
		}, 100);
		this.process();
	}
	
	onReceive(data) {
		this.lightningCollections.realtime.add(data);
	}
	
	render(data) {
		this.lightningGroup.add(item.marker); 
	}
	
	process() {
		if(this.cycleTimeout !== null){
			clearTimeout(this.cycleTimeout);
			this.cycleTimeout = null;
		}
		var delta = new Date().getTime();
		this.selectedLightningCollection.update(this.slider(), this.length());
		this.lightnings(this.selectedLightningCollection.visibleLightnings);
		this.lightningsTotal(this.selectedLightningCollection.lightnings.length);
		this.beginDateTime(this.selectedLightningCollection.beginDateTime.format('yyyy-MM-dd hh:mm:ss'));
		this.endDateTime(this.selectedLightningCollection.endDateTime.format('yyyy-MM-dd hh:mm:ss'));
		this.visibleBeginDateTime(this.selectedLightningCollection.visibleBeginDateTime.format('yyyy-MM-dd hh:mm:ss'));
		this.visibleEndDateTime(this.selectedLightningCollection.visibleEndDateTime.format('yyyy-MM-dd hh:mm:ss'));
		delta = new Date().getTime() - delta;
		this.refreshInterval(delta*25);
		this.cycleTimeout = setTimeout(() => { 
			this.cycleTimeout = null;
			this.process();
		}, this.refreshInterval());
	}
}

export default { viewModel: new trackerViewModel(), template: trackerTemplate };