import {routes} from 'config/routes';

/**
 * 
 */
export class bootstrap
{	
	/**
	 * 
	 */
    configureRouter(config, router)
    {
        config.mapUnknownRoutes(instruction => {
			
			let url = instruction.fragment.split('/').slice(1);
			
			//
			// TODO
			// Maybe switch to regexp and more error handling...
			// Define src/templates... in a configuration file?
			//
			
			let controller = url[0];
			if (controller.length === 0)
				controller = '/';

			if (controller in routes) {
				controller = routes[controller];
			}
			let action = 'index';
			if (url.length > 1 && isNaN(url[1])) {
				action = url[1];
			}
			instruction.config.moduleId = 'src/Template/' + controller + '/' + action;
        });
    }    
}