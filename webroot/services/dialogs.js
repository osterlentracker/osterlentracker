import $ from 'jquery';
//import foundation from 'foundation';
import ko from 'knockout'
import { delay } from "modules/utils";

class DialogService {  
	showModal(title, lead, content, closeLabel) {
		$("body").append(`<div id="myModal" class="reveal-modal" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog">
							<h2 id="modalTitle">${title}</h2>
							<p class="lead">${lead}</p>
							<p>${content}</p>
							<a class="close-reveal-modal" aria-label="${closeLabel}">&#215;</a>
						  </div>`);
				  
		$('#myModal').foundation('reveal', 'open');
	}
}

export default new DialogService();