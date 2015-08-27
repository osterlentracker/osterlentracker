import { AppViewModel } from 'App/Template/AppViewModel';
import { HttpClient } from 'aurelia-fetch-client';

/**
 * 
 */
export class NetViewModel extends AppViewModel
{
	static inject = [HttpClient];
	
	/**
	 * 
	 */
	constructor(http)
	{
		super();
		
		//
		// TODO
		// * Read baseurl from a configuration file.
		//
		http.configure(config => {
			config
				.useStandardConfiguration()
				.withBaseUrl('http://addelajnen.se.web.int:8081');
		});
	
		this.http = http;
	}	
}