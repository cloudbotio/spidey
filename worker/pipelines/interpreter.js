var log = require("winston");

var async = require("async");
var util = require('util');

var model = require("../../api/adapters/model");

module.exports = function(){

	var exports = {};
	var fn = function(){};

	var items = [];
	var context = {};
	var steps = [];

	function PipelineFactory(name, ctx) {

		c = ctx || context || {};

		log.info("Starting '"+name+"' pipeline...");

		var p = require("../pipelines/" + name);
		return new p(c);
	}

	function input(input, ctx){

		context = ctx || {};
		var rule = input;

		// ------  time shortcuts ------ //

		if(rule["time"] && typeof rule["time"] === typeof "str") {

			rule.steps.unshift({

				"pipeline": "time",
					"method": "timestring",
					"input": rule["time"]
			});

			delete rule["time"];
		}

		else if(rule["after"]) {

			rule.steps.unshift({

				"pipeline": "time",
					"method": "after",
					"input": rule["after"],
					"output": "items"
			});

			delete rule["after"];
		}

		else if(rule["before"]) {

			rule.steps.unshift({

				"pipeline": "time",
					"method": "before",
					"input": rule["before"],
					"output": "items"
			});

			delete rule["before"];
		}

		for(var i = 0; i < rule.steps.length; i++) {

			var s = rule.steps[i];

			if(s.input && s.input.length && 
				typeof s.input !== typeof "string") {
			
				for(var j = 0; j < s.input.length; j++) {

					var partial = JSON.parse(JSON.stringify(s));
					partial.input = s.input[j];

					partial.preserveContext = true;

					steps.push(partial);
				}
			}

			else
				steps.push(s);
		}

	}; exports.input = input;

	function next(cb) {

		cb = cb || fn;

		var s = steps.shift();

		var pipeline = PipelineFactory(s.pipeline, context);
		var method = pipeline[s.method];

		method((s.input || {}), function(res){

			if(util.isError(res))
				cb(err);

			else {

				if(s.preserveContext)
					for(var k in res)
						context[k] = res[k];
				else
					context = res;
				
				cb(null, res);
			}	
		});
	}

	function result(cb) {

		cb = cb || fn;

		if(steps.length > 0) {

			next(function(err, res){

				if(err)
					cb(err, null)
				else
					result(cb);
			});
		}

		else
			cb(context);

	}; exports.result = result;

	function init(){
		return exports;
	};

	return init();	
};