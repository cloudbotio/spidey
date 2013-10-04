var util = require("util");
var scrap = require("nom");
var string = require("string");

var lang = require("../../../language").getDefault();
var model = require("../../../api/adapters/model");

var Scrapper = function(){
	
	var exports = {};
	var task = null;
	
	var setTask = function(t) {
		task = t;
	}; exports.setTask = setTask;
	
	var getItems = function(cb){
		
		// check required parameters
		if(!task)
			throw new Error(lang.bundle.no_task || "Invalid or incorrect task specification");
			
		if(!task.url)
			throw new Error(lang.bundle.no_url || "Missing or invalid url");
		
		// check query
		if(task.q) {
			var request_url = util.format(task.url, encodeURI(task.q));
		}
		else {
			var request_url = task.url;
		}
		
		scrap(request_url, function(err, $) {
			
			if(err)
				throw new Error("Problem scrapping webpage: " + err.toString());
			
			var items = [];
			
			items.push(model.create("item", {
							
				title: string($('title').text()).humanize().s,
				content: $('body').text(),
				meta: {
					q: task.q,
					raw: $('html').html() || $('html').text() || ""
				},
				url: task.url
			}));
						
			cb(items)
		});
		
	}; exports.getItems = getItems;
	
	var get = function(cb){
		
		cb = cb || function(){};
		
		// check required parameters
		if(!task)
			throw new Error(lang.bundle.no_task || "Invalid or incorrect task specification");
			
		if(!task.url)
			throw new Error(lang.bundle.no_url || "Missing or invalid url");
		
		// check query
		if(task.q) {
			var request_url = util.format(task.url, encodeURI(task.q));
		}
		else {
			var request_url = task.url;
		}
		
		return scrap(request_url, function(err, $) {
			
			if(err)
				throw new Error("Problem scrapping webpage: " + err.toString());
						
			cb($)
		});
	
	}; exports.get = get;
	
	var init = function(){
		return exports;
	}
	
	return init();
};

module.exports = new Scrapper();
