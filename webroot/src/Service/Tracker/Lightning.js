export class Lightning
{
	time = null;
	latitude = null;
	longitude = null;
	
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
	}
}