/**
 * 
 */
export class AppViewModel
{
	// 
	_parameters = [];

	/**
	 * 
	 */
	constructor()
	{
	}
        
	/**
	 * 
	 */
	activate(params, routeConfig, navigationInstruction)
	{
		//
		// Save arguments...
		//
		if ('path' in params) {
			this._parameters = params.path.split('/').slice(2);
		}
		
		//
		// Call action method if it exists...
		//
		let action = 'index';
		if (this._parameters.length > 0 && isNaN(this._parameters[0])) {
			action = this._parameters[0];
		}
		if (action in this) {
			this[action].apply(null, this._parameters);
		}
	}
}