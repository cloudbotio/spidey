var hoard = require("hoard");
var model = require("../api/adapters/model");

var Manager = function() {
	
	var exports = {};
	
	var addItem = function(data, cb) {
		
		cb = cb || function(){};
			
		if(!data.serie && !data.rule)
			throw new Error("No data serie defined");
		
		else if(!data.value && !data.values)
			throw new Error("No data values defined");
		
		else {
			var item = model.create("timeserie", {
				rule: data.serie || data.rule,
				time: data.time || (new Date()).getTime(),
				values: data.values || data.value
			});
				
			model.save(item, cb);
		}
		
	}; exports.addItem = addItem;
	
	var getLastAnalysis = function(serie, cb) {
		
		return model.find("timeserie", {
			
			rule: serie,
			limit: 1
			
		}, cb);
		
	}; exports.getLastAnalysis = getLastAnalysis;
	
	var getItems = function(serie, rest, cb) {
		
		return model.find("timeserie", rest, cb);
		
	}; exports.getItems = getItems;
	
	var init = function(){
		return exports;
	}
	
	return init();
}

module.exports = new Manager();