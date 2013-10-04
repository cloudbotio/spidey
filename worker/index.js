var config = require("../config/general");
config = config[config.state];

var log = require("winston");

var Worker = require("./worker");
var Watcher = require("./watcher");

var WorkerManager = function(config){
	
	var DEFAULT_WATCHERS_NUM = config.watchers || 10;
	var DEFAULT_WORKERS_NUM = config.workers || 10;
	
	var exports = {};
	var workers = [];
	var watchers = [];
	
	var prepare = function(){
		
		for(var i = 0; i < DEFAULT_WATCHERS_NUM; i++)
			watchers.push(new Watcher());
		
		for(var i = 0; i < DEFAULT_WORKERS_NUM; i++)
			workers.push(new Worker());
	};
	
	var startAll = function() {
		
		log.info("worker manager says: starting " + watchers.length + 
				 " watcher"+(watchers.length > 1 ? "s": "")+"...");
		
		for(var i = 0; i < watchers.length; i++)
			watchers[i].start()
			
		log.info("worker manager says: starting " + workers.length + 
				 " worker"+(workers.length > 1 ? "s": "")+"...");
			
		for(var i = 0; i < workers.length; i++)
			workers[i].start()
			
	}; exports.startAll = startAll;
	
	var stopAll = function() {
		
		for(var i = 0; i < watchers.length; i++)
			watchers[i].start()
			
		for(var i = 0; i < workers.length; i++)
			workers[i].start()
			
	}; exports.stopAll = stopAll;
	
	var init = function(){
		log.info("worker manager says: starting manager...");
		prepare();
		return exports;
	}
	
	return init();
}

module.exports = new WorkerManager(config);