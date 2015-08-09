import $ from "jquery";
import ko from "knockout";
import projections from "../js/knockout/knockout-projections.min";

import router from "modules/router";
import components from "./components";

import Main from "./main";

//import test from "./test";
//
//for(var item of test()) {
//	console.log(item);
//}

ko.applyBindings(Main);