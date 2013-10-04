var map = require("./map");
var lang = require("../../language").getDefault();
var Bundle = require("./bundle");
var extend = require("extend");

var Interpreter = function(map) {
	
	var exports = {};
	
	var bundleFactory = function(task) {
		
		if(!task.bundle || !map[task.bundle])
            throw new Error(lang.interpreter.no_bundle 
				|| "Invalid task, no bundle specified");
		
		else {
			
			var bundleName = map[task.bundle] || task.bundle;
			
			if(typeof bundleName === typeof "str") {
				task.bundle = null;	
				return new Bundle(bundleName, task);
			}
			else {
				return new Bundle(bundleName, task);
			}
		}
	}

	var get = function(task, cb) {
		
		cb = cb || function(){};
		
		var bundle = bundleFactory(task);
		
		bundle.getItems(function(items){
			cb(items || []);
		});
		
	}; exports.get = get;

	var init = function(){
		return exports;
	}

	return init();
};

module.exports = new Interpreter(map);