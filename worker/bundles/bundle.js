var lang = require("../../language").getDefault();

var Bundle = function(name, task) {
	
	var exports = {};
	
	var getByName = function(name){
		
		try {
			exports = require("./" + name);
		}
		catch(e){		
			throw new Error(lang.bundle.invalid + " " + e.message|| "Invalid or incorrect bundle name.");
		}
	}
	
	var init = function(name) {
		
		getByName(name);
		exports.setTask(task);
		return exports;
	}
	
	return init(name);
}

module.exports = Bundle;