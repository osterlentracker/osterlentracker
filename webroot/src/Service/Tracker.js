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
	
	constructor()
	{
		
	}
}