var log = require("winston");

var bundleInterpreter = require("./bundles/interpreter");

var PipelineInterpreter = require("./pipelines/interpreter");
var pipelineInterpreter = new PipelineInterpreter();

var storage = require("./storage");

var Worker = function(q, t){

	// autostart
	var START_ON_INIT = false;
	var DEFAULT_TIMEOUT = 5000;

	var exports = {};
	var active = false;
	var queue = q || require("./queue") || null;
	var storage = require("./storage");

	var refreshIntervalId = null; 
	var timeout = t || DEFAULT_TIMEOUT;

	var start = function(timeout) {
		
		active = true;
		timeout = timeout || DEFAULT_TIMEOUT;

		work();

		setInterval(function(){

			if(!active && refreshIntervalId) {
				clearInterval(refreshIntervalId);
				return;
			}

			work();
			
		}, timeout);

	}; exports.start = start;

	var work = function() {

		queue.get(function(task){
			
			log.info("worker says: new task found! (rule: '"+task._id+"')");
			
			var _t = task;
			
			try {
			
				bundleInterpreter.get(task.source, function(items) {
					analysis(items, _t);
				});
			}
			
			catch(e) {
				log.info("worker says: problem running bundle interpreter. ", e.message);
			}
		});

	}; exports.work = work;
	
	var analysis = function(items, task) {
		
		pipelineInterpreter.input(task.tunnel, {result: items});

		pipelineInterpreter.result(function(result){
			
			log.info("worker says: task done successfully! (rule: '"+task._id+"')");
			
			storage.addItem({
				rule: task._id,
				values: result
			});
		});
	};

	var isActive = function(){

		return active ? true : false;

	}; exports.isActive = isActive;

	var stop = function() {
		
		active = false;

	}; exports.stop = stop;

	var init = function() {

		if(START_ON_INIT)
			start();
		
		return exports;
	};

	return init();
};

module.exports = Worker;
