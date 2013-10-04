var lang = require("../../../language").getDefault();

var model = require("../../../api/adapters/model");
var config = require("../../../config/bundles.json");
var parser = require('blindparser');

var RssReader = function(config) {
	
	var exports = {};
	var task = null;
	
	var setTask = function(t) {
		
		task = t;
		
	}; exports.setTask = setTask;
	
	var getItems = function(cb){
		
		cb = cb || function(){};
		
		// check required parameters
		if(!task)
			throw new Error(lang.bundle.no_task || "Invalid or incorrect task specification");
			
		if(!task.url)
			throw new Error(lang.bundle.no_url || "Missing or invalid url string");
		
		parser.parseURL(task.url, function(err, out){
			
			var meta = {
				
				source: out.metadata.title,
				url: task.url || out.metadata.url || ""
			};
			
			var items = [];
			
			for(var i = 0; i < out.items; i++) {
			
				items.push(model.create("item", {				
					title: string(out.items[i].title).humanize().s,
					content: out.items[i].desc,
					pubDate: (new Date(out.items[i].date)).toISOString(),
					meta: meta,
					url: out.items[i].link || meta.url || task.url || ""
				}));
			}
			
			cb(items);
		});
		
	}; exports.getItems = getItems;
	
	var init = function(){
		return exports;
	};
	
	return init(config);
};

module.exports = new RssReader(config);