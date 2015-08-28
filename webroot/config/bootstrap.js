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
        config.map([
            { name: 'home', route: '', href: '#', moduleId: 'src/Template/Home/index', title: 'Hem' },
            { name: 'forum', route: 'forum', href: '#forum', moduleId: 'src/Template/Forum/index', title: 'Forum' },
            { name: 'about', route: 'about', href: '#about', moduleId: 'src/Template/About/index', title: 'Om oss' },
            { name: 'donate', route: 'donate', href: '#donate', moduleId: 'src/Template/Donate/index', title: 'Donera' }
            
        ]);
        config.mapUnknownRoutes(instruction => {
			
			let url = instruction.fragment.split('/').slice(1);
			
			if(url[0] === "_=_"){
				url = [""];
				window.location.href = "/#/";
			}
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
        
        this.router = router;
    }    
}