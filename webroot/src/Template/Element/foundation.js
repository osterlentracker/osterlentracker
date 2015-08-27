import $ from 'jquery';
import 'foundation';
import 'foundation/js/foundation/foundation.offcanvas'

export class Foundation
{
	attached ()
	{
		console.log("Active");
		$(document).foundation();
	}
}