import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';
import {ConventionalViewStrategy} from 'aurelia-framework';

/**
 * 
 */
LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.debug);

/**
 * 
 */
export function configure(aurelia) 
{
  aurelia.use
    .defaultBindingLanguage()
    .defaultResources()
    .history()
    .router()
    .eventAggregator();

  aurelia.start().then(a => a.setRoot('config/bootstrap', document.body));
}

/**
 * 
 */
ConventionalViewStrategy.convertModuleIdToViewUrl = function(moduleId){
  var id = (moduleId.endsWith('.js') || moduleId.endsWith('.ts')) ? moduleId.substring(0, moduleId.length - 3) : moduleId;
  
  //
  // TODO
  // Fix a better solution...
  //
  if (id.endsWith('bootstrap')) {
	  return 'src/Template/Layout/default.html';
  }
  
  return id + '.html';
}