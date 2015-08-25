import ko from "knockout";
import settingsTemplate from "./settings.html!text";
import AuthenticationService from "services/authentication"
import './settings.css!'

import interactivemap from "components/interactivemap/interactivemap"
import { Map, LatLng, Marker, Circle, CircleMarker, LayerGroup } from "modules/leaflet";

import { delay } from "modules/utils";

class WarningZone {
	constructor(viewModel, data = null){
		this.latitude = ko.observable(null);
		this.longitude = ko.observable(null);
		this.viewModel = viewModel;
		this.radius = ko.observable('50');
		this.amount = ko.observable('10');
		this.email = ko.observable(false);
		this.sms = ko.observable(false);
		this.name = ko.observable("");
		if(data !== null){
			this.latitude(data.latitude);
			this.longitude(data.longitude);
			this.radius(data.radius);
			this.amount(data.amount);
			this.sms(data.sms);
			this.email(data.email);
			this.name(data.name);
		}
		this.radius.subscribe(() => {
			this.viewModel.rebuildMarkers();
		});
		this.latitude.subscribe(() => {
			if(this.latitude() !== null && this.longitude() !== null){
				this.viewModel.rebuildMarkers();
			}
		});
		this.longitude.subscribe(() => {
			if(this.latitude() !== null && this.longitude() !== null){
				this.viewModel.rebuildMarkers();
			}
		});
	}
	remove(){
		this.viewModel.warningZones.remove(this);
		this.viewModel.rebuildMarkers();
	}
}

class settingsViewModel {
	constructor() {			
		this.title = ko.observable('Inställningar');
		this.fields = ko.observable({
			'options': {
				'news': false,
				'email': false,
				'sms': false
			},
			'email': {
				'value': '',
				'error': null
			},
			'cell_phone': {
				'value': '',
				'error': null
			}
		});
		this.error = ko.observable(null);
		this.display = ko.observable(false);
		this.controlsVisible = ko.observable(true);
		this.warningZones = ko.observableArray();
		this.warningZones.subscribe(() => {
			this.rebuildMarkers();
		});
		interactivemap.viewModel.parent = this;
		this.create();
	}
	
	async init() {
		await AuthenticationService.wait();
		if(AuthenticationService.user() !== null){
			interactivemap.viewModel.abort();
			interactivemap.viewModel.initialize();
		}
		await delay(2000);
		interactivemap.viewModel.parent.rebuildMarkers();
	}
	
	async create(){
		await this.load();
	}
	
	async load(){
		//Waits for Authentication to be done
		await AuthenticationService.wait();
		try{
			var data = await client.call('Settings', 'load'); 
			this.fields(data.fields);
			for(var warning of data.warnings){
				var warningZone = new WarningZone(this, warning);
				this.warningZones.push(warningZone);
			}
			this.rebuildMarkers();
			this.display(true);
		}catch(e){
			console.log(e);
		}
	}
	
	async onSaveSettings(form){ 
		this.error(null);
		try{
			var warningZones = [];
			for(var warningZone of this.warningZones()){
				if(warningZone.latitude() !== null){
					warningZones.push({
						latitude: warningZone.latitude(),
						longitude: warningZone.longitude(),
						radius: warningZone.radius(),
						amount: warningZone.amount(),
						name: warningZone.name(),
						sms: warningZone.sms(),
						email: warningZone.email()
					});
				}
			}
			var data = await client.call('Settings', 'save', {
				fields: this.fields(),
				warningZones: warningZones
			});
			this.fields(data.fields);
			this.error(data.error);
		}catch(e){
			console.log(e);
		}
	}
	
	async createNewWarningZone(){
		this.controlsVisible(false);
		var warningZone = new WarningZone(this);
		this.warningZones.unshift(warningZone);
		try{
			var latlng = await interactivemap.viewModel.click();
			warningZone.latitude(latlng.lat);
			warningZone.longitude(latlng.lng);
		}catch(e){
			
			this.warningZones.remove(warningZone);
			console.log(e);
		}
		this.controlsVisible(true);
	}
	
	async rebuildMarkers(){
		if(interactivemap.viewModel.markerGroup !== null){
			interactivemap.viewModel.markerGroup.clear();
			for(var warningZone of this.warningZones()){
				if(warningZone.latitude() !== null && warningZone.longitude() !== null){
					interactivemap.viewModel.markerGroup.add(new Circle(new LatLng(warningZone.latitude(), warningZone.longitude()), warningZone.radius()*1000));
				}
			}
		}
	}
	
	async cancel(){
		interactivemap.viewModel.abort();
	}
}

export default { viewModel: new settingsViewModel(), template: settingsTemplate }; 