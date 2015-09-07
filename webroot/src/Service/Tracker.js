import cakejs from 'cakejs';

import { LightningContainer } from 'App/Service/Tracker/LightningContainer';
import { Lightning } from 'App/Service/Tracker/Lightning';


export class Tracker
{
	static _instance = null;
	static getInstance()
	{
		if(Tracker._instance === null){
			Tracker._instance = new Tracker();
		}
		return Tracker._instance;
	}
	
	realtime = null;
	
	constructor()
	{
		this.realtime = new LightningContainer();
		cakejs.on('lightning', (data) => {
			this.realtime.add(new Lightning(data));
		});
		this._initialize();
	}
	
	async _initialize()
	{
		let lightnings = await cakejs.call('Tracker', 'loadPartial');
		
	}
}