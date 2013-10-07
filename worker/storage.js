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
	
	var getLatestAnalysis = function(serie, cb) {
		
		return model.find("timeserie", {
			
			rule: serie,
			limit: 1,
			
			sort: {
				time: -1
			},
			
		}, cb);
		
	}; exports.getLatestAnalysis = getLatestAnalysis;
	
	var getTimeSpan = function(serie, rest, cb) {
		
		var time_restriction = {}
		time_restriction["$lt"] = rest.max;
		time_restriction["$gt"] = rest.min;
		
		if(!time_restriction["$lt"] || !time_restriction["$lt"])
			throw new Error("Timespan restriction not defined. " + 
				"Don't forget to specify both max and min time values.");
			
		return model.find("timeserie", {
			
			rule: serie,
			time: time_restriction,
			limit: 10,
			
			sort: {
				time: -1
			},
			
		}, cb);
		
	}; exports.getTimeSpan = getTimeSpan;
	
	var getItems = function(serie, rest, cb) {
		
		return model.find("timeserie", rest, cb);
		
	}; exports.getItems = getItems;
	
	var init = function() {
		return exports;
	}
	
	return init();
}

module.exports = new Manager();